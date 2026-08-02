from django.core.exceptions import PermissionDenied
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed
from apps.site_settings.services import get_active_site_settings


def enforce_session_timeout(user, request=None, is_jwt=False):
    """Enforces dynamic session timeout based on inactivity using SiteSettings.

    Design notes
    ------------
    * ``last_activity`` is updated on every request, subject to a lightweight
      throttle so we avoid one DB write per sub-second request burst.
    * The throttle window is proportional to the configured timeout so it is
      always shorter than the timeout.  With a hard-coded 60-second throttle,
      any timeout ≤ 60 seconds would cause a deadlock where ``last_activity``
      can never be refreshed before the session expires — even during active use.
    * A session_timeout of 0 is treated as "not configured" and falls back to
      the model default (1440 minutes).  Allowing 0 would cause instant expiry
      on every single request.
    """
    if not user or not user.is_authenticated:
        return

    settings = get_active_site_settings()
    timeout_minutes = getattr(settings, 'session_timeout', 1440)

    # Guard: treat 0 (unconfigured / corrupted) as the safe default.
    if not timeout_minutes or timeout_minutes <= 0:
        timeout_minutes = 1440  # 24 hours

    now = timezone.now()
    last_activity = user.last_activity

    if last_activity:
        elapsed_minutes = (now - last_activity).total_seconds() / 60.0
        if elapsed_minutes > timeout_minutes:
            if is_jwt:
                raise AuthenticationFailed(
                    'Session has expired due to inactivity. Please log in again.'
                )
            else:
                from django.contrib.auth import logout as django_logout
                if request:
                    django_logout(request)
                raise PermissionDenied(
                    'Session has expired due to inactivity. Please log in again.'
                )

    # -----------------------------------------------------------------------
    # Throttled DB write — avoids one write per request under heavy traffic,
    # but the throttle window MUST be shorter than the timeout so that active
    # users always get their last_activity refreshed before the next check.
    #
    # Formula: throttle = min(30 seconds, timeout_in_seconds / 4)
    # Examples:
    #   timeout = 1 min  (60 s) → throttle = min(30, 15) = 15 s
    #   timeout = 5 min (300 s) → throttle = min(30, 75) = 30 s
    #   timeout = 24 h  (86400 s) → throttle = 30 s
    # -----------------------------------------------------------------------
    timeout_seconds = timeout_minutes * 60
    throttle_seconds = min(30, timeout_seconds // 4)
    # Ensure at least 1 second throttle to prevent write storms on sub-second requests
    throttle_seconds = max(throttle_seconds, 1)

    should_update = (
        not last_activity
        or (now - last_activity).total_seconds() > throttle_seconds
    )
    if should_update:
        user.last_activity = now
        user.save(update_fields=['last_activity'])
