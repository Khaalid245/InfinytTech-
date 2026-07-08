from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PublicClientViewSet,
    PublicTestimonialViewSet,
    AdminClientViewSet,
    AdminTestimonialViewSet
)

# Public Router
public_router = DefaultRouter()
public_router.register(r'clients', PublicClientViewSet, basename='public-clients')
public_router.register(r'', PublicTestimonialViewSet, basename='public-testimonials')

# Admin Router
admin_router = DefaultRouter()
admin_router.register(r'clients', AdminClientViewSet, basename='admin-clients')
admin_router.register(r'', AdminTestimonialViewSet, basename='admin-testimonials')

urlpatterns = [
    # Admin endpoints must come first to prevent /admin/ being caught by /<slug>/ if any
    path('admin/', include(admin_router.urls)),
    
    # Public endpoints
    path('', include(public_router.urls)),
]
