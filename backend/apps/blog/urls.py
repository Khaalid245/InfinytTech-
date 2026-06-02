from django.urls import path
from .views import PostListView, PostDetailView, PostAdminListView, CategoryListView

urlpatterns = [
    path('posts/', PostListView.as_view(), name='post-list'),
    path('posts/<slug:slug>/', PostDetailView.as_view(), name='post-detail'),
    path('admin/posts/', PostAdminListView.as_view(), name='post-admin-list'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
]
