from rest_framework import serializers
from apps.media_library.models import MediaFile
from .models import SiteSettings, OfficeLocation, SocialLink, SystemBackup, Notification


class MediaImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    filename = serializers.CharField(source='original_filename', read_only=True)
    size = serializers.IntegerField(source='file_size', read_only=True)

    class Meta:
        model = MediaFile
        fields = ('id', 'url', 'filename', 'mime_type', 'width', 'height', 'size', 'created_at', 'updated_at', 'alt_text')

    def get_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            url = obj.file.url
            if request is not None:
                url = request.build_absolute_uri(url)
            
            if obj.updated_at:
                url = f"{url}?v={int(obj.updated_at.timestamp())}"
            return url
        return None


class OfficeLocationSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False)

    class Meta:
        model = OfficeLocation
        fields = ('id', 'city', 'country', 'address', 'phone', 'email', 'map_url', 'order', 'is_active', 'created_at', 'updated_at')


class SocialLinkSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False)

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

    # Inline relationships (writable)
    office_locations = OfficeLocationSerializer(many=True, required=False)
    social_links = SocialLinkSerializer(many=True, required=False)

    # Security fields — minimum value enforcement at the serializer layer.
    # The model validators cover the ORM layer; these cover the API layer.
    session_timeout = serializers.IntegerField(min_value=1, default=1440)
    max_login_attempts = serializers.IntegerField(min_value=1, default=5)
    lockout_duration = serializers.IntegerField(min_value=1, default=15)

    # Rate limiting fields
    login_rate_limit = serializers.IntegerField(min_value=1, default=10)
    api_rate_limit = serializers.IntegerField(min_value=1, default=300)

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
            'password_policy', 'session_timeout', 'max_login_attempts', 'lockout_duration',
            'two_factor_auth_enabled', 'allowed_origins', 'api_token_expiration',
            'rate_limiting_enabled', 'login_rate_limit', 'api_rate_limit',
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

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        is_admin_route = request and 'admin' in request.path
        if not is_admin_route:
            if 'social_links' in data:
                data['social_links'] = [link for link in data['social_links'] if link['is_active']]
            if 'office_locations' in data:
                data['office_locations'] = [loc for loc in data['office_locations'] if loc['is_active']]
        return data

    def update(self, instance, validated_data):
        social_links_data = validated_data.pop('social_links', None)
        office_locations_data = validated_data.pop('office_locations', None)
        smtp_password = validated_data.pop('smtp_password', None)

        instance = super().update(instance, validated_data)

        if smtp_password is not None:
            instance.smtp_password = smtp_password
            instance.save()

        if social_links_data is not None:
            incoming_ids = [str(item['id']) for item in social_links_data if 'id' in item]
            instance.social_links.exclude(id__in=incoming_ids).delete()
            for link_data in social_links_data:
                link_id = link_data.pop('id', None)
                if link_id:
                    SocialLink.objects.update_or_create(id=link_id, site_settings=instance, defaults=link_data)
                else:
                    SocialLink.objects.create(site_settings=instance, **link_data)

        if office_locations_data is not None:
            incoming_ids = [str(item['id']) for item in office_locations_data if 'id' in item]
            instance.office_locations.exclude(id__in=incoming_ids).delete()
            for loc_data in office_locations_data:
                loc_id = loc_data.pop('id', None)
                if loc_id:
                    OfficeLocation.objects.update_or_create(id=loc_id, site_settings=instance, defaults=loc_data)
                else:
                    OfficeLocation.objects.create(site_settings=instance, **loc_data)

        return instance
