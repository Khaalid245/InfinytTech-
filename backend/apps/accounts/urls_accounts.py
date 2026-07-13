from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserAdminViewSet

router = DefaultRouter()
router.register(r'users', UserAdminViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
]
