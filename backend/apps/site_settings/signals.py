from django.db.models.signals import post_save
from django.dispatch import receiver
from corsheaders.signals import check_request_enabled


@receiver(post_save, sender='site_settings.SiteSettings')
def clear_settings_cache_on_save(sender, instance, **kwargs):
    """Clear the cached SiteSettings whenever the model is saved.

    This ensures that a policy change (e.g. password_policy from STANDARD
    to STRICT) takes effect immediately for the current process without
    requiring a server restart.
    """
    from apps.site_settings.services import clear_site_settings_cache
    clear_site_settings_cache()


@receiver(check_request_enabled)
def dynamic_cors_origin_check(sender, request, **kwargs):
    """
    Dynamically evaluate the incoming HTTP Origin against:
      1. The Django settings CORS_ALLOWED_ORIGINS list (covers dev localhost entries).
      2. The comma-separated `allowed_origins` field in the active SiteSettings (production).

    This means local development origins (from development.py) are still allowed without
    needing to add them to the database, while production is purely database-driven.
    """
    origin = request.META.get('HTTP_ORIGIN')
    if not origin:
        return False

    # Clean the incoming origin (remove trailing slashes)
    clean_origin = origin.strip().rstrip('/')

    # --- Check 1: Django settings CORS_ALLOWED_ORIGINS (e.g. dev localhost entries) ---
    from django.conf import settings as django_settings
    settings_origins = getattr(django_settings, 'CORS_ALLOWED_ORIGINS', [])
    settings_allowed_set = {o.strip().rstrip('/') for o in settings_origins if o.strip()}
    if clean_origin in settings_allowed_set:
        return True

    # --- Check 2: Active SiteSettings database-configured origins (production) ---
    from apps.site_settings.services import get_active_site_settings
    site_settings = get_active_site_settings()

    if site_settings and site_settings.allowed_origins:
        db_allowed_set = {
            o.strip().rstrip('/')
            for o in site_settings.allowed_origins.split(',')
            if o.strip()
        }
        if clean_origin in db_allowed_set:
            return True

    return False
