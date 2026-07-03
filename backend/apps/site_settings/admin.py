from django.contrib import admin
from django.utils.html import format_html
from django.core.exceptions import ValidationError
from .models import SiteSettings, OfficeLocation, SocialLink

class OfficeLocationInline(admin.StackedInline):
    model = OfficeLocation
    extra = 0


class SocialLinkInline(admin.TabularInline):
    model = SocialLink
    extra = 0


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    inlines = [OfficeLocationInline, SocialLinkInline]
    
    list_display = ['company_name', 'is_active', 'updated_at']
    list_filter = ['is_active']
    
    readonly_fields = [
        'preview_primary_logo', 
        'preview_secondary_logo', 
        'preview_dark_logo', 
        'preview_light_logo',
        'preview_favicon',
        'preview_open_graph_image'
    ]

    fieldsets = (
        ('System', {
            'fields': ('is_active', 'maintenance_mode', 'analytics_enabled')
        }),
        ('Company', {
            'fields': ('company_name', 'company_tagline', 'company_description', 'founded_year')
        }),
        ('Branding', {
            'fields': (
                'primary_logo', 'preview_primary_logo',
                'secondary_logo', 'preview_secondary_logo',
                'dark_logo', 'preview_dark_logo',
                'light_logo', 'preview_light_logo',
                'favicon', 'preview_favicon',
                'open_graph_image', 'preview_open_graph_image'
            )
        }),
        ('Hero', {
            'fields': (
                'hero_title', 'hero_subtitle', 
                'hero_primary_button_text', 'hero_primary_button_url',
                'hero_secondary_button_text', 'hero_secondary_button_url'
            )
        }),
        ('Statistics', {
            'fields': ('completed_projects', 'happy_clients', 'countries_served', 'years_experience')
        }),
        ('SEO', {
            'fields': (
                'default_meta_title', 'default_meta_description', 'default_keywords',
                'canonical_url', 'robots_index', 'robots_follow'
            )
        }),
        ('Contact', {
            'fields': ('support_email', 'sales_email', 'phone', 'whatsapp', 'office_address', 'google_maps_url')
        }),
        ('Footer', {
            'fields': ('footer_description', 'copyright_text', 'newsletter_title', 'newsletter_description')
        }),
    )

    def _get_image_preview(self, obj, field_name):
        media_file = getattr(obj, field_name)
        if media_file and media_file.file:
            return format_html('<img src="{}" style="max-height: 100px; max-width: 200px; border-radius: 4px;" />', media_file.file.url)
        return "No image"

    def preview_primary_logo(self, obj):
        return self._get_image_preview(obj, 'primary_logo')
    preview_primary_logo.short_description = "Primary Logo Preview"

    def preview_secondary_logo(self, obj):
        return self._get_image_preview(obj, 'secondary_logo')
    preview_secondary_logo.short_description = "Secondary Logo Preview"

    def preview_dark_logo(self, obj):
        return self._get_image_preview(obj, 'dark_logo')
    preview_dark_logo.short_description = "Dark Logo Preview"

    def preview_light_logo(self, obj):
        return self._get_image_preview(obj, 'light_logo')
    preview_light_logo.short_description = "Light Logo Preview"

    def preview_favicon(self, obj):
        return self._get_image_preview(obj, 'favicon')
    preview_favicon.short_description = "Favicon Preview"

    def preview_open_graph_image(self, obj):
        return self._get_image_preview(obj, 'open_graph_image')
    preview_open_graph_image.short_description = "OG Image Preview"
