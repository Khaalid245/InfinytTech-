from django.db import models
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.generics import get_object_or_404
from rest_framework.throttling import AnonRateThrottle
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from apps.core.response import api_response
from apps.core.pagination import StandardPagination
from apps.accounts.permissions import IsAdminOrSuperAdmin
from .models import BlogCategory, BlogTag, BlogPost
from .serializers import (
    BlogCategorySerializer,
    BlogTagSerializer,
    BlogPostListSerializer,
    BlogPostDetailSerializer,
    BlogPostAdminSerializer
)


class BlogAnonRateThrottle(AnonRateThrottle):
    rate = '100/minute'


# ===========================================================================
# Public APIs (AllowAny, Read-Only, Throttled)
# ===========================================================================

@extend_schema(
    tags=['Blog — Public'],
    summary='List active blog categories',
    responses=BlogCategorySerializer(many=True)
)
class PublicCategoryListView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [BlogAnonRateThrottle]

    def get(self, request):
        categories = BlogCategory.objects.filter(is_active=True).order_by('order', 'name')
        serializer = BlogCategorySerializer(categories, many=True)
        return api_response(data=serializer.data)


@extend_schema(
    tags=['Blog — Public'],
    summary='List all active blog tags',
    responses=BlogTagSerializer(many=True)
)
class PublicTagListView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [BlogAnonRateThrottle]

    def get(self, request):
        tags = BlogTag.objects.all().order_by('name')
        serializer = BlogTagSerializer(tags, many=True)
        return api_response(data=serializer.data)


@extend_schema(
    tags=['Blog — Public'],
    summary='List published blog posts',
    parameters=[
        OpenApiParameter('category', OpenApiTypes.STR, description='Filter by category slug'),
        OpenApiParameter('tag', OpenApiTypes.STR, description='Filter by tag slug'),
        OpenApiParameter('featured', OpenApiTypes.BOOL, description='Fetch featured posts only'),
        OpenApiParameter('search', OpenApiTypes.STR, description='Search title/excerpt/content'),
    ],
    responses=BlogPostListSerializer(many=True)
)
class PublicPostListView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [BlogAnonRateThrottle]

    def get(self, request):
        qs = BlogPost.objects.filter(status=BlogPost.StatusChoices.PUBLISHED)\
            .select_related('category', 'author')\
            .prefetch_related('tags')

        category_slug = request.query_params.get('category')
        if category_slug:
            qs = qs.filter(category__slug=category_slug, category__is_active=True)

        tag_slug = request.query_params.get('tag')
        if tag_slug:
            qs = qs.filter(tags__slug=tag_slug)

        featured = request.query_params.get('featured')
        if featured in ['true', '1', 'True']:
            qs = qs.filter(is_featured=True)

        search = request.query_params.get('search')
        if search:
            qs = qs.filter(
                models.Q(title__icontains=search) | 
                models.Q(excerpt__icontains=search) | 
                models.Q(content__icontains=search)
            ).distinct()

        paginator = StandardPagination()
        page = paginator.paginate_queryset(qs, request)
        serializer = BlogPostListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)


@extend_schema(
    tags=['Blog — Public'],
    summary='Retrieve a single published blog post by slug',
    responses=BlogPostDetailSerializer
)
class PublicPostDetailView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [BlogAnonRateThrottle]

    def get(self, request, slug):
        post = get_object_or_404(
            BlogPost.objects.select_related('category', 'author').prefetch_related('tags'),
            slug=slug,
            status=BlogPost.StatusChoices.PUBLISHED
        )
        serializer = BlogPostDetailSerializer(post)
        return api_response(data=serializer.data)


# ===========================================================================
# Admin CRUD APIs (Requires IsAdminOrSuperAdmin)
# ===========================================================================

class ApiResponseMixin:
    """
    Mixin to wrap ModelViewSet responses in the standard api_response format.
    """
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(data=serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return api_response(data=serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return api_response(data=serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return api_response(message='Deleted successfully', status=status.HTTP_200_OK)


@extend_schema(tags=['Blog — Admin'])
class AdminCategoryViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    queryset = BlogCategory.objects.all().order_by('order', 'name')
    serializer_class = BlogCategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]


@extend_schema(tags=['Blog — Admin'])
class AdminTagViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    queryset = BlogTag.objects.all().order_by('name')
    serializer_class = BlogTagSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]


@extend_schema(tags=['Blog — Admin'])
class AdminPostViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    queryset = BlogPost.objects.all().select_related('category', 'author').prefetch_related('tags')
    serializer_class = BlogPostAdminSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return BlogPostDetailSerializer
        return BlogPostAdminSerializer

