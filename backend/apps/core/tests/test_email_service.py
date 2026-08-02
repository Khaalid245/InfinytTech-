"""
Unit tests for apps.core.services.EmailService.

All SMTP connections are mocked — no real emails are sent.
"""

import smtplib
import socket
from unittest.mock import MagicMock, patch, PropertyMock

from django.test import TestCase

from apps.core.services import EmailService, EmailResult


# ---------------------------------------------------------------------------
# Helper: build a fake SiteSettings object
# ---------------------------------------------------------------------------

def _make_site(
    smtp_host="smtp.example.com",
    smtp_port=587,
    smtp_username="user@example.com",
    smtp_password="secret",
    smtp_encryption="tls",
    smtp_sender_name="InfinytTech",
    smtp_sender_email="noreply@infinyttech.com",
    company_name="InfinytTech",
):
    site = MagicMock()
    site.smtp_host = smtp_host
    site.smtp_port = smtp_port
    site.smtp_username = smtp_username
    site.smtp_password = smtp_password
    site.smtp_encryption = smtp_encryption
    site.smtp_sender_name = smtp_sender_name
    site.smtp_sender_email = smtp_sender_email
    site.company_name = company_name
    return site


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

class EmailServiceBuildConnectionTests(TestCase):
    """Test that EmailService._build_connection() handles config correctly."""

    def test_missing_site_settings_returns_error_result(self):
        with patch.object(EmailService, "_get_site_settings", return_value=None):
            conn, err = EmailService._build_connection()
        self.assertIsNone(conn)
        self.assertIsInstance(err, EmailResult)
        self.assertFalse(err.success)
        self.assertIn("No active Site Settings", err.error)

    def test_missing_smtp_host_returns_error_result(self):
        site = _make_site(smtp_host="")
        with patch.object(EmailService, "_get_site_settings", return_value=site):
            conn, err = EmailService._build_connection()
        self.assertIsNone(conn)
        self.assertFalse(err.success)
        self.assertIn("SMTP Host is not configured", err.error)

    def test_tls_connection_built_correctly(self):
        site = _make_site(smtp_encryption="tls")
        with patch.object(EmailService, "_get_site_settings", return_value=site):
            with patch("apps.core.services.email_service.EmailBackend") as MockBackend:
                MockBackend.return_value = MagicMock()
                conn, err = EmailService._build_connection()

        self.assertIsNone(err)
        call_kwargs = MockBackend.call_args[1]
        self.assertTrue(call_kwargs["use_tls"])
        self.assertFalse(call_kwargs["use_ssl"])

    def test_ssl_connection_built_correctly(self):
        site = _make_site(smtp_encryption="ssl")
        with patch.object(EmailService, "_get_site_settings", return_value=site):
            with patch("apps.core.services.email_service.EmailBackend") as MockBackend:
                MockBackend.return_value = MagicMock()
                conn, err = EmailService._build_connection()

        self.assertIsNone(err)
        call_kwargs = MockBackend.call_args[1]
        self.assertFalse(call_kwargs["use_tls"])
        self.assertTrue(call_kwargs["use_ssl"])

    def test_no_encryption_builds_plain_connection(self):
        site = _make_site(smtp_encryption="none")
        with patch.object(EmailService, "_get_site_settings", return_value=site):
            with patch("apps.core.services.email_service.EmailBackend") as MockBackend:
                MockBackend.return_value = MagicMock()
                conn, err = EmailService._build_connection()

        self.assertIsNone(err)
        call_kwargs = MockBackend.call_args[1]
        self.assertFalse(call_kwargs["use_tls"])
        self.assertFalse(call_kwargs["use_ssl"])

    def test_password_never_logged_on_exception(self):
        """If the backend raises, the password must not appear in any log output."""
        site = _make_site(smtp_password="supersecretpassword")
        with patch.object(EmailService, "_get_site_settings", return_value=site):
            with patch(
                "apps.core.services.email_service.EmailBackend",
                side_effect=Exception("something went wrong"),
            ):
                with self.assertLogs("apps.core.services.email_service", level="ERROR") as cm:
                    conn, err = EmailService._build_connection()

        # Password must NOT appear in any log record
        for record in cm.output:
            self.assertNotIn("supersecretpassword", record)
        self.assertFalse(err.success)


