from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeadSubmitView, LeadAdminViewSet

router = DefaultRouter()
# Empty prefix so that administrative endpoints sit at /api/leads/
router.register('', LeadAdminViewSet, basename='leads-admin')

urlpatterns = [
    path('contact/', LeadSubmitView.as_view(), name='lead-submit'),
    path('', include(router.urls)),
]
