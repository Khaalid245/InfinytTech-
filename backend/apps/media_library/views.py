from django.db import models
from django.db.models import Count, Sum
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.views.decorators.cache import never_cache
from django.utils.decorators import method_decorator

from apps.core.response import api_response
from apps.core.pagination import StandardPagination
from apps.accounts.permissions import IsAdminOrSuperAdmin
from .models import MediaFolder, MediaTag, MediaFile
from .serializers import MediaFolderSerializer, MediaTagSerializer, MediaFileSerializer


class IsAdminOrReadOnlyPublic(permissions.BasePermission):
    """
    AllowSAFE_METHODS for all (authenticated and anonymous) users, 
    but restrict writes (POST, PATCH, DELETE) to Admin/SuperAdmin.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request.user, 'role', None) in ['admin', 'super_admin']
        )


class ApiResponseMixin:
    """
    Wrapper mixin ensuring all ViewSet endpoints conform to the unified 
    { success: true, message: '', data: ... } JSON response format.
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
        return api_response(message='Asset deleted successfully', status=status.HTTP_200_OK)


@method_decorator(never_cache, name='dispatch')
class MediaFolderViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    """
    CRUD management for Media Folders.
    """
    queryset = MediaFolder.objects.all().order_by('order', 'name')
    serializer_class = MediaFolderSerializer
    permission_classes = [IsAdminOrReadOnlyPublic]

    def get_queryset(self):
        qs = super().get_queryset()
        # Annotate file_count
        qs = qs.annotate(file_count=Count('files'))
        # Non-admins only see active folders
        user = self.request.user
        is_admin = user and user.is_authenticated and getattr(user, 'role', None) in ['admin', 'super_admin']
        if not is_admin:
            qs = qs.filter(is_active=True)
        return qs


class MediaTagViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    """
    CRUD management for Media Tags.
    """
    queryset = MediaTag.objects.all().order_by('name')
    serializer_class = MediaTagSerializer
    permission_classes = [IsAdminOrReadOnlyPublic]


@method_decorator(never_cache, name='dispatch')
class MediaFileViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    """
    Asset Manager covering secure file uploads, queries, filters, and metadata.
    """
    queryset = MediaFile.objects.all()
    serializer_class = MediaFileSerializer
    permission_classes = [IsAdminOrReadOnlyPublic]
    pagination_class = StandardPagination

    def get_queryset(self):
        user = self.request.user
        is_admin = user and user.is_authenticated and getattr(user, 'role', None) in ['admin', 'super_admin']

        if is_admin:
            # Admins view all uploads
            qs = MediaFile.objects.all()
        else:
            # Public / standard users restricted to public files
            qs = MediaFile.objects.filter(is_public=True)

        qs = qs.select_related('folder', 'uploaded_by').prefetch_related('tags')

        # Filter by folder ID
        folder_id = self.request.query_params.get('folder')
        if folder_id:
            qs = qs.filter(folder_id=folder_id)

        # Filter by tag slug
        tag_slug = self.request.query_params.get('tag')
        if tag_slug:
            qs = qs.filter(tags__slug=tag_slug)

        # Filter by type category (image, document, video, audio)
        file_type = self.request.query_params.get('type')
        if file_type:
            if file_type == 'image':
                qs = qs.filter(mime_type__startswith='image/')
            elif file_type == 'document':
                qs = qs.filter(mime_type='application/pdf')
            elif file_type == 'video':
                qs = qs.filter(mime_type__startswith='video/')
            elif file_type == 'audio':
                qs = qs.filter(mime_type__startswith='audio/')

        # Search filenames, captions, alt-text, titles
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                models.Q(title__icontains=search) |
                models.Q(original_filename__icontains=search) |
                models.Q(alt_text__icontains=search) |
                models.Q(caption__icontains=search)
            ).distinct()

        # Ordering options
        ordering = self.request.query_params.get('ordering')
        if ordering:
            allowed_ordering = ['created_at', '-created_at', 'file_size', '-file_size', 'title', '-title']
            if ordering in allowed_ordering:
                qs = qs.order_by(ordering)
            else:
                qs = qs.order_by('-created_at')
        else:
            qs = qs.order_by('-created_at')

        return qs

    def perform_destroy(self, instance):
        # Physically delete the uploaded file from the storage disk upon database deletion
        if instance.file:
            instance.file.delete(save=False)
        super().perform_destroy(instance)

    @action(detail=True, methods=['get'])
    def usage(self, request, pk=None):
        instance = self.get_object()
        usage_data = {}
        for f in instance._meta.get_fields():
            if f.auto_created and not f.concrete:
                if f.related_model:
                    try:
                        related_name = f.get_accessor_name()
                        manager = getattr(instance, related_name, None)
                        if manager:
                            count = manager.count()
                            if count > 0:
                                display_name = related_name.replace('_', ' ').title()
                                usage_data[display_name] = count
                    except Exception:
                        pass
        return api_response(data=usage_data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        qs = self.get_queryset()
        total_files = qs.count()
        
        from django.db.models import Sum
        total_storage = qs.aggregate(Sum('file_size'))['file_size__sum'] or 0
        
        images_count = qs.filter(mime_type__startswith='image/').count()
        videos_count = qs.filter(mime_type__startswith='video/').count()
        documents_count = qs.filter(mime_type='application/pdf').count()
        
        # If user is admin, count all folders, else active folders
        user = request.user
        is_admin = user and user.is_authenticated and getattr(user, 'role', None) in ['admin', 'super_admin']
        if is_admin:
            folders_count = MediaFolder.objects.count()
        else:
            folders_count = MediaFolder.objects.filter(is_active=True).count()
        
        return api_response(data={
            "total_files": total_files,
            "total_storage": total_storage,
            "folders": folders_count,
            "images": images_count,
            "videos": videos_count,
            "documents": documents_count
        })
