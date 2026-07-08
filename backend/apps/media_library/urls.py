from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MediaFolderViewSet, MediaTagViewSet, MediaFileViewSet

router = DefaultRouter()
router.register('folders', MediaFolderViewSet, basename='media-folders')
router.register('tags', MediaTagViewSet, basename='media-tags')
router.register('', MediaFileViewSet, basename='media-files')

urlpatterns = [
    path('', include(router.urls)),
]
