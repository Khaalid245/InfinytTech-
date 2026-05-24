from django.urls import path
from .views import InquiryCreateView, InquiryAdminListView, InquiryAdminDetailView

urlpatterns = [
    path('inquiries/', InquiryCreateView.as_view(), name='inquiry-create'),
    path('admin/inquiries/', InquiryAdminListView.as_view(), name='inquiry-admin-list'),
    path('admin/inquiries/<int:pk>/', InquiryAdminDetailView.as_view(), name='inquiry-admin-detail'),
]
