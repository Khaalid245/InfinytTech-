from rest_framework import serializers
from .models import ProjectCategory, Technology, ProjectTag, Project, ProjectImage, ProjectMetric


# ---------------------------------------------------------------------------
# Atomic serializers
# ---------------------------------------------------------------------------

class ProjectCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectCategory
        fields = ('id', 'name', 'slug', 'description', 'is_active', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ('id', 'name', 'slug', 'icon_name', 'is_active', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class ProjectTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTag
        fields = ('id', 'name', 'slug', 'description', 'is_active', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class ProjectImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProjectImage
        fields = ('id', 'image', 'caption', 'display_order', 'created_at')
        read_only_fields = ('id', 'created_at')

    def get_image(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(obj.image.url) if request else obj.image.url


class ProjectMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMetric
        fields = ('id', 'metric_label', 'metric_value', 'display_order', 'created_at')
        read_only_fields = ('id', 'created_at')


# ---------------------------------------------------------------------------
# Public serializers (read-only)
# ---------------------------------------------------------------------------

class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for project list/card views."""
    category = ProjectCategorySerializer(read_only=True)
    technologies = TechnologySerializer(many=True, read_only=True)
    tags = ProjectTagSerializer(many=True, read_only=True)
    featured_image = serializers.SerializerMethodField()

    metrics = ProjectMetricSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = (
            'id', 'title', 'slug', 'short_description',
            'featured_image', 'client_name', 'project_url',
            'status', 'is_featured', 'category', 'technologies', 'tags',
            'metrics', 'created_at',
        )
        read_only_fields = ('id', 'created_at')

    def get_featured_image(self, obj):
        if not obj.featured_image:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(obj.featured_image.url) if request else obj.featured_image.url


class ProjectDetailSerializer(serializers.ModelSerializer):
    """Full detail serializer including nested images and metrics."""
    category = ProjectCategorySerializer(read_only=True)
    technologies = TechnologySerializer(many=True, read_only=True)
    tags = ProjectTagSerializer(many=True, read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    metrics = ProjectMetricSerializer(many=True, read_only=True)
    featured_image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            'id', 'title', 'slug', 'short_description', 'full_description',
            'featured_image', 'client_name', 'project_url',
            'status', 'is_featured',
            'meta_title', 'meta_description',
            'category', 'technologies', 'tags',
            'images', 'metrics',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_featured_image(self, obj):
        if not obj.featured_image:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(obj.featured_image.url) if request else obj.featured_image.url


# ---------------------------------------------------------------------------
# Admin serializers (writable)
# ---------------------------------------------------------------------------

class ProjectAdminSerializer(serializers.ModelSerializer):
    """
    Writable serializer for admin CRUD operations.
    Accepts technology IDs and tag IDs (UUIDs) for M2M assignment.
    """
    technologies = TechnologySerializer(many=True, read_only=True)
    technology_ids = serializers.PrimaryKeyRelatedField(
        source='technologies',
        queryset=Technology.objects.filter(is_active=True),
        many=True,
        write_only=True,
        required=False,
    )
    tags = ProjectTagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        source='tags',
        queryset=ProjectTag.objects.filter(is_active=True),
        many=True,
        write_only=True,
        required=False,
    )
    category = ProjectCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source='category',
        queryset=ProjectCategory.objects.filter(is_active=True),
        write_only=True,
        required=False,
        allow_null=True,
    )
    images = ProjectImageSerializer(many=True, read_only=True)
    metrics = ProjectMetricSerializer(many=True, read_only=True)
    featured_image = serializers.SerializerMethodField()
    featured_image_upload = serializers.ImageField(
        source='featured_image',
        write_only=True,
        required=False,
    )

    class Meta:
        model = Project
        fields = (
            'id', 'title', 'slug', 'short_description', 'full_description',
            'featured_image', 'featured_image_upload',
            'client_name', 'project_url',
            'status', 'is_featured',
            'meta_title', 'meta_description',
            'category', 'category_id',
            'technologies', 'technology_ids',
            'tags', 'tag_ids',
            'images', 'metrics',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_featured_image(self, obj):
        if not obj.featured_image:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(obj.featured_image.url) if request else obj.featured_image.url


class ProjectImageAdminSerializer(serializers.ModelSerializer):
    """Writable serializer for adding images to a project."""
    image = serializers.ImageField()

    class Meta:
        model = ProjectImage
        fields = ('id', 'image', 'caption', 'display_order', 'created_at')
        read_only_fields = ('id', 'created_at')


class ProjectMetricAdminSerializer(serializers.ModelSerializer):
    """Writable serializer for adding metrics to a project."""
    class Meta:
        model = ProjectMetric
        fields = ('id', 'metric_label', 'metric_value', 'display_order', 'created_at')
        read_only_fields = ('id', 'created_at')