class EmailServiceSendEmailTests(TestCase):
    """Test send_email() routing and error handling."""

    def _patch(self, site, send_side_effect=None):
        """Context-manager helper: patches site settings + EmailMultiAlternatives.send()."""
        mock_msg = MagicMock()
        if send_side_effect:
            mock_msg.send.side_effect = send_side_effect

        patcher_site = patch.object(EmailService, "_get_site_settings", return_value=site)
        patcher_backend = patch("apps.core.services.email_service.EmailBackend", return_value=MagicMock())
        patcher_msg = patch("apps.core.services.email_service.EmailMultiAlternatives", return_value=mock_msg)
        return patcher_site, patcher_backend, patcher_msg, mock_msg

    def test_plain_text_email_sent_successfully(self):
        site = _make_site()
        ps, pb, pm, mock_msg = self._patch(site)
        with ps, pb, pm:
            result = EmailService.send_plain_email(
                subject="Hello",
                message="Hello World",
                recipient_list=["user@test.com"],
            )
        self.assertTrue(result.success)
        mock_msg.send.assert_called_once()

    def test_html_email_attaches_alternative(self):
        site = _make_site()
        ps, pb, pm, mock_msg = self._patch(site)
        with ps, pb, pm:
            result = EmailService.send_html_email(
                subject="Rich Email",
                html_content="<h1>Hello</h1>",
                recipient_list=["user@test.com"],
            )
        self.assertTrue(result.success)
        mock_msg.attach_alternative.assert_called_once_with("<h1>Hello</h1>", "text/html")

    def test_empty_recipient_list_returns_error(self):
        result = EmailService.send_email(
            subject="Test",
            recipient_list=[],
            plain_message="body",
        )
        self.assertFalse(result.success)
        self.assertIn("recipient_list", result.error)

    def test_missing_body_returns_error(self):
        result = EmailService.send_email(
            subject="Test",
            recipient_list=["user@test.com"],
        )
        self.assertFalse(result.success)
        self.assertIn("plain_message or html_message", result.error)

    def test_smtp_auth_failure_returns_friendly_error(self):
        site = _make_site()
        ps, pb, pm, mock_msg = self._patch(site, send_side_effect=smtplib.SMTPAuthenticationError(535, b"auth failed"))
        with ps, pb, pm:
            result = EmailService.send_plain_email("Sub", "Body", ["r@t.com"])
        self.assertFalse(result.success)
        self.assertIn("authentication failed", result.error)
        # Stack trace / raw exception NOT in result
        self.assertNotIn("Traceback", result.error or "")

    def test_smtp_connect_error_returns_friendly_error(self):
        site = _make_site()
        ps, pb, pm, mock_msg = self._patch(site, send_side_effect=smtplib.SMTPConnectError(111, b"conn refused"))
        with ps, pb, pm:
            result = EmailService.send_plain_email("Sub", "Body", ["r@t.com"])
        self.assertFalse(result.success)
        self.assertIn("connect to SMTP server", result.error)

    def test_socket_timeout_returns_friendly_error(self):
        site = _make_site()
        ps, pb, pm, mock_msg = self._patch(site, send_side_effect=socket.timeout())
        with ps, pb, pm:
            result = EmailService.send_plain_email("Sub", "Body", ["r@t.com"])
        self.assertFalse(result.success)
        self.assertIn("timed out", result.error)

    def test_missing_site_settings_returns_error(self):
        with patch.object(EmailService, "_get_site_settings", return_value=None):
            result = EmailService.send_plain_email("Sub", "Body", ["r@t.com"])
        self.assertFalse(result.success)
        self.assertIn("No active Site Settings", result.error)


class EmailServiceSendTestEmailTests(TestCase):
    """Test the send_test_email() convenience method."""

    def test_send_test_email_dispatches_html_email(self):
        site = _make_site(company_name="AcmeCorp")
        mock_msg = MagicMock()
        with patch.object(EmailService, "_get_site_settings", return_value=site), \
             patch("apps.core.services.email_service.EmailBackend", return_value=MagicMock()), \
             patch("apps.core.services.email_service.EmailMultiAlternatives", return_value=mock_msg):
            result = EmailService.send_test_email("qa@example.com")

        self.assertTrue(result.success)
        # Subject must contain the company name
        subject_arg = mock_msg.__class__.call_args or \
                      patch("apps.core.services.email_service.EmailMultiAlternatives").call_args
        mock_msg.attach_alternative.assert_called_once()  # HTML alternative was attached

    def test_send_test_email_no_site_settings_returns_error(self):
        with patch.object(EmailService, "_get_site_settings", return_value=None):
            result = EmailService.send_test_email("qa@example.com")
        self.assertFalse(result.success)


class EmailResultTests(TestCase):
    """Test the EmailResult dataclass."""

    def test_to_dict_success(self):
        r = EmailResult(success=True, message="Sent!")
        d = r.to_dict()
        self.assertTrue(d["success"])
        self.assertEqual(d["message"], "Sent!")
        self.assertIsNone(d["error"])

    def test_to_dict_failure(self):
        r = EmailResult(success=False, message="Failed.", error="Auth error")
        d = r.to_dict()
        self.assertFalse(d["success"])
        self.assertEqual(d["error"], "Auth error")
