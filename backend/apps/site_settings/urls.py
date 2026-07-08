from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublicSiteSettingsAPIView, AdminSiteSettingsViewSet

router = DefaultRouter()
router.register(r'admin', AdminSiteSettingsViewSet, basename='admin-site-settings')

urlpatterns = [
    path('', PublicSiteSettingsAPIView.as_view(), name='public-site-settings'),
    path('', include(router.urls)),
]
