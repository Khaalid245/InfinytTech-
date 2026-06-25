from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import BlogCategory, BlogTag, BlogPost

User = get_user_model()


class BlogAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'role')


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ('id', 'name', 'slug', 'description', 'is_active', 'order')
        read_only_fields = ('id',)


class BlogTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogTag
        fields = ('id', 'name', 'slug')
        read_only_fields = ('id',)


class BlogPostListSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    tags = BlogTagSerializer(many=True, read_only=True)
    author = BlogAuthorSerializer(read_only=True)

    class Meta:
        model = BlogPost
        fields = (
            'id', 'title', 'slug', 'excerpt', 'featured_image', 
            'author', 'category', 'tags', 'status', 'is_featured', 
            'reading_time', 'published_at', 'created_at'
        )
        read_only_fields = fields


class BlogPostDetailSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    tags = BlogTagSerializer(many=True, read_only=True)
    author = BlogAuthorSerializer(read_only=True)

    class Meta:
        model = BlogPost
        fields = (
            'id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 
            'author', 'category', 'tags', 'status', 'is_featured', 
            'seo_title', 'seo_description', 'reading_time', 
            'published_at', 'created_at', 'updated_at'
        )
        read_only_fields = fields


class BlogPostAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = (
            'id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 
            'author', 'category', 'tags', 'status', 'is_featured', 
            'seo_title', 'seo_description', 'reading_time', 
            'published_at', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'reading_time', 'published_at', 'created_at', 'updated_at')
