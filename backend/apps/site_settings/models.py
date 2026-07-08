from django.db import models
from django.core.exceptions import ValidationError
from apps.core.models import UUIDModel, TimeStampedModel
from apps.media_library.models import MediaFile

class SiteSettings(UUIDModel, TimeStampedModel):
    """
    Singleton model containing global settings for the InfinytTech platform.
    """
    is_active = models.BooleanField(default=True, help_text="Designates this configuration as the active one.")
    
    # Company Information
    company_name = models.CharField(max_length=255, default="InfinytTech")
    company_tagline = models.CharField(max_length=255, blank=True)
    company_description = models.TextField(blank=True)
    founded_year = models.PositiveIntegerField(null=True, blank=True)

    # Branding (Foreign Keys to MediaLibrary)
    primary_logo = models.ForeignKey(MediaFile, on_delete=models.SET_NULL, null=True, blank=True, related_name='primary_logo_settings')
    secondary_logo = models.ForeignKey(MediaFile, on_delete=models.SET_NULL, null=True, blank=True, related_name='secondary_logo_settings')
    dark_logo = models.ForeignKey(MediaFile, on_delete=models.SET_NULL, null=True, blank=True, related_name='dark_logo_settings')
    light_logo = models.ForeignKey(MediaFile, on_delete=models.SET_NULL, null=True, blank=True, related_name='light_logo_settings')
    favicon = models.ForeignKey(MediaFile, on_delete=models.SET_NULL, null=True, blank=True, related_name='favicon_settings')
    open_graph_image = models.ForeignKey(MediaFile, on_delete=models.SET_NULL, null=True, blank=True, related_name='og_image_settings')

    # Contact
    support_email = models.EmailField(blank=True)
    sales_email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    whatsapp = models.CharField(max_length=50, blank=True)
    office_address = models.TextField(blank=True)
    google_maps_url = models.URLField(max_length=500, blank=True)

    # SEO
    default_meta_title = models.CharField(max_length=255, blank=True)
    default_meta_description = models.TextField(blank=True)
    default_keywords = models.TextField(blank=True, help_text="Comma-separated keywords")
    canonical_url = models.URLField(max_length=500, blank=True)
    robots_index = models.BooleanField(default=True)
    robots_follow = models.BooleanField(default=True)

    # Hero Section
    hero_title = models.CharField(max_length=255, blank=True)
    hero_subtitle = models.TextField(blank=True)
    hero_primary_button_text = models.CharField(max_length=50, blank=True)
    hero_primary_button_url = models.CharField(max_length=255, blank=True)
    hero_secondary_button_text = models.CharField(max_length=50, blank=True)
    hero_secondary_button_url = models.CharField(max_length=255, blank=True)

    # Business Statistics
    completed_projects = models.PositiveIntegerField(default=0)
    happy_clients = models.PositiveIntegerField(default=0)
    countries_served = models.PositiveIntegerField(default=0)
    years_experience = models.PositiveIntegerField(default=0)

    # Footer
    footer_description = models.TextField(blank=True)
    copyright_text = models.CharField(max_length=255, blank=True)
    newsletter_title = models.CharField(max_length=255, blank=True)
    newsletter_description = models.TextField(blank=True)

    # System
    maintenance_mode = models.BooleanField(default=False)
    analytics_enabled = models.BooleanField(default=True)

    class Meta:
        db_table = 'site_settings'
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return f"{self.company_name} Settings ({'Active' if self.is_active else 'Inactive'})"

    def clean(self):
        super().clean()
        if self.is_active:
            # Check if there is already another active SiteSettings
            qs = SiteSettings.objects.filter(is_active=True)
            if self.pk:
                qs = qs.exclude(pk=self.pk)
            if qs.exists():
                raise ValidationError("Only one active SiteSettings is allowed. Deactivate the current one first.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class OfficeLocation(UUIDModel, TimeStampedModel):
    site_settings = models.ForeignKey(SiteSettings, on_delete=models.CASCADE, related_name='office_locations')
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    address = models.TextField()
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    map_url = models.URLField(max_length=500, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'site_office_locations'
        ordering = ['order', 'city']
        verbose_name = 'Office Location'
        verbose_name_plural = 'Office Locations'

    def __str__(self):
        return f"{self.city}, {self.country}"


class SocialLink(UUIDModel, TimeStampedModel):
    PLATFORM_CHOICES = [
        ('linkedin', 'LinkedIn'),
        ('github', 'GitHub'),
        ('twitter', 'X (Twitter)'),
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
        ('youtube', 'YouTube'),
        ('behance', 'Behance'),
        ('dribbble', 'Dribbble'),
    ]

    site_settings = models.ForeignKey(SiteSettings, on_delete=models.CASCADE, related_name='social_links')
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES)
    url = models.URLField(max_length=500)
    icon = models.CharField(max_length=50, blank=True, help_text="Optional icon identifier (e.g. lucide icon name)")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'site_social_links'
        ordering = ['order', 'platform']
        verbose_name = 'Social Link'
        verbose_name_plural = 'Social Links'

    def __str__(self):
        return self.get_platform_display()
