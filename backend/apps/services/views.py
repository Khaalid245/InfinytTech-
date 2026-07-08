from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import get_object_or_404
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from apps.core.response import api_response, api_error
from apps.core.pagination import StandardPagination
from apps.accounts.permissions import IsAdminOrSuperAdmin

from .models import ServiceCategory, Service, ServiceFeature, Industry, ProcessStep, FAQ
from .serializers import (
    ServiceCategorySerializer,
    ServiceFeatureSerializer,
    ServiceSerializer,
    ServiceAdminSerializer,
    IndustrySerializer,
    ProcessStepSerializer,
    FAQSerializer,
)


# ===========================================================================
# Public Read-Only APIs
# ===========================================================================

@extend_schema(
    tags=['Services — Public'],
    summary='List active service categories',
    responses=ServiceCategorySerializer(many=True),
)
class PublicCategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = ServiceCategory.objects.filter(is_active=True).order_by('order', 'name')
        serializer = ServiceCategorySerializer(categories, many=True)
        return api_response(data=serializer.data)


@extend_schema(
    tags=['Services — Public'],
    summary='List active services',
    parameters=[
        OpenApiParameter('category', OpenApiTypes.STR, description='Filter by category slug'),
        OpenApiParameter('search', OpenApiTypes.STR, description='Search title/description'),
    ],
    responses=ServiceSerializer(many=True),
)
class PublicServiceListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Service.objects.filter(is_active=True).select_related('category').prefetch_related('features')

        category_slug = request.query_params.get('category')
        if category_slug:
            qs = qs.filter(category__slug=category_slug)

        search = request.query_params.get('search')
        if search:
            qs = qs.filter(title__icontains=search) | qs.filter(description__icontains=search)

        paginator = StandardPagination()
        page = paginator.paginate_queryset(qs, request)
        serializer = ServiceSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)


@extend_schema(
    tags=['Services — Public'],
    summary='List active industries',
    responses=IndustrySerializer(many=True),
)
class PublicIndustryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        industries = Industry.objects.filter(is_active=True).order_by('order', 'name')
        serializer = IndustrySerializer(industries, many=True)
        return api_response(data=serializer.data)


@extend_schema(
    tags=['Services — Public'],
    summary='List active process steps',
    responses=ProcessStepSerializer(many=True),
)
class PublicProcessStepListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        steps = ProcessStep.objects.filter(is_active=True).order_by('order', 'step_number')
        serializer = ProcessStepSerializer(steps, many=True)
        return api_response(data=serializer.data)


@extend_schema(
    tags=['Services — Public'],
    summary='List active FAQs',
    responses=FAQSerializer(many=True),
)
class PublicFAQListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        faqs = FAQ.objects.filter(is_active=True).order_by('order', 'question')
        serializer = FAQSerializer(faqs, many=True)
        return api_response(data=serializer.data)


# ===========================================================================
# Admin CRUD APIs (Requires ADMIN/SUPER_ADMIN role)
# ===========================================================================

# --- Service Categories ---

@extend_schema(tags=['Services — Admin'])
class AdminCategoryListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def get(self, request):
        categories = ServiceCategory.objects.all().order_by('order', 'name')
        serializer = ServiceCategorySerializer(categories, many=True)
        return api_response(data=serializer.data)

    def post(self, request):
        serializer = ServiceCategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Category created.', status=201)


