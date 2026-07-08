from rest_framework import serializers
from .models import ServiceCategory, Service, ServiceFeature, Industry, ProcessStep, FAQ


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ('id', 'name', 'slug', 'description', 'is_active', 'order', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class ServiceFeatureSerializer(serializers.ModelSerializer):
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        source='service'
    )

    class Meta:
        model = ServiceFeature
        fields = ('id', 'service_id', 'title', 'description', 'is_active', 'order', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = ('id', 'name', 'slug', 'description', 'icon', 'is_active', 'order', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = (
            'id', 'question', 'answer_intro', 'answer_bullets', 'answer_outro',
            'is_active', 'order', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class ServiceSerializer(serializers.ModelSerializer):
    category = ServiceCategorySerializer(read_only=True)
    features = ServiceFeatureSerializer(many=True, read_only=True)
    industries = IndustrySerializer(many=True, read_only=True)
    faqs = FAQSerializer(many=True, read_only=True)
    featured_image = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = (
            'id', 'category', 'title', 'slug', 'short_description', 'description',
            'icon', 'featured_image', 'is_featured', 'benefits', 'is_active', 'order', 
            'features', 'industries', 'faqs', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_featured_image(self, obj):
        request = self.context.get('request')
        if obj.featured_media and obj.featured_media.file:
            return request.build_absolute_uri(obj.featured_media.file.url) if request else obj.featured_media.file.url
        return None


class ServiceAdminSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=ServiceCategory.objects.all(),
        source='category',
        required=False,
        allow_null=True
    )
    featured_media_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.featured_media.field.related_model.objects.all(),
        source='featured_media',
        required=False,
        allow_null=True
    )
    industry_ids = serializers.PrimaryKeyRelatedField(
        queryset=Industry.objects.all(),
        source='industries',
        many=True,
        required=False
    )
    faq_ids = serializers.PrimaryKeyRelatedField(
        queryset=FAQ.objects.all(),
        source='faqs',
        many=True,
        required=False
    )

    class Meta:
        model = Service
        fields = (
            'id', 'category_id', 'title', 'slug', 'short_description', 'description',
            'icon', 'featured_media_id', 'is_featured', 'benefits', 'industry_ids', 'faq_ids',
            'is_active', 'order', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class ProcessStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessStep
        fields = (
            'id', 'step_number', 'short_title', 'full_title', 'description',
            'icon', 'duration', 'deliverables', 'outcomes', 'is_active', 'order',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


        read_only_fields = ('id', 'created_at', 'updated_at')
