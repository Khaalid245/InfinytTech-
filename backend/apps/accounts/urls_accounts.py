from django.urls import path
from .views import UserListCreateView, UserRetrieveUpdateDestroyView

urlpatterns = [
    path('users/', UserListCreateView.as_view(), name='users-list-create'),
    path('users/<uuid:pk>/', UserRetrieveUpdateDestroyView.as_view(), name='users-detail'),
]
