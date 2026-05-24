from rest_framework import serializers
from .models import Category, Post


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug')
        read_only_fields = ('id',)


class PostListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views — no full content."""
    author_name = serializers.CharField(source='author.full_name', read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'title', 'slug', 'author_name', 'category', 'thumbnail', 'status', 'published_at')


class PostDetailSerializer(serializers.ModelSerializer):
    """Full serializer for detail/write views."""
    author_name = serializers.CharField(source='author.full_name', read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source='category',
        queryset=Category.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Post
        fields = (
            'id', 'title', 'slug', 'author_name', 'category', 'category_id',
            'content', 'thumbnail', 'status', 'published_at', 'created_at',
        )
        read_only_fields = ('id', 'author_name', 'created_at')
