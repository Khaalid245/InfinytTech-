from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PublicDepartmentListView,
    PublicTeamMemberListView,
    PublicTeamMemberDetailView,
    AdminDepartmentViewSet,
    AdminTeamMemberViewSet,
)

router = DefaultRouter()
router.register('admin/departments', AdminDepartmentViewSet, basename='admin-team-departments')
router.register('admin/members', AdminTeamMemberViewSet, basename='admin-team-members')

urlpatterns = [
    # Public endpoints
    path('departments/', PublicDepartmentListView.as_view(), name='public-team-departments'),
    path('', PublicTeamMemberListView.as_view(), name='public-team-members'),
    path('<slug:slug>/', PublicTeamMemberDetailView.as_view(), name='public-team-member-detail'),

    # Admin ViewSet endpoints
    path('', include(router.urls)),
]