@extend_schema(tags=['Services — Admin'])
class AdminCategoryDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def get_object(self, slug):
        return get_object_or_404(ServiceCategory, slug=slug)

    def get(self, request, slug):
        return api_response(data=ServiceCategorySerializer(self.get_object(slug)).data)

    def put(self, request, slug):
        serializer = ServiceCategorySerializer(self.get_object(slug), data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Category updated.')

    def patch(self, request, slug):
        serializer = ServiceCategorySerializer(self.get_object(slug), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Category updated.')

    def delete(self, request, slug):
        category = self.get_object(slug)
        category.delete()
        return api_response(message='Category deleted.')


# --- Services ---

@extend_schema(tags=['Services — Admin'])
class AdminServiceListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def get(self, request):
        qs = Service.objects.all().select_related('category').prefetch_related('features', 'industries', 'faqs')
        
        status_filter = request.query_params.get('status')
        if status_filter and status_filter != 'all':
            # Map 'published' to is_active=True and 'draft' to is_active=False
            if status_filter == 'published':
                qs = qs.filter(is_active=True)
            elif status_filter == 'draft':
                qs = qs.filter(is_active=False)
                
        category_filter = request.query_params.get('category')
        if category_filter and category_filter != 'all':
            qs = qs.filter(category__slug=category_filter)
            
        search_query = request.query_params.get('search')
        if search_query:
            from django.db.models import Q
            qs = qs.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(slug__icontains=search_query)
            )

        qs = qs.order_by('order', 'title')
        
        paginator = StandardPagination()
        page = paginator.paginate_queryset(qs, request)
        serializer = ServiceSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = ServiceAdminSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        service = serializer.save()
        # Return full details including category info
        return api_response(data=ServiceSerializer(service, context={'request': request}).data, message='Service created.', status=201)


@extend_schema(tags=['Services — Admin'])
class AdminServiceDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def get_object(self, slug):
        return get_object_or_404(Service, slug=slug)

    def get(self, request, slug):
        return api_response(data=ServiceSerializer(self.get_object(slug), context={'request': request}).data)

    def put(self, request, slug):
        serializer = ServiceAdminSerializer(self.get_object(slug), data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        service = serializer.save()
        return api_response(data=ServiceSerializer(service, context={'request': request}).data, message='Service updated.')

    def patch(self, request, slug):
        serializer = ServiceAdminSerializer(self.get_object(slug), data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        service = serializer.save()
        return api_response(data=ServiceSerializer(service, context={'request': request}).data, message='Service updated.')

    def delete(self, request, slug):
        service = self.get_object(slug)
        service.delete()
        return api_response(message='Service deleted.')


# --- Service Features ---

@extend_schema(tags=['Services — Admin'])
class AdminFeatureListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def get(self, request):
        features = ServiceFeature.objects.all().select_related('service').order_by('order', 'title')
        serializer = ServiceFeatureSerializer(features, many=True)
        return api_response(data=serializer.data)

    def post(self, request):
        serializer = ServiceFeatureSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Feature created.', status=201)


@extend_schema(tags=['Services — Admin'])
class AdminFeatureDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def get_object(self, pk):
        return get_object_or_404(ServiceFeature, id=pk)

    def get(self, request, pk):
        return api_response(data=ServiceFeatureSerializer(self.get_object(pk)).data)

    def put(self, request, pk):
        serializer = ServiceFeatureSerializer(self.get_object(pk), data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Feature updated.')

    def patch(self, request, pk):
        serializer = ServiceFeatureSerializer(self.get_object(pk), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Feature updated.')

    def delete(self, request, pk):
        feature = self.get_object(pk)
        feature.delete()
        return api_response(message='Feature deleted.')


# --- Industries ---

@extend_schema(tags=['Services — Admin'])
class AdminIndustryListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def get(self, request):
        industries = Industry.objects.all().order_by('order', 'name')
        serializer = IndustrySerializer(industries, many=True)
        return api_response(data=serializer.data)

    def post(self, request):
        serializer = IndustrySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Industry created.', status=201)


@extend_schema(tags=['Services — Admin'])
class AdminIndustryDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def get_object(self, slug):
        return get_object_or_404(Industry, slug=slug)

    def get(self, request, slug):
        return api_response(data=IndustrySerializer(self.get_object(slug)).data)

    def put(self, request, slug):
        serializer = IndustrySerializer(self.get_object(slug), data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Industry updated.')

    def patch(self, request, slug):
        serializer = IndustrySerializer(self.get_object(slug), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Industry updated.')

    def delete(self, request, slug):
        industry = self.get_object(slug)
        industry.delete()
        return api_response(message='Industry deleted.')


# --- Process Steps ---

@extend_schema(tags=['Services — Admin'])
class AdminProcessStepListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def get(self, request):
        steps = ProcessStep.objects.all().order_by('order', 'step_number')
        serializer = ProcessStepSerializer(steps, many=True)
        return api_response(data=serializer.data)

    def post(self, request):
        serializer = ProcessStepSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Process step created.', status=201)


@extend_schema(tags=['Services — Admin'])
class AdminProcessStepDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def get_object(self, pk):
        return get_object_or_404(ProcessStep, id=pk)

    def get(self, request, pk):
        return api_response(data=ProcessStepSerializer(self.get_object(pk)).data)

    def put(self, request, pk):
        serializer = ProcessStepSerializer(self.get_object(pk), data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Process step updated.')

    def patch(self, request, pk):
        serializer = ProcessStepSerializer(self.get_object(pk), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Process step updated.')

    def delete(self, request, pk):
        step = self.get_object(pk)
        step.delete()
        return api_response(message='Process step deleted.')


# --- FAQs ---

@extend_schema(tags=['Services — Admin'])
class AdminFAQListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def get(self, request):
        faqs = FAQ.objects.all().order_by('order', 'question')
        serializer = FAQSerializer(faqs, many=True)
        return api_response(data=serializer.data)

    def post(self, request):
        serializer = FAQSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='FAQ created.', status=201)


@extend_schema(tags=['Services — Admin'])
class AdminFAQDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def get_object(self, pk):
        return get_object_or_404(FAQ, id=pk)

    def get(self, request, pk):
        return api_response(data=FAQSerializer(self.get_object(pk)).data)

    def put(self, request, pk):
        serializer = FAQSerializer(self.get_object(pk), data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='FAQ updated.')

    def patch(self, request, pk):
        serializer = FAQSerializer(self.get_object(pk), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='FAQ updated.')

    def delete(self, request, pk):
        faq = self.get_object(pk)
        faq.delete()
        return api_response(message='FAQ deleted.')
