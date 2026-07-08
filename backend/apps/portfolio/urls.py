from django.urls import path
from .views import (
    # Public
    PublicProjectListView,
    PublicProjectDetailView,
    PublicCategoryListView,
    PublicTechnologyListView,
    PublicTagListView,
    # Admin — Projects
    AdminProjectListCreateView,
    AdminProjectDetailView,
    AdminProjectImageCreateView,
    AdminProjectImageDetailView,
    AdminProjectMetricCreateView,
    AdminProjectMetricDeleteView,
    # Admin — Categories
    AdminCategoryListCreateView,
    AdminCategoryDetailView,
    # Admin — Technologies
    AdminTechnologyListCreateView,
    AdminTechnologyDetailView,
    # Admin — Tags
    AdminTagListCreateView,
    AdminTagDetailView,
)

urlpatterns = [
    # ------------------------------------------------------------------
    # Public endpoints (read-only, PUBLISHED projects only)
    # ------------------------------------------------------------------
    path('projects/', PublicProjectListView.as_view(), name='public-project-list'),
    path('projects/<slug:slug>/', PublicProjectDetailView.as_view(), name='public-project-detail'),
    path('project-categories/', PublicCategoryListView.as_view(), name='public-category-list'),
    path('technologies/', PublicTechnologyListView.as_view(), name='public-technology-list'),
    path('tags/', PublicTagListView.as_view(), name='public-tag-list'),

    # ------------------------------------------------------------------
    # Admin endpoints (ADMIN / SUPER_ADMIN only)
    # ------------------------------------------------------------------

    # Projects
    path('admin/projects/', AdminProjectListCreateView.as_view(), name='admin-project-list'),
    path('admin/projects/<slug:slug>/', AdminProjectDetailView.as_view(), name='admin-project-detail'),
    path('admin/projects/<slug:slug>/images/', AdminProjectImageCreateView.as_view(), name='admin-project-image-create'),
    path('admin/projects/<slug:slug>/images/<uuid:pk>/', AdminProjectImageDetailView.as_view(), name='admin-project-image-detail'),
    path('admin/projects/<slug:slug>/metrics/', AdminProjectMetricCreateView.as_view(), name='admin-project-metric-create'),
    path('admin/projects/<slug:slug>/metrics/<uuid:pk>/', AdminProjectMetricDeleteView.as_view(), name='admin-project-metric-delete'),

    # Categories
    path('admin/categories/', AdminCategoryListCreateView.as_view(), name='admin-category-list'),
    path('admin/categories/<slug:slug>/', AdminCategoryDetailView.as_view(), name='admin-category-detail'),

    # Technologies
    path('admin/technologies/', AdminTechnologyListCreateView.as_view(), name='admin-technology-list'),
    path('admin/technologies/<slug:slug>/', AdminTechnologyDetailView.as_view(), name='admin-technology-detail'),

    # Tags
    path('admin/tags/', AdminTagListCreateView.as_view(), name='admin-tag-list'),
    path('admin/tags/<slug:slug>/', AdminTagDetailView.as_view(), name='admin-tag-detail'),
]
