from rest_framework import serializers
from apps.media_library.models import MediaFile
from .models import SiteSettings, OfficeLocation, SocialLink, SystemBackup, Notification


class MediaImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = MediaFile
        fields = ('id', 'url', 'alt_text')

    def get_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None


class OfficeLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfficeLocation
        fields = ('id', 'city', 'country', 'address', 'phone', 'email', 'map_url', 'order', 'is_active', 'created_at', 'updated_at')


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ('id', 'platform', 'url', 'icon', 'order', 'is_active', 'created_at', 'updated_at')


class SystemBackupSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemBackup
        fields = ('id', 'file_name', 'file_size', 'status', 'created_at', 'updated_at')


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'title', 'message', 'type', 'is_read', 'created_at', 'updated_at')


class SiteSettingsSerializer(serializers.ModelSerializer):
    # Nested relations for Media Files
    primary_logo_details = MediaImageSerializer(source='primary_logo', read_only=True)
    secondary_logo_details = MediaImageSerializer(source='secondary_logo', read_only=True)
    dark_logo_details = MediaImageSerializer(source='dark_logo', read_only=True)
    light_logo_details = MediaImageSerializer(source='light_logo', read_only=True)
    favicon_details = MediaImageSerializer(source='favicon', read_only=True)
    open_graph_image_details = MediaImageSerializer(source='open_graph_image', read_only=True)
    apple_touch_icon_details = MediaImageSerializer(source='apple_touch_icon', read_only=True)
    loading_logo_details = MediaImageSerializer(source='loading_logo', read_only=True)

    smtp_password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    # Inline relationships
    office_locations = OfficeLocationSerializer(many=True, read_only=True)
    social_links = SocialLinkSerializer(many=True, read_only=True)

    class Meta:
        model = SiteSettings
        fields = (
            'id', 'is_active',
            # General Info
            'company_name', 'company_tagline', 'company_description', 'founded_year',
            'company_timezone', 'default_language', 'default_currency',
            # Branding
            'primary_logo', 'primary_logo_details',
            'secondary_logo', 'secondary_logo_details',
            'dark_logo', 'dark_logo_details',
            'light_logo', 'light_logo_details',
            'favicon', 'favicon_details',
            'open_graph_image', 'open_graph_image_details',
            'apple_touch_icon', 'apple_touch_icon_details',
            'loading_logo', 'loading_logo_details',
            'brand_colors',
            # Contact
            'primary_email', 'support_email', 'sales_email', 'phone', 'whatsapp', 
            'office_address', 'google_maps_url', 'business_hours',
            # SEO
            'default_meta_title', 'default_meta_description', 'default_keywords',
            'canonical_url', 'robots_index', 'robots_follow',
            'open_graph_title', 'open_graph_description', 'twitter_card_type',
            # Email / SMTP
            'smtp_provider', 'smtp_host', 'smtp_port', 'smtp_username', 'smtp_password',
            'smtp_encryption', 'smtp_sender_name', 'smtp_sender_email',
            # Security
            'password_policy', 'session_timeout', 'max_login_attempts',
            'two_factor_auth_enabled', 'allowed_origins', 'api_token_expiration',
            # Hero
            'hero_title', 'hero_subtitle', 'hero_primary_button_text', 'hero_primary_button_url',
            'hero_secondary_button_text', 'hero_secondary_button_url',
            # Stats
            'completed_projects', 'happy_clients', 'countries_served', 'years_experience',
            # Footer
            'footer_description', 'copyright_text', 'newsletter_title', 'newsletter_description',
            # System
            'maintenance_mode', 'analytics_enabled',
            # Relationships
            'office_locations', 'social_links',
            
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def update(self, instance, validated_data):
        smtp_password = validated_data.pop('smtp_password', None)
        if smtp_password is not None:
            instance.smtp_password = smtp_password
        return super().update(instance, validated_data)
