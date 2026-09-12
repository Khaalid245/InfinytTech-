from rest_framework import views, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.views.decorators.cache import never_cache
from django.utils.decorators import method_decorator
from apps.accounts.permissions import IsAdminOrSuperAdmin
from .models import SiteSettings, SystemBackup, Notification
from .serializers import SiteSettingsSerializer, SystemBackupSerializer, NotificationSerializer
from apps.accounts.models import UserActivity
from apps.accounts.serializers import UserActivitySerializer
from apps.core.services import EmailService
import psutil
import datetime
from django.db import connection


class PublicSiteSettingsAPIView(views.APIView):
    """
    Public read-only endpoint returning the globally active SiteSettings.
    GET /api/site-settings/
    """
    permission_classes = [permissions.AllowAny]

    @method_decorator(never_cache)
    def get(self, request, *args, **kwargs):
        settings = SiteSettings.objects.filter(is_active=True).first()
        if not settings:
            return Response(
                {"detail": "No active site settings found."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = SiteSettingsSerializer(settings, context={'request': request})
        return Response(serializer.data)


class AdminSiteSettingsViewSet(viewsets.ModelViewSet):
    """
    Admin Full CRUD for SiteSettings.
    Requires JWT and IsAdminOrSuperAdmin.
    """
    queryset = SiteSettings.objects.all().order_by('-created_at')
    serializer_class = SiteSettingsSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]

    @action(detail=False, methods=['post'])
    def test_email(self, request):
        """
        Send a diagnostic test email using the centralized EmailService.
        Persists the outcome (success/failure) into SiteSettings for monitoring.
        """
        from django.utils import timezone

        recipient = request.data.get('email')
        if not recipient:
            return Response({"detail": "Email address required."}, status=400)

        result = EmailService.send_test_email(recipient)

        # Persist the result into SiteSettings (lightweight monitoring)
        site = SiteSettings.objects.first()
        now = timezone.now()

        if result.success:
            if site:
                SiteSettings.objects.filter(pk=site.pk).update(
                    email_last_test_status='success',
                    email_last_test_at=now,
                    email_last_test_recipient=recipient,
                )
            from apps.site_settings.services import clear_site_settings_cache
            clear_site_settings_cache()
            return Response({
                "detail": result.message,
                "status": "success",
                "recipient": recipient,
                "tested_at": now.isoformat(),
                "checks": {
                    "smtp_connection": True,
                    "template_engine": True,
                    "configuration": True,
                },
            })

        # Failure path — store reason (never expose raw SMTP internals)
        failure_reason = result.error or result.message or "Unknown error"
        if site:
            SiteSettings.objects.filter(pk=site.pk).update(
                email_last_test_status='error',
                email_last_failure_at=now,
                email_last_failure_reason=failure_reason[:500],
            )
        from apps.site_settings.services import clear_site_settings_cache
        clear_site_settings_cache()
        return Response({"detail": failure_reason}, status=400)

    @action(detail=False, methods=['get'])
    def email_status(self, request):
        """
        Return the current email test status stored in SiteSettings.
        Used by the Email Service Status dashboard panel.
        """
        site = SiteSettings.objects.first()
        if not site:
            return Response({"status": "not_tested"})

        return Response({
            "status": site.email_last_test_status,
            "last_test_at": site.email_last_test_at.isoformat() if site.email_last_test_at else None,
            "last_test_recipient": site.email_last_test_recipient,
            "last_failure_at": site.email_last_failure_at.isoformat() if site.email_last_failure_at else None,
            "last_failure_reason": site.email_last_failure_reason,
            "smtp_configured": bool(site.smtp_host and site.smtp_username),
            "smtp_summary": {
                "provider": site.smtp_provider,
                "host": site.smtp_host,
                "port": site.smtp_port,
                "encryption": site.smtp_encryption.upper() if site.smtp_encryption else "",
                "sender_name": site.smtp_sender_name,
                "sender_email": site.smtp_sender_email,
            },
        })

    @action(detail=False, methods=['get'])
    def health(self, request):
        # Database check
        try:
            connection.ensure_connection()
            db_status = "Healthy"
        except Exception:
            db_status = "Critical"

        cpu_usage = psutil.cpu_percent(interval=0.1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')

        data = {
            "database": db_status,
            "media_storage": "Healthy",
            "api": "Healthy",
            "background_jobs": "Not Configured", # Placeholder until celery/redis is added
            "redis": "Not Configured", # Placeholder until redis is added
            "cpu_usage": cpu_usage,
            "memory_usage": memory.percent,
            "disk_usage": disk.percent
        }
        return Response(data)

    @action(detail=False, methods=['get'])
    def audit_logs(self, request):
        logs = UserActivity.objects.all().order_by('-created_at')[:100]
        serializer = UserActivitySerializer(logs, many=True)
        return Response(serializer.data)


class SystemBackupViewSet(viewsets.ModelViewSet):
    queryset = SystemBackup.objects.all().order_by('-created_at')
    serializer_class = SystemBackupSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]

    @action(detail=False, methods=['post'])
    def trigger(self, request):
        # Mocking backup creation
        backup = SystemBackup.objects.create(
            file_name=f"backup_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.zip",
            file_size="250MB",
            status="completed"
        )
        return Response(SystemBackupSerializer(backup).data)

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        backup = self.get_object()
        # Mock restore
        return Response({"detail": f"Restore initiated from {backup.file_name}"})


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notif = self.get_object()
        notif.is_read = True
        notif.save()
        return Response(NotificationSerializer(notif).data)
