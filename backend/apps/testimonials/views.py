from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from apps.accounts.permissions import IsAdminOrSuperAdmin
from apps.core.pagination import StandardPagination
from apps.team.views import ApiResponseMixin  # Reuse the standardized response wrapper

from .models import Client, Testimonial
from .serializers import (
    ClientSerializer,
    TestimonialSerializer,
    AdminClientSerializer,
    AdminTestimonialSerializer
)


# ===========================================================================
# Public API ViewSets
# ===========================================================================

class PublicClientViewSet(ApiResponseMixin, viewsets.ReadOnlyModelViewSet):
    """
    Public API for active Clients (trusted logos).
    """
    queryset = Client.objects.filter(is_active=True).order_by('company_name')
    serializer_class = ClientSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardPagination
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['industry', 'country']
    search_fields = ['company_name', 'industry']


class PublicTestimonialViewSet(ApiResponseMixin, viewsets.ReadOnlyModelViewSet):
    """
    Public API for published Testimonials.
    """
    queryset = Testimonial.objects.filter(
        status=Testimonial.Status.PUBLISHED
    ).select_related('client', 'project', 'author_photo', 'client__company_logo')
    
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardPagination
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['rating', 'featured', 'client__industry']
    search_fields = ['author_name', 'testimonial', 'client__company_name']
    ordering_fields = ['display_order', 'published_at', 'rating']
    ordering = ['display_order', '-published_at']

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Returns only featured published testimonials."""
        queryset = self.filter_queryset(self.get_queryset().filter(featured=True))
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })


# ===========================================================================
# Admin CRUD ViewSets
# ===========================================================================

class AdminClientViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    """
    Admin API for complete Client management.
    """
    queryset = Client.objects.all().order_by('-created_at')
    serializer_class = AdminClientSerializer
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]
    pagination_class = StandardPagination
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active', 'industry', 'country']
    search_fields = ['company_name', 'slug', 'website']


class AdminTestimonialViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    """
    Admin API for complete Testimonial management.
    """
    queryset = Testimonial.objects.all().order_by('-created_at')
    serializer_class = AdminTestimonialSerializer
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]
    pagination_class = StandardPagination
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'featured', 'rating']
    search_fields = ['author_name', 'client__company_name', 'testimonial']
    ordering_fields = ['created_at', 'published_at', 'display_order', 'rating']
