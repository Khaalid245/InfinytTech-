"""
Dynamic API rate-limiting throttle classes.

All limits are read at request-time from the ``SiteSettings`` singleton
(cached, so there is no extra DB query on every request).  The throttle is a
transparent no-op when ``rate_limiting_enabled = False``.

Scopes
------
login     – anonymous POST to /api/auth/login/
             Default: 10 attempts / minute / IP
api_user  – authenticated users on any protected endpoint
             Default: 300 requests / minute / user-ID
api_anon  – anonymous (non-login) API access
             Default: 60 requests / minute / IP
"""
import math

from rest_framework.throttling import SimpleRateThrottle

from apps.site_settings.services import get_active_site_settings


def _get_settings():
    """Return SiteSettings or None.  Safe to call on every request (cached)."""
    return get_active_site_settings()


class _DynamicThrottleBase(SimpleRateThrottle):
    """
    Base class.  Subclasses override :meth:`_get_configured_rate` to return
    the requests-per-minute value read from ``SiteSettings``.
    """

    # Override in subclass if the scope name differs from the class attribute.
    scope = 'dynamic'

    def _get_configured_rate(self) -> int | None:
        """Return requests-per-minute as int, or None to disable throttle."""
        raise NotImplementedError

    # ------------------------------------------------------------------
    # Public DRF interface
    # ------------------------------------------------------------------

    def get_rate(self):
        """Return a DRF rate string like ``'10/min'`` or ``None`` to disable."""
        site = _get_settings()
        if site is None or not getattr(site, 'rate_limiting_enabled', True):
            return None  # rate limiting globally disabled

        rpm = self._get_configured_rate()
        if not rpm or rpm <= 0:
            return None  # this scope disabled

        return f'{rpm}/min'

    def allow_request(self, request, view):
        """Compute rate lazily so changes in SiteSettings take effect
        without a server restart."""
        self.rate = self.get_rate()
        if self.rate is None:
            return True  # throttle disabled
        self.num_requests, self.duration = self.parse_rate(self.rate)
        return super().allow_request(request, view)

    def wait(self):
        """Return seconds to wait (used by the exception handler for Retry-After)."""
        remaining = super().wait()
        if remaining is None:
            return None
        return math.ceil(remaining)


# ---------------------------------------------------------------------------
# Concrete throttle classes
# ---------------------------------------------------------------------------

class LoginRateThrottle(_DynamicThrottleBase):
    """
    Strict per-IP throttle applied only to the login endpoint.

    Configured via ``SiteSettings.login_rate_limit`` (requests per minute).
    Keyed by IP so it applies equally to anonymous and authenticated callers.
    """

    scope = 'login'

    def _get_configured_rate(self) -> int | None:
        site = _get_settings()
        return getattr(site, 'login_rate_limit', 10) if site else 10

    def get_cache_key(self, request, view):
        ident = self.get_ident(request)
        return self.cache_format % {'scope': self.scope, 'ident': ident}


class ApiUserRateThrottle(_DynamicThrottleBase):
    """
    Per-user throttle for authenticated API requests.

    Configured via ``SiteSettings.api_rate_limit`` (requests per minute).
    Keyed by user primary key, so each user has an independent bucket.
    """

    scope = 'api_user'

    def _get_configured_rate(self) -> int | None:
        site = _get_settings()
        return getattr(site, 'api_rate_limit', 300) if site else 300

    def get_cache_key(self, request, view):
        if request.user and request.user.is_authenticated:
            ident = str(request.user.pk)
        else:
            return None  # let ApiAnonRateThrottle handle anonymous traffic
        return self.cache_format % {'scope': self.scope, 'ident': ident}


class ApiAnonRateThrottle(_DynamicThrottleBase):
    """
    Per-IP throttle for anonymous (unauthenticated) API requests.

    Fixed at 60 requests / minute (not configurable in the UI because
    anonymous traffic should always be restricted).
    """

    scope = 'api_anon'

    def _get_configured_rate(self) -> int | None:
        # Fixed moderate limit for anonymous access — not user-configurable.
        return 60

    def get_cache_key(self, request, view):
        if request.user and request.user.is_authenticated:
            return None  # handled by ApiUserRateThrottle
        ident = self.get_ident(request)
        return self.cache_format % {'scope': self.scope, 'ident': ident}
