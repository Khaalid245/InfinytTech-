from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublicSiteSettingsAPIView, AdminSiteSettingsViewSet, SystemBackupViewSet, NotificationViewSet

router = DefaultRouter()
router.register(r'admin', AdminSiteSettingsViewSet, basename='admin-site-settings')
router.register(r'backups', SystemBackupViewSet, basename='admin-backups')
router.register(r'notifications', NotificationViewSet, basename='admin-notifications')

urlpatterns = [
    path('', PublicSiteSettingsAPIView.as_view(), name='public-site-settings'),
    path('', include(router.urls)),
]
