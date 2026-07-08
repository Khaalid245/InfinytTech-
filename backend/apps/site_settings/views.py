from rest_framework import views, viewsets, permissions, status
from rest_framework.response import Response
from apps.accounts.permissions import IsAdminOrSuperAdmin
from .models import SiteSettings
from .serializers import SiteSettingsSerializer


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
