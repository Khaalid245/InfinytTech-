from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PublicCategoryListView,
    PublicTagListView,
    PublicPostListView,
    PublicPostDetailView,
    AdminCategoryViewSet,
    AdminTagViewSet,
    AdminPostViewSet
)

router = DefaultRouter()
router.register('admin/categories', AdminCategoryViewSet, basename='admin-blog-categories')
router.register('admin/tags', AdminTagViewSet, basename='admin-blog-tags')
router.register('admin/posts', AdminPostViewSet, basename='admin-blog-posts')

urlpatterns = [
    # Public endpoints
    path('categories/', PublicCategoryListView.as_view(), name='public-blog-categories'),
    path('tags/', PublicTagListView.as_view(), name='public-blog-tags'),
    path('posts/', PublicPostListView.as_view(), name='public-blog-posts'),
    path('posts/<slug:slug>/', PublicPostDetailView.as_view(), name='public-blog-post-detail'),
    
    # Admin ViewSet endpoints
    path('', include(router.urls)),
]
