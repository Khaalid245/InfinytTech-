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


class ServiceSerializer(serializers.ModelSerializer):
    category = ServiceCategorySerializer(read_only=True)
    features = ServiceFeatureSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = (
            'id', 'category', 'title', 'slug', 'description',
            'icon', 'is_active', 'order', 'features', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class ServiceAdminSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=ServiceCategory.objects.all(),
        source='category',
        required=False,
        allow_null=True
    )

    class Meta:
        model = Service
        fields = (
            'id', 'category_id', 'title', 'slug', 'description',
            'icon', 'is_active', 'order', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = ('id', 'name', 'slug', 'description', 'icon', 'is_active', 'order', 'created_at', 'updated_at')
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


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = (
            'id', 'question', 'answer_intro', 'answer_bullets', 'answer_outro',
            'is_active', 'order', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')
