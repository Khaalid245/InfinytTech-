"""
SiteSettings service layer.

Provides a short-TTL in-process cache for the active SiteSettings instance.

The cache is invalidated:
  1. Explicitly — via ``clear_site_settings_cache()`` called from the
     ``post_save`` signal whenever SiteSettings is saved through Django ORM.
  2. Automatically — after ``SETTINGS_CACHE_TTL_SECONDS`` seconds, even if
     no save event was received (guards against cross-process DB modifications
     such as management commands or test scripts that bypass signals).

Why not ``lru_cache``?
  ``lru_cache`` caches the Python object itself indefinitely until explicitly
  cleared.  In a multi-process development setup (runserver + management
  commands), a direct DB write in one process will never clear the cache in
  the runserver process, causing stale credentials to be passed to EmailService.
"""

import time
import threading
from apps.site_settings.models import SiteSettings

# Cache TTL in seconds. 30 s is short enough to recover from any out-of-band
# DB change while still being cheap (avoids a DB hit on every email send).
SETTINGS_CACHE_TTL_SECONDS = 30

_cache_lock = threading.Lock()
_cached_settings = None
_cache_timestamp: float = 0.0


def get_active_site_settings():
    """Return the active SiteSettings instance, with a short TTL cache.

    Thread-safe.  The cache is cleared:
      - By ``clear_site_settings_cache()`` on every ``post_save`` signal.
      - Automatically after ``SETTINGS_CACHE_TTL_SECONDS`` seconds.
    """
    global _cached_settings, _cache_timestamp

    with _cache_lock:
        now = time.monotonic()
        if _cached_settings is None or (now - _cache_timestamp) > SETTINGS_CACHE_TTL_SECONDS:
            _cached_settings = SiteSettings.objects.filter(is_active=True).first()
            _cache_timestamp = now
        return _cached_settings


def clear_site_settings_cache():
    """Immediately invalidate the in-process SiteSettings cache.

    Called automatically from the ``post_save`` signal so that any settings
    change (including SMTP credentials) is reflected on the very next call.
    """
    global _cached_settings, _cache_timestamp

    with _cache_lock:
        _cached_settings = None
        _cache_timestamp = 0.0
