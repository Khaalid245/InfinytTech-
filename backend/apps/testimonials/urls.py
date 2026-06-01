from django.urls import path
from .views import TestimonialListView, TestimonialDetailView

urlpatterns = [
    path('', TestimonialListView.as_view(), name='testimonial-list'),
    path('<int:pk>/', TestimonialDetailView.as_view(), name='testimonial-detail'),
]
