from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import BlogCategory, BlogTag, BlogPost
from apps.media_library.serializers import MediaFileSerializer
from apps.media_library.models import MediaFile

User = get_user_model()


class BlogAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'role')


class BlogCategorySerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(read_only=True, required=False)

    class Meta:
        model = BlogCategory
        fields = ('id', 'name', 'slug', 'description', 'is_active', 'order', 'post_count')
        read_only_fields = ('id', 'post_count')


class BlogTagSerializer(serializers.ModelSerializer):
    usage_count = serializers.IntegerField(read_only=True, required=False)

    class Meta:
        model = BlogTag
        fields = ('id', 'name', 'slug', 'description', 'is_active', 'usage_count')
        read_only_fields = ('id', 'usage_count')


class BlogPostListSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    tags = BlogTagSerializer(many=True, read_only=True)
    author = BlogAuthorSerializer(read_only=True)
    featured_image = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = (
            'id', 'title', 'slug', 'excerpt', 'featured_image', 
            'author', 'category', 'tags', 'status', 'is_featured', 
            'reading_time', 'published_at', 'created_at'
        )
        read_only_fields = fields

    def get_featured_image(self, obj):
        request = self.context.get('request')
        if obj.featured_media and obj.featured_media.file:
            return request.build_absolute_uri(obj.featured_media.file.url) if request else obj.featured_media.file.url
        return None

class BlogPostDetailSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    tags = BlogTagSerializer(many=True, read_only=True)
    author = BlogAuthorSerializer(read_only=True)
    featured_image = serializers.SerializerMethodField()
    featured_media = MediaFileSerializer(read_only=True)

    class Meta:
        model = BlogPost
        fields = (
            'id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 'featured_media',
            'author', 'category', 'tags', 'status', 'is_featured', 
            'seo_title', 'seo_description', 'reading_time', 
            'published_at', 'created_at', 'updated_at'
        )
        read_only_fields = fields

    def get_featured_image(self, obj):
        request = self.context.get('request')
        if obj.featured_media and obj.featured_media.file:
            return request.build_absolute_uri(obj.featured_media.file.url) if request else obj.featured_media.file.url
        return None

class BlogPostAdminSerializer(serializers.ModelSerializer):
    featured_image = serializers.SerializerMethodField()
    featured_media = MediaFileSerializer(read_only=True)
    featured_media_id = serializers.PrimaryKeyRelatedField(
        queryset=MediaFile.objects.all(), source='featured_media', required=False, allow_null=True
    )
    author = BlogAuthorSerializer(read_only=True)

    class Meta:
        model = BlogPost
        fields = (
            'id', 'title', 'slug', 'excerpt', 'content', 'featured_media', 'featured_media_id', 'featured_image', 
            'author', 'category', 'tags', 'status', 'is_featured', 
            'seo_title', 'seo_description', 'reading_time', 
            'published_at', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'reading_time', 'published_at', 'created_at', 'updated_at', 'featured_image', 'featured_media', 'author')

    def get_featured_image(self, obj):
        request = self.context.get('request')
        if obj.featured_media and obj.featured_media.file:
            return request.build_absolute_uri(obj.featured_media.file.url) if request else obj.featured_media.file.url
        return None
