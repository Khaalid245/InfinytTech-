from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),

    # API
    path('api/auth/', include('apps.accounts.urls_auth')),
    path('api/accounts/', include('apps.accounts.urls_accounts')),
    path('api/services/', include('apps.services.urls')),
    path('api/portfolio/', include('apps.portfolio.urls')),
    path('api/leads/', include('apps.leads.urls')),
    path('api/blog/', include('apps.blog.urls')),
    path('api/media/', include('apps.media_library.urls')),
    path('api/team/', include('apps.team.urls')),
    path('api/testimonials/', include('apps.testimonials.urls')),
    path('api/site-settings/', include('apps.site_settings.urls')),
    # Docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
