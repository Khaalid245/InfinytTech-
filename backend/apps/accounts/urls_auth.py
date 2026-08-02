from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView, 
    LogoutView, 
    CurrentUserView,
    ForgotPasswordView,
    ResetPasswordConfirmView,
    ChangePasswordView
)

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='auth-login'),
    path('refresh/', TokenRefreshView.as_view(), name='auth-refresh'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('me/', CurrentUserView.as_view(), name='auth-me'),
    
    # Password Reset & Change
    path('forgot-password/', ForgotPasswordView.as_view(), name='auth-forgot-password'),
    path('reset-password-confirm/', ResetPasswordConfirmView.as_view(), name='auth-reset-password-confirm'),
    path('change-password/', ChangePasswordView.as_view(), name='auth-change-password'),
]
