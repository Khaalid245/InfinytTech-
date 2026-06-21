from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from apps.core.response import api_response, api_error
from apps.core.pagination import StandardPagination
from apps.accounts.permissions import IsAdminOrSuperAdmin

from .models import ProjectCategory, Technology, ProjectTag, Project, ProjectImage, ProjectMetric
from .serializers import (
    ProjectCategorySerializer,
    TechnologySerializer,
    ProjectTagSerializer,
    ProjectListSerializer,
    ProjectDetailSerializer,
    ProjectAdminSerializer,
    ProjectImageAdminSerializer,
    ProjectMetricAdminSerializer,
)


# ===========================================================================
# Phase 2.8 — Public Read-Only API
# ===========================================================================

@extend_schema(
    tags=['Portfolio — Public'],
    summary='List published projects',
    parameters=[
        OpenApiParameter('category', OpenApiTypes.STR, description='Filter by category slug'),
        OpenApiParameter('technology', OpenApiTypes.STR, description='Filter by technology slug'),
        OpenApiParameter('tag', OpenApiTypes.STR, description='Filter by tag slug'),
        OpenApiParameter('featured', OpenApiTypes.INT, description='1 = featured only'),
        OpenApiParameter('search', OpenApiTypes.STR, description='Search title/description'),
    ],
    responses=ProjectListSerializer,
)
class PublicProjectListView(APIView):
    """
    GET /api/portfolio/projects/
    Returns only PUBLISHED projects.
    Query params:
      - ?category=<slug>
      - ?featured=1
      - ?technology=<slug>
      - ?search=<term>
    """
    permission_classes = [AllowAny]

    def get(self, request):
        qs = (
            Project.objects
            .filter(status=Project.Status.PUBLISHED)
            .select_related('category')
            .prefetch_related('technologies', 'tags')
        )

        category_slug = request.query_params.get('category')
        if category_slug:
            qs = qs.filter(category__slug=category_slug)

        technology_slug = request.query_params.get('technology')
        if technology_slug:
            qs = qs.filter(technologies__slug=technology_slug)

        tag_slug = request.query_params.get('tag')
        if tag_slug:
            qs = qs.filter(tags__slug=tag_slug)

        if request.query_params.get('featured'):
            qs = qs.filter(is_featured=True)

        search = request.query_params.get('search')
        if search:
            qs = qs.filter(title__icontains=search) | qs.filter(short_description__icontains=search)

        paginator = StandardPagination()
        page = paginator.paginate_queryset(qs, request)
        serializer = ProjectListSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


@extend_schema(
    tags=['Portfolio — Public'],
    summary='Retrieve a published project by slug',
    responses=ProjectDetailSerializer,
)
class PublicProjectDetailView(APIView):
    """
    GET /api/portfolio/projects/<slug>/
    Returns full project detail (PUBLISHED only).
    """
    permission_classes = [AllowAny]

    def get(self, request, slug):
        project = get_object_or_404(
            Project.objects
            .filter(status=Project.Status.PUBLISHED)
            .select_related('category')
            .prefetch_related('technologies', 'tags', 'images', 'metrics'),
            slug=slug,
        )
        serializer = ProjectDetailSerializer(project, context={'request': request})
        return api_response(data=serializer.data)


@extend_schema(
    tags=['Portfolio — Public'],
    summary='List active project categories',
    responses=ProjectCategorySerializer,
)
class PublicCategoryListView(APIView):
    """
    GET /api/portfolio/project-categories/
    Returns all active categories.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        qs = ProjectCategory.objects.filter(is_active=True)
        serializer = ProjectCategorySerializer(qs, many=True, context={'request': request})
        return api_response(data=serializer.data)


@extend_schema(
    tags=['Portfolio — Public'],
    summary='List active technologies',
    responses=TechnologySerializer,
)
class PublicTechnologyListView(APIView):
    """
    GET /api/portfolio/technologies/
    Returns all active technologies.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Technology.objects.filter(is_active=True)
        serializer = TechnologySerializer(qs, many=True, context={'request': request})
        return api_response(data=serializer.data)


