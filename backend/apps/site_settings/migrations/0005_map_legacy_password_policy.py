# Data migration: map legacy password_policy values to new PasswordPolicy enum values.
# 'strong' → 'strict' (the old default was 'strong' which maps to the STRICT policy)

from django.db import migrations


def map_legacy_policy_values(apps, schema_editor):
    """Map any legacy password_policy values to the new enum values."""
    SiteSettings = apps.get_model('site_settings', 'SiteSettings')
    LEGACY_MAP = {
        'strong': 'strict',
    }
    for ss in SiteSettings.objects.all():
        old_value = ss.password_policy
        if old_value in LEGACY_MAP:
            ss.password_policy = LEGACY_MAP[old_value]
            ss.save(update_fields=['password_policy'])
        elif old_value not in ('relaxed', 'standard', 'strict'):
            # Unknown value — log it but don't silently change it
            print(
                f"[WARNING] SiteSettings pk={ss.pk} has unknown "
                f"password_policy='{old_value}'. Please review manually."
            )


def revert_policy_values(apps, schema_editor):
    """Reverse the mapping: 'strict' → 'strong'."""
    SiteSettings = apps.get_model('site_settings', 'SiteSettings')
    REVERSE_MAP = {
        'strict': 'strong',
    }
    for ss in SiteSettings.objects.all():
        old_value = ss.password_policy
        if old_value in REVERSE_MAP:
            ss.password_policy = REVERSE_MAP[old_value]
            ss.save(update_fields=['password_policy'])


class Migration(migrations.Migration):

    dependencies = [
        ('site_settings', '0004_alter_password_policy_choices'),
    ]

    operations = [
        migrations.RunPython(
            map_legacy_policy_values,
            reverse_code=revert_policy_values,
        ),
    ]
