from django.db import models as django_models
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.generics import get_object_or_404
from rest_framework.throttling import AnonRateThrottle
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from apps.core.response import api_response
from apps.core.pagination import StandardPagination
from apps.accounts.permissions import IsAdminOrSuperAdmin

from .models import Department, TeamMember
from .serializers import (
    DepartmentSerializer,
    TeamMemberListSerializer,
    TeamMemberDetailSerializer,
    AdminTeamMemberSerializer,
)


class TeamAnonRateThrottle(AnonRateThrottle):
    rate = '100/minute'


# ===========================================================================
# Public APIs — AllowAny, Read-Only, Throttled
# ===========================================================================

@extend_schema(
    tags=['Team — Public'],
    summary='List active departments',
    responses=DepartmentSerializer(many=True)
)
class PublicDepartmentListView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [TeamAnonRateThrottle]

    def get(self, request):
        departments = Department.objects.filter(is_active=True).order_by('display_order', 'name')
        serializer = DepartmentSerializer(departments, many=True)
        return api_response(data=serializer.data)


@extend_schema(
    tags=['Team — Public'],
    summary='List active team members',
    parameters=[
        OpenApiParameter('department', OpenApiTypes.STR, description='Filter by department slug'),
        OpenApiParameter('featured', OpenApiTypes.BOOL, description='Fetch featured members only'),
        OpenApiParameter('search', OpenApiTypes.STR, description='Search first name, last name, or position'),
    ],
    responses=TeamMemberListSerializer(many=True)
)
class PublicTeamMemberListView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [TeamAnonRateThrottle]

    def get(self, request):
        qs = (
            TeamMember.objects
            .filter(is_active=True)
            .select_related('department', 'photo')
            .order_by('display_order', 'last_name', 'first_name')
        )

        # Filter: department slug
        department_slug = request.query_params.get('department')
        if department_slug:
            qs = qs.filter(department__slug=department_slug, department__is_active=True)

        # Filter: featured only
        featured = request.query_params.get('featured')
        if featured in ['true', '1', 'True']:
            qs = qs.filter(is_featured=True)

        # Search: first name, last name, position
        search = request.query_params.get('search')
        if search:
            qs = qs.filter(
                django_models.Q(first_name__icontains=search) |
                django_models.Q(last_name__icontains=search) |
                django_models.Q(position__icontains=search)
            ).distinct()

        paginator = StandardPagination()
        page = paginator.paginate_queryset(qs, request)
        serializer = TeamMemberListSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


@extend_schema(
    tags=['Team — Public'],
    summary='Retrieve a single active team member by slug',
    responses=TeamMemberDetailSerializer
)
class PublicTeamMemberDetailView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [TeamAnonRateThrottle]

    def get(self, request, slug):
        member = get_object_or_404(
            TeamMember.objects.select_related('department', 'photo'),
            slug=slug,
            is_active=True
        )
        serializer = TeamMemberDetailSerializer(member, context={'request': request})
        return api_response(data=serializer.data)


# ===========================================================================
# Shared Mixin — wraps ModelViewSet responses in standard api_response format
# ===========================================================================

class ApiResponseMixin:
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
        return api_response(message='Deleted successfully.', status=status.HTTP_200_OK)


# ===========================================================================
# Admin CRUD APIs — JWT protected, IsAdminOrSuperAdmin only
# ===========================================================================

@extend_schema(tags=['Team — Admin'])
class AdminDepartmentViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    queryset = Department.objects.all().order_by('display_order', 'name')
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]


@extend_schema(tags=['Team — Admin'])
class AdminTeamMemberViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    queryset = (
        TeamMember.objects
        .all()
        .select_related('department', 'photo')
        .order_by('display_order', 'last_name', 'first_name')
    )
    serializer_class = AdminTeamMemberSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]
