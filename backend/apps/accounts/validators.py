from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from apps.site_settings.constants import PasswordPolicy


class SitePasswordValidator:
    """Validate passwords against the dynamic ``password_policy`` stored in
    :class:`~apps.site_settings.models.SiteSettings`.

    Policies:
        * RELAXED  – at least 6 characters.
        * STANDARD – at least 8 characters, upper + lower + digit.
        * STRICT   – at least 12 characters, upper + lower + digit + special.

    The active settings are fetched via the service layer
    (:func:`~apps.site_settings.services.get_active_site_settings`) which
    caches the result per-process and is invalidated by a ``post_save``
    signal on ``SiteSettings``.
    """

    def validate(self, password, user=None):
        # Import lazily to avoid circular imports at module load time
        from apps.site_settings.services import get_active_site_settings

        settings = get_active_site_settings()
        policy = getattr(settings, "password_policy", PasswordPolicy.STANDARD)
        errors = []

        if policy == PasswordPolicy.RELAXED:
            if len(password) < 6:
                errors.append(_("Password must be at least 6 characters long."))

        elif policy == PasswordPolicy.STANDARD:
            if len(password) < 8:
                errors.append(_("Password must be at least 8 characters long."))
            if not any(c.islower() for c in password):
                errors.append(_("Password must contain at least one lowercase letter."))
            if not any(c.isupper() for c in password):
                errors.append(_("Password must contain at least one uppercase letter."))
            if not any(c.isdigit() for c in password):
                errors.append(_("Password must contain at least one number."))

        elif policy == PasswordPolicy.STRICT:
            if len(password) < 12:
                errors.append(_("Password must be at least 12 characters long."))
            if not any(c.islower() for c in password):
                errors.append(_("Password must contain at least one lowercase letter."))
            if not any(c.isupper() for c in password):
                errors.append(_("Password must contain at least one uppercase letter."))
            if not any(c.isdigit() for c in password):
                errors.append(_("Password must contain at least one number."))
            if not any(not c.isalnum() for c in password):
                errors.append(_("Password must contain at least one special character."))

        else:
            # Fallback – should not happen with enum choices
            if len(password) < 8:
                errors.append(_("Password must be at least 8 characters long."))

        if errors:
            raise ValidationError(errors)

    def get_help_text(self):
        from apps.site_settings.services import get_active_site_settings

        settings = get_active_site_settings()
        policy = getattr(settings, "password_policy", PasswordPolicy.STANDARD)

        if policy == PasswordPolicy.RELAXED:
            return _("Your password must contain at least 6 characters.")
        if policy == PasswordPolicy.STANDARD:
            return _(
                "Your password must be at least 8 characters long and contain "
                "both uppercase and lowercase letters, as well as a number."
            )
        if policy == PasswordPolicy.STRICT:
            return _(
                "Your password must be at least 12 characters long and include "
                "uppercase, lowercase, numeric and special characters."
            )
        return _("Your password must meet the platform's password policy.")
