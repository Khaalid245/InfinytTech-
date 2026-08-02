from django.apps import AppConfig


class SiteSettingsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.site_settings'

    def ready(self):
        import apps.site_settings.signals  # noqa: F401
