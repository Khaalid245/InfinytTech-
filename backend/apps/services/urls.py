from django.urls import path
from .views import (
    # Public
    PublicCategoryListView,
    PublicServiceListView,
    PublicIndustryListView,
    PublicProcessStepListView,
    PublicFAQListView,
    # Admin Categories
    AdminCategoryListCreateView,
    AdminCategoryDetailView,
    # Admin Services
    AdminServiceListCreateView,
    AdminServiceDetailView,
    # Admin Features
    AdminFeatureListCreateView,
    AdminFeatureDetailView,
    # Admin Industries
    AdminIndustryListCreateView,
    AdminIndustryDetailView,
    # Admin ProcessSteps
    AdminProcessStepListCreateView,
    AdminProcessStepDetailView,
    # Admin FAQs
    AdminFAQListCreateView,
    AdminFAQDetailView,
)

urlpatterns = [
    # ------------------------------------------------------------------
    # Public endpoints (read-only, is_active=True only)
    # ------------------------------------------------------------------
    path('categories/', PublicCategoryListView.as_view(), name='public-service-category-list'),
    path('', PublicServiceListView.as_view(), name='public-service-list'),
    path('industries/', PublicIndustryListView.as_view(), name='public-industry-list'),
    path('process/', PublicProcessStepListView.as_view(), name='public-process-step-list'),
    path('faqs/', PublicFAQListView.as_view(), name='public-faq-list'),

    # ------------------------------------------------------------------
    # Admin CRUD endpoints (Requires ADMIN / SUPER_ADMIN role)
    # ------------------------------------------------------------------

    # Categories
    path('admin/categories/', AdminCategoryListCreateView.as_view(), name='admin-service-category-list'),
    path('admin/categories/<slug:slug>/', AdminCategoryDetailView.as_view(), name='admin-service-category-detail'),

    # Services
    path('admin/services/', AdminServiceListCreateView.as_view(), name='admin-service-list'),
    path('admin/services/<slug:slug>/', AdminServiceDetailView.as_view(), name='admin-service-detail'),

    # Features
    path('admin/features/', AdminFeatureListCreateView.as_view(), name='admin-service-feature-list'),
    path('admin/features/<uuid:pk>/', AdminFeatureDetailView.as_view(), name='admin-service-feature-detail'),

    # Industries
    path('admin/industries/', AdminIndustryListCreateView.as_view(), name='admin-industry-list'),
    path('admin/industries/<slug:slug>/', AdminIndustryDetailView.as_view(), name='admin-industry-detail'),

    # Process Steps
    path('admin/process/', AdminProcessStepListCreateView.as_view(), name='admin-process-step-list'),
    path('admin/process/<uuid:pk>/', AdminProcessStepDetailView.as_view(), name='admin-process-step-detail'),

    # FAQs
    path('admin/faqs/', AdminFAQListCreateView.as_view(), name='admin-faq-list'),
    path('admin/faqs/<uuid:pk>/', AdminFAQDetailView.as_view(), name='admin-faq-detail'),
]
