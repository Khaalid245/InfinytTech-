from rest_framework import views, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from apps.accounts.permissions import IsAdminOrSuperAdmin
from .models import SiteSettings, SystemBackup, Notification
from .serializers import SiteSettingsSerializer, SystemBackupSerializer, NotificationSerializer
from apps.accounts.models import UserActivity
from apps.accounts.serializers import UserActivitySerializer
from django.core.mail import send_mail
import psutil
import datetime
from django.db import connection


class PublicSiteSettingsAPIView(views.APIView):
    """
    Public read-only endpoint returning the globally active SiteSettings.
    GET /api/site-settings/
    """
    permission_classes = [permissions.AllowAny]

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
        settings = self.queryset.filter(is_active=True).first()
        if not settings:
            return Response({"detail": "No active settings found."}, status=400)
            
        test_email = request.data.get('email')
        if not test_email:
            return Response({"detail": "Email address required."}, status=400)

        try:
            # Here you would dynamically configure the Django email backend
            # using the settings. For demonstration in this phase:
            send_mail(
                subject='Test Email from InfinytTech Platform',
                message='This is a test email to verify your SMTP configuration.',
                from_email=settings.smtp_sender_email or 'test@example.com',
                recipient_list=[test_email],
                fail_silently=False,
            )
            return Response({"detail": "Test email sent successfully."})
        except Exception as e:
            return Response({"detail": str(e)}, status=400)

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
            "background_jobs": "Healthy",
            "redis": "Healthy", # Mock
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
