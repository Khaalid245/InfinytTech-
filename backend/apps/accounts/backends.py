from datetime import timedelta
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.core.exceptions import PermissionDenied
from django.db import transaction
from django.utils import timezone
from apps.site_settings.services import get_active_site_settings

UserModel = get_user_model()


class SecurityModelBackend(ModelBackend):
    """Custom authentication backend that tracks failed login attempts and enforces

    account lockout using dynamic settings from SiteSettings.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)

        try:
            user = UserModel._default_manager.get_by_natural_key(username)
        except UserModel.DoesNotExist:
            # Prevent timing attacks by running the password hasher
            UserModel().set_password(password)
            return None

        # Fetch platform security configuration
        settings = get_active_site_settings()
        max_attempts = getattr(settings, "max_login_attempts", 5)
        lockout_minutes = getattr(settings, "lockout_duration", 15)

        now = timezone.now()

        # 1. Lockout Enforcement Check (Read phase)
        if user.locked_until and user.locked_until > now:
            raise PermissionDenied(
                "Your account has been temporarily locked due to multiple failed login attempts. Please try again later."
            )

        # 2. Check Password
        if user.check_password(password):
            # Password is correct.
            # If the user has any failed attempts or old lockout values, reset them.
            if user.failed_login_attempts > 0 or user.locked_until is not None:
                with transaction.atomic():
                    # Select for update to prevent concurrent reset race conditions
                    user_locked = UserModel.objects.select_for_update().get(pk=user.pk)
                    had_lock = user_locked.locked_until is not None and user_locked.locked_until <= now
                    user_locked.failed_login_attempts = 0
                    user_locked.locked_until = None
                    user_locked.save(update_fields=["failed_login_attempts", "locked_until"])
                    # Reflect resets on the current user instance
                    user.failed_login_attempts = 0
                    user.locked_until = None

                    if had_lock:
                        from apps.accounts.models import UserActivity
                        UserActivity.objects.create(
                            user=user_locked,
                            action=UserActivity.ActionType.ACCOUNT_UNLOCK,
                            description="Account automatically unlocked after timeout.",
                            ip_address=request.META.get('REMOTE_ADDR') if request else None
                        )

            # Standard active check
            if self.user_can_authenticate(user):
                return user
            return None
        else:
            # Password check failed. Lock row to increment failed attempts atomically.
            with transaction.atomic():
                user_locked = UserModel.objects.select_for_update().get(pk=user.pk)

                # Re-verify lockout inside transaction to prevent race conditions
                if user_locked.locked_until and user_locked.locked_until > now:
                    raise PermissionDenied(
                        "Your account has been temporarily locked due to multiple failed login attempts. Please try again later."
                    )

                # Lockout might have expired, reset before incrementing if needed
                if user_locked.locked_until and user_locked.locked_until <= now:
                    user_locked.failed_login_attempts = 0
                    user_locked.locked_until = None
                    from apps.accounts.models import UserActivity
                    UserActivity.objects.create(
                        user=user_locked,
                        action=UserActivity.ActionType.ACCOUNT_UNLOCK,
                        description="Account automatically unlocked after timeout.",
                        ip_address=request.META.get('REMOTE_ADDR') if request else None
                    )

                user_locked.failed_login_attempts += 1

                if user_locked.failed_login_attempts >= max_attempts:
                    user_locked.locked_until = now + timedelta(minutes=lockout_minutes)
                    from apps.accounts.models import UserActivity
                    UserActivity.objects.create(
                        user=user_locked,
                        action=UserActivity.ActionType.ACCOUNT_LOCK,
                        description=f"Account locked after {max_attempts} failed login attempts.",
                        ip_address=request.META.get('REMOTE_ADDR') if request else None
                    )

                user_locked.save(update_fields=["failed_login_attempts", "locked_until"])

                # Propagate update back to original reference for serialization or tests
                user.failed_login_attempts = user_locked.failed_login_attempts
                user.locked_until = user_locked.locked_until

            return None
