"""
EmailService — Centralized outbound email dispatcher.

This is the ONLY place in the project where SMTP connections are established.
All application events that need to send email must call this service.

Architecture:
    Application Event
         │
         ▼
    EmailService
         │
         ▼
    Load Active SiteSettings (cached)
         │
         ▼
    Build Dynamic Django EmailBackend
         │
         ▼
    SMTP Server → Recipient

Security:
    - SMTP passwords are NEVER logged.
    - SMTP credentials are NEVER returned to API consumers.
    - The Fernet-encrypted password from SiteSettings is decrypted in-memory only.
"""

import logging
import smtplib
import socket
from dataclasses import dataclass, field
from typing import Optional

from django.core.mail import EmailMultiAlternatives
from django.core.mail.backends.smtp import EmailBackend
from django.template.loader import render_to_string
from django.utils import timezone

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Result object
# ---------------------------------------------------------------------------

@dataclass
class EmailResult:
    """Structured result returned by every EmailService dispatch method."""
    success: bool
    message: str
    error: Optional[str] = field(default=None)

    def to_dict(self) -> dict:
        return {
            "success": self.success,
            "message": self.message,
            "error": self.error,
        }


# ---------------------------------------------------------------------------
# EmailService
# ---------------------------------------------------------------------------

class EmailService:
    """
    Centralized, reusable email dispatcher driven by SiteSettings.

    Usage:
        result = EmailService.send_plain_email(
            subject="Hello",
            message="Welcome to InfinytTech.",
            recipient_list=["user@example.com"],
        )
        if result.success:
            ...
    """

    # -----------------------------------------------------------------------
    # Internal: backend factory
    # -----------------------------------------------------------------------

    @staticmethod
    def _get_site_settings():
        """Return the active SiteSettings or None.  Uses the cached service."""
        from apps.site_settings.services import get_active_site_settings
        return get_active_site_settings()

    @classmethod
    def _build_connection(cls) -> tuple[Optional[EmailBackend], Optional[EmailResult]]:
        """
        Build and return a Django SMTP EmailBackend from active SiteSettings.

        Returns:
            (connection, None)  on success.
            (None, EmailResult) on failure.

        SECURITY: The SMTP password is never logged or included in any
        returned structure.
        """
        site = cls._get_site_settings()

        if site is None:
            return None, EmailResult(
                success=False,
                message="Email could not be sent.",
                error="No active Site Settings found. Configure Platform Settings first.",
            )

        if not site.smtp_host:
            return None, EmailResult(
                success=False,
                message="Email could not be sent.",
                error="SMTP Host is not configured. Go to Platform Settings → Email to configure SMTP.",
            )

        use_tls = site.smtp_encryption == "tls"
        use_ssl = site.smtp_encryption == "ssl"

        try:
            connection = EmailBackend(
                host=site.smtp_host,
                port=site.smtp_port or (465 if use_ssl else 587),
                username=site.smtp_username or "",
                password=site.smtp_password or "",   # decrypted in-memory by the property
                use_tls=use_tls,
                use_ssl=use_ssl,
                fail_silently=False,
                timeout=10,
            )
            return connection, None

        except Exception as exc:
            # Log the exception type but NEVER log credentials.
            logger.error(
                "EmailService: Failed to build SMTP connection. "
                "host=%s port=%s encryption=%s error_type=%s",
                site.smtp_host,
                site.smtp_port,
                site.smtp_encryption,
                type(exc).__name__,
            )
            return None, EmailResult(
                success=False,
                message="Failed to initialise SMTP connection.",
                error=f"Connection error: {type(exc).__name__}: {exc}",
            )

    @classmethod
    def _get_sender(cls, site=None) -> str:
        """Return a formatted From address using SiteSettings values."""
        if site is None:
            site = cls._get_site_settings()

        if site:
            name = site.smtp_sender_name or site.company_name or "InfinytTech"
            email = site.smtp_sender_email or ""
            if email:
                return f"{name} <{email}>"
        return "InfinytTech <noreply@infinyttech.com>"

    # -----------------------------------------------------------------------
    # Public API
    # -----------------------------------------------------------------------

    @classmethod
    def send_email(
        cls,
        subject: str,
        recipient_list: list[str],
        plain_message: Optional[str] = None,
        html_message: Optional[str] = None,
        from_email: Optional[str] = None,
        fail_silently: bool = False,
    ) -> EmailResult:
        """
        Primary dispatcher.  Accepts plain text, HTML, or both.

        Args:
            subject:        Email subject line.
            recipient_list: List of recipient email addresses.
            plain_message:  Plain text body (used as fallback when HTML is provided).
            html_message:   HTML body (optional).
            from_email:     Override sender address.  Defaults to SiteSettings value.
            fail_silently:  If True, exceptions are suppressed (still returns EmailResult).

        Returns:
            EmailResult with success flag, message, and optional error detail.
        """
        if not recipient_list:
            return EmailResult(
                success=False,
                message="Email not sent.",
                error="recipient_list must contain at least one address.",
            )

        if not plain_message and not html_message:
            return EmailResult(
                success=False,
                message="Email not sent.",
                error="Either plain_message or html_message must be provided.",
            )

        connection, error_result = cls._build_connection()
        if error_result is not None:
            return error_result

        site = cls._get_site_settings()
        sender = from_email or cls._get_sender(site)
        body = plain_message or ""

        try:
            msg = EmailMultiAlternatives(
                subject=subject,
                body=body,
                from_email=sender,
                to=recipient_list,
                connection=connection,
            )
            if html_message:
                msg.attach_alternative(html_message, "text/html")

            msg.send(fail_silently=fail_silently)

            logger.info(
                "EmailService: Email sent successfully. subject=%r recipients=%s",
                subject,
                recipient_list,
            )
            return EmailResult(success=True, message="Email sent successfully.")

        except smtplib.SMTPAuthenticationError:
            logger.error(
                "EmailService: SMTP authentication failed. host=%s username=%s",
                site.smtp_host if site else "unknown",
                site.smtp_username if site else "unknown",
            )
            return EmailResult(
                success=False,
                message="Email could not be sent.",
                error="SMTP authentication failed. Check your username and password in Platform Settings.",
            )

        except (smtplib.SMTPConnectError, smtplib.SMTPServerDisconnected, ConnectionRefusedError):
            logger.error(
                "EmailService: SMTP server unreachable. host=%s port=%s",
                site.smtp_host if site else "unknown",
                site.smtp_port if site else "unknown",
            )
            return EmailResult(
                success=False,
                message="Email could not be sent.",
                error="Could not connect to SMTP server. Check the host and port in Platform Settings.",
            )

        except socket.timeout:
            logger.error("EmailService: SMTP connection timed out.")
            return EmailResult(
                success=False,
                message="Email could not be sent.",
                error="SMTP connection timed out. The server did not respond in time.",
            )

        except smtplib.SMTPException as exc:
            logger.error("EmailService: SMTPException: %s", type(exc).__name__)
            return EmailResult(
                success=False,
                message="Email could not be sent.",
                error=f"SMTP error: {exc}",
            )

        except Exception as exc:
            logger.exception("EmailService: Unexpected error while sending email.")
            if fail_silently:
                return EmailResult(success=False, message="Email failed silently.", error=None)
            return EmailResult(
                success=False,
                message="Email could not be sent.",
                error=f"Unexpected error: {type(exc).__name__}.",
            )

    @classmethod
    def send_plain_email(
        cls,
        subject: str,
        message: str,
        recipient_list: list[str],
        from_email: Optional[str] = None,
    ) -> EmailResult:
        """Send a plain-text email."""
        return cls.send_email(
            subject=subject,
            recipient_list=recipient_list,
            plain_message=message,
            from_email=from_email,
        )

    @classmethod
    def send_html_email(
        cls,
        subject: str,
        html_content: str,
        recipient_list: list[str],
        plain_content: Optional[str] = None,
        from_email: Optional[str] = None,
    ) -> EmailResult:
        """
        Send an HTML email with an optional plain-text fallback.

        If no plain_content is provided, a minimal plain-text version is
        automatically derived by stripping HTML tags.
        """
        if not plain_content:
            import re
            plain_content = re.sub(r"<[^>]+>", "", html_content)
            plain_content = " ".join(plain_content.split())  # normalise whitespace

        return cls.send_email(
            subject=subject,
            recipient_list=recipient_list,
            plain_message=plain_content,
            html_message=html_content,
            from_email=from_email,
        )

    @classmethod
    def send_template_email(
        cls,
        subject: str,
        template_name: str,
        recipient_list: list[str],
        context: Optional[dict] = None,
        from_email: Optional[str] = None,
    ) -> EmailResult:
        """
        Render an HTML email template with SiteSettings branding injected into the context.
        """
        if context is None:
            context = {}

        # Inject branding from SiteSettings
        site = cls._get_site_settings()
        
        context.setdefault("company_name", site.company_name if site else "InfinytTech")
        
        logo_url = None
        if site and site.primary_logo and hasattr(site.primary_logo, 'url'):
            logo_url = site.primary_logo.url
        context.setdefault("primary_logo", logo_url)
        
        context.setdefault("brand_colors", site.brand_colors if site and site.brand_colors else {})
        context.setdefault("support_email", site.support_email if site else None)
        context.setdefault("office_address", site.office_address if site else None)
        context.setdefault("social_links", site.social_links if site and site.social_links else {})
        
        context.setdefault("current_year", timezone.now().year)
        context.setdefault("subject", subject)

        try:
            html_content = render_to_string(template_name, context)
            return cls.send_html_email(
                subject=subject,
                html_content=html_content,
                recipient_list=recipient_list,
                from_email=from_email,
            )
        except Exception as exc:
            logger.exception("EmailService: Failed to render template '%s'.", template_name)
            return EmailResult(
                success=False,
                message="Email could not be sent.",
                error=f"Template rendering error: {type(exc).__name__}",
            )

    @classmethod
    def send_test_email(cls, recipient_email: str) -> EmailResult:
        """
        Send a diagnostic test email using the email template framework.
        
        Used by AdminSiteSettingsViewSet.test_email().
        """
        site = cls._get_site_settings()
        company = (site.company_name if site else None) or "InfinytTech"
        subject = f"Test Email from {company}"
        
        context = {
            "timestamp": timezone.now().strftime("%Y-%m-%d %H:%M:%S UTC"),
            "smtp_sender_name": site.smtp_sender_name if site else company,
        }

        return cls.send_template_email(
            subject=subject,
            template_name="emails/test_email.html",
            recipient_list=[recipient_email],
            context=context,
        )
