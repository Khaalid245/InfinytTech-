from functools import lru_cache
from apps.site_settings.models import SiteSettings

@lru_cache(maxsize=1)
def get_active_site_settings():
    """Return the active SiteSettings instance, cached per process.

    The cache can be cleared by calling ``clear_site_settings_cache`` (e.g., from a
    ``post_save`` signal). This keeps password validation cheap while ensuring any
    runtime change to the settings is reflected promptly.
    """
    return SiteSettings.objects.filter(is_active=True).first()

def clear_site_settings_cache():
    """Clear the ``lru_cache`` used by ``get_active_site_settings``.

    Called automatically when ``SiteSettings`` is saved.
    """
    get_active_site_settings.cache_clear()