@extend_schema(
    tags=['Portfolio — Public'],
    summary='List active project tags',
    responses=ProjectTagSerializer,
)
class PublicTagListView(APIView):
    """
    GET /api/portfolio/tags/
    Returns all active project tags.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        qs = ProjectTag.objects.filter(is_active=True)
        serializer = ProjectTagSerializer(qs, many=True, context={'request': request})
        return api_response(data=serializer.data)


# ===========================================================================
# Phase 2.9 — Admin CRUD API (ADMIN / SUPER_ADMIN only)
# ===========================================================================

@extend_schema_view(
    get=extend_schema(tags=['Portfolio — Admin'], summary='List all projects (admin)', responses=ProjectAdminSerializer),
    post=extend_schema(tags=['Portfolio — Admin'], summary='Create project', request=ProjectAdminSerializer, responses=ProjectAdminSerializer),
)
class AdminProjectListCreateView(APIView):
    """
    GET  /api/portfolio/admin/projects/      — List all projects (any status)
    POST /api/portfolio/admin/projects/      — Create new project
    """
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        qs = (
            Project.objects
            .select_related('category')
            .prefetch_related('technologies', 'tags', 'images', 'metrics')
        )
        status_filter = request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)

        paginator = StandardPagination()
        page = paginator.paginate_queryset(qs, request)
        serializer = ProjectAdminSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = ProjectAdminSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return api_error('Validation failed.', errors=serializer.errors)
        serializer.save()
        return api_response(data=serializer.data, message='Project created.', status=201)


@extend_schema_view(
    get=extend_schema(tags=['Portfolio — Admin'], summary='Retrieve project (admin)', responses=ProjectAdminSerializer),
    put=extend_schema(tags=['Portfolio — Admin'], summary='Full update project', request=ProjectAdminSerializer, responses=ProjectAdminSerializer),
    patch=extend_schema(tags=['Portfolio — Admin'], summary='Partial update project', request=ProjectAdminSerializer, responses=ProjectAdminSerializer),
    delete=extend_schema(tags=['Portfolio — Admin'], summary='Delete project'),
)
class AdminProjectDetailView(APIView):
    """
    GET    /api/portfolio/admin/projects/<slug>/   — Retrieve project
    PUT    /api/portfolio/admin/projects/<slug>/   — Full update
    PATCH  /api/portfolio/admin/projects/<slug>/   — Partial update
    DELETE /api/portfolio/admin/projects/<slug>/   — Delete project
    """
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def _get_project(self, slug):
        return get_object_or_404(
            Project.objects
            .select_related('category')
            .prefetch_related('technologies', 'tags', 'images', 'metrics'),
            slug=slug,
        )

    def get(self, request, slug):
        serializer = ProjectAdminSerializer(self._get_project(slug), context={'request': request})
        return api_response(data=serializer.data)

    def put(self, request, slug):
        serializer = ProjectAdminSerializer(
            self._get_project(slug), data=request.data, context={'request': request}
        )
        if not serializer.is_valid():
            return api_error('Validation failed.', errors=serializer.errors)
        serializer.save()
        return api_response(data=serializer.data, message='Project updated.')

    def patch(self, request, slug):
        serializer = ProjectAdminSerializer(
            self._get_project(slug), data=request.data,
            partial=True, context={'request': request}
        )
        if not serializer.is_valid():
            return api_error('Validation failed.', errors=serializer.errors)
        serializer.save()
        return api_response(data=serializer.data, message='Project updated.')

    def delete(self, request, slug):
        self._get_project(slug).delete()
        return api_response(message='Project deleted.')


@extend_schema(
    tags=['Portfolio — Admin'],
    summary='Upload image to project',
    request=ProjectImageAdminSerializer,
    responses=ProjectImageAdminSerializer,
)
class AdminProjectImageCreateView(APIView):
    """
    POST /api/portfolio/admin/projects/<slug>/images/
    Upload an image for a project.
    """
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, slug):
        project = get_object_or_404(Project, slug=slug)
        serializer = ProjectImageAdminSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return api_error('Validation failed.', errors=serializer.errors)
        serializer.save(project=project)
        return api_response(data=serializer.data, message='Image uploaded.', status=201)


@extend_schema(
    tags=['Portfolio — Admin'],
    summary='Delete project image',
)
class AdminProjectImageDeleteView(APIView):
    """
    DELETE /api/portfolio/admin/projects/<slug>/images/<pk>/
    Remove a specific image from a project.
    """
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def delete(self, request, slug, pk):
        project = get_object_or_404(Project, slug=slug)
        image = get_object_or_404(ProjectImage, pk=pk, project=project)
        image.delete()
        return api_response(message='Image deleted.')


@extend_schema(
    tags=['Portfolio — Admin'],
    summary='Add metric to project',
    request=ProjectMetricAdminSerializer,
    responses=ProjectMetricAdminSerializer,
)
class AdminProjectMetricCreateView(APIView):
    """
    POST /api/portfolio/admin/projects/<slug>/metrics/
    Add a metric to a project.
    """
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def post(self, request, slug):
        project = get_object_or_404(Project, slug=slug)
        serializer = ProjectMetricAdminSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return api_error('Validation failed.', errors=serializer.errors)
        serializer.save(project=project)
        return api_response(data=serializer.data, message='Metric created.', status=201)


@extend_schema(
    tags=['Portfolio — Admin'],
    summary='Delete project metric',
)
class AdminProjectMetricDeleteView(APIView):
    """
    DELETE /api/portfolio/admin/projects/<slug>/metrics/<pk>/
    Remove a specific metric from a project.
    """
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def delete(self, request, slug, pk):
        project = get_object_or_404(Project, slug=slug)
        metric = get_object_or_404(ProjectMetric, pk=pk, project=project)
        metric.delete()
        return api_response(message='Metric deleted.')


# ---------------------------------------------------------------------------
# Admin CRUD: Categories
# ---------------------------------------------------------------------------

@extend_schema_view(
    get=extend_schema(tags=['Portfolio — Admin'], summary='List all categories', responses=ProjectCategorySerializer),
    post=extend_schema(tags=['Portfolio — Admin'], summary='Create category', request=ProjectCategorySerializer, responses=ProjectCategorySerializer),
)
class AdminCategoryListCreateView(APIView):
    """
    GET  /api/portfolio/admin/categories/
    POST /api/portfolio/admin/categories/
    """
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def get(self, request):
        qs = ProjectCategory.objects.all()
        serializer = ProjectCategorySerializer(qs, many=True, context={'request': request})
        return api_response(data=serializer.data)

    def post(self, request):
        serializer = ProjectCategorySerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return api_error('Validation failed.', errors=serializer.errors)
        serializer.save()
        return api_response(data=serializer.data, message='Category created.', status=201)


@extend_schema_view(
    get=extend_schema(tags=['Portfolio — Admin'], summary='Retrieve category', responses=ProjectCategorySerializer),
    put=extend_schema(tags=['Portfolio — Admin'], summary='Update category', request=ProjectCategorySerializer, responses=ProjectCategorySerializer),
    patch=extend_schema(tags=['Portfolio — Admin'], summary='Partial update category', request=ProjectCategorySerializer, responses=ProjectCategorySerializer),
    delete=extend_schema(tags=['Portfolio — Admin'], summary='Delete category'),
)
class AdminCategoryDetailView(APIView):
    """
    GET    /api/portfolio/admin/categories/<slug>/
    PUT    /api/portfolio/admin/categories/<slug>/
    PATCH  /api/portfolio/admin/categories/<slug>/
    DELETE /api/portfolio/admin/categories/<slug>/
    """
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def _get_obj(self, slug):
        return get_object_or_404(ProjectCategory, slug=slug)

    def get(self, request, slug):
        serializer = ProjectCategorySerializer(self._get_obj(slug), context={'request': request})
        return api_response(data=serializer.data)

    def put(self, request, slug):
        serializer = ProjectCategorySerializer(self._get_obj(slug), data=request.data, context={'request': request})
        if not serializer.is_valid():
            return api_error('Validation failed.', errors=serializer.errors)
        serializer.save()
        return api_response(data=serializer.data, message='Category updated.')

    def patch(self, request, slug):
        serializer = ProjectCategorySerializer(
            self._get_obj(slug), data=request.data, partial=True, context={'request': request}
        )
        if not serializer.is_valid():
            return api_error('Validation failed.', errors=serializer.errors)
        serializer.save()
        return api_response(data=serializer.data, message='Category updated.')

    def delete(self, request, slug):
        self._get_obj(slug).delete()
        return api_response(message='Category deleted.')


# ---------------------------------------------------------------------------
# Admin CRUD: Technologies
# ---------------------------------------------------------------------------

@extend_schema_view(
    get=extend_schema(tags=['Portfolio — Admin'], summary='List all technologies', responses=TechnologySerializer),
    post=extend_schema(tags=['Portfolio — Admin'], summary='Create technology', request=TechnologySerializer, responses=TechnologySerializer),
)
class AdminTechnologyListCreateView(APIView):
    """
    GET  /api/portfolio/admin/technologies/
    POST /api/portfolio/admin/technologies/
    """
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def get(self, request):
        qs = Technology.objects.all()
        serializer = TechnologySerializer(qs, many=True, context={'request': request})
        return api_response(data=serializer.data)

    def post(self, request):
        serializer = TechnologySerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return api_error('Validation failed.', errors=serializer.errors)
        serializer.save()
        return api_response(data=serializer.data, message='Technology created.', status=201)


@extend_schema_view(
    get=extend_schema(tags=['Portfolio — Admin'], summary='Retrieve technology', responses=TechnologySerializer),
    put=extend_schema(tags=['Portfolio — Admin'], summary='Update technology', request=TechnologySerializer, responses=TechnologySerializer),
    patch=extend_schema(tags=['Portfolio — Admin'], summary='Partial update technology', request=TechnologySerializer, responses=TechnologySerializer),
    delete=extend_schema(tags=['Portfolio — Admin'], summary='Delete technology'),
)
class AdminTechnologyDetailView(APIView):
    """
    GET    /api/portfolio/admin/technologies/<slug>/
    PUT    /api/portfolio/admin/technologies/<slug>/
    PATCH  /api/portfolio/admin/technologies/<slug>/
    DELETE /api/portfolio/admin/technologies/<slug>/
    """
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def _get_obj(self, slug):
        return get_object_or_404(Technology, slug=slug)

    def get(self, request, slug):
        serializer = TechnologySerializer(self._get_obj(slug), context={'request': request})
        return api_response(data=serializer.data)

    def put(self, request, slug):
        serializer = TechnologySerializer(self._get_obj(slug), data=request.data, context={'request': request})
        if not serializer.is_valid():
            return api_error('Validation failed.', errors=serializer.errors)
        serializer.save()
        return api_response(data=serializer.data, message='Technology updated.')

    def patch(self, request, slug):
        serializer = TechnologySerializer(
            self._get_obj(slug), data=request.data, partial=True, context={'request': request}
        )
        if not serializer.is_valid():
            return api_error('Validation failed.', errors=serializer.errors)
        serializer.save()
        return api_response(data=serializer.data, message='Technology updated.')

    def delete(self, request, slug):
        self._get_obj(slug).delete()
        return api_response(message='Technology deleted.')


# ---------------------------------------------------------------------------
# Admin CRUD: Tags
# ---------------------------------------------------------------------------

@extend_schema_view(
    get=extend_schema(tags=['Portfolio — Admin'], summary='List all tags', responses=ProjectTagSerializer),
    post=extend_schema(tags=['Portfolio — Admin'], summary='Create tag', request=ProjectTagSerializer, responses=ProjectTagSerializer),
)
class AdminTagListCreateView(APIView):
    """
    GET  /api/portfolio/admin/tags/
    POST /api/portfolio/admin/tags/
    """
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def get(self, request):
        qs = ProjectTag.objects.all()
        serializer = ProjectTagSerializer(qs, many=True, context={'request': request})
        return api_response(data=serializer.data)

    def post(self, request):
        serializer = ProjectTagSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return api_error('Validation failed.', errors=serializer.errors)
        serializer.save()
        return api_response(data=serializer.data, message='Tag created.', status=201)


@extend_schema_view(
    get=extend_schema(tags=['Portfolio — Admin'], summary='Retrieve tag', responses=ProjectTagSerializer),
    put=extend_schema(tags=['Portfolio — Admin'], summary='Update tag', request=ProjectTagSerializer, responses=ProjectTagSerializer),
    patch=extend_schema(tags=['Portfolio — Admin'], summary='Partial update tag', request=ProjectTagSerializer, responses=ProjectTagSerializer),
    delete=extend_schema(tags=['Portfolio — Admin'], summary='Delete tag'),
)
class AdminTagDetailView(APIView):
    """
    GET    /api/portfolio/admin/tags/<slug>/
    PUT    /api/portfolio/admin/tags/<slug>/
    PATCH  /api/portfolio/admin/tags/<slug>/
    DELETE /api/portfolio/admin/tags/<slug>/
    """
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def _get_obj(self, slug):
        return get_object_or_404(ProjectTag, slug=slug)

    def get(self, request, slug):
        serializer = ProjectTagSerializer(self._get_obj(slug), context={'request': request})
        return api_response(data=serializer.data)

    def put(self, request, slug):
        serializer = ProjectTagSerializer(self._get_obj(slug), data=request.data, context={'request': request})
        if not serializer.is_valid():
            return api_error('Validation failed.', errors=serializer.errors)
        serializer.save()
        return api_response(data=serializer.data, message='Tag updated.')

    def patch(self, request, slug):
        serializer = ProjectTagSerializer(
            self._get_obj(slug), data=request.data, partial=True, context={'request': request}
        )
        if not serializer.is_valid():
            return api_error('Validation failed.', errors=serializer.errors)
        serializer.save()
        return api_response(data=serializer.data, message='Tag updated.')

    def delete(self, request, slug):
        self._get_obj(slug).delete()
        return api_response(message='Tag deleted.')
