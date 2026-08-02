from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers import (
    LoginSerializer,
    UserSerializer,
    UserListSerializer,
    CreateUserSerializer,
    UpdateUserSerializer,
    UserActivitySerializer
)
from .permissions import IsAdminOrSuperAdmin
from .models import UserActivity
from apps.core.pagination import StandardPagination
from apps.core.response import api_response
from apps.team.views import ApiResponseMixin
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from .throttling import LoginRateThrottle

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    """JWT login endpoint with per-IP rate limiting."""
    serializer_class = LoginSerializer
    # Override global throttles: only the strict login throttle applies here.
    # Anonymous callers are identified by IP.
    throttle_classes = [LoginRateThrottle]
    permission_classes = [AllowAny]


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            # Clear last_activity timestamp on logout
            if request.user and request.user.is_authenticated:
                request.user.last_activity = None
                request.user.save(update_fields=['last_activity'])

            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            try:
                token.blacklist()
            except Exception:
                # blacklist app might not be installed in INSTALLED_APPS
                pass
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'PUT']:
            # Create a dynamic serializer to only allow first_name, last_name
            class CurrentUserUpdateSerializer(UserSerializer):
                class Meta(UserSerializer.Meta):
                    read_only_fields = ('id', 'email', 'role', 'is_active', 'is_staff', 'is_superuser', 'created_at', 'updated_at')
            return CurrentUserUpdateSerializer
        return UserSerializer


class UserAdminViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    """
    Enterprise user management endpoints.
    """
    permission_classes = (IsAuthenticated, IsAdminOrSuperAdmin)
    pagination_class = StandardPagination
    queryset = User.objects.all().order_by('-created_at')
    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name', 'last_name', 'email', 'department', 'role']

    def get_serializer_class(self):
        if self.action == 'list':
            return UserListSerializer
        if self.action == 'create':
            return CreateUserSerializer
        if self.action in ['update', 'partial_update']:
            return UpdateUserSerializer
        return UserSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        role = self.request.query_params.get('role')
        department = self.request.query_params.get('department')
        status = self.request.query_params.get('status')
        
        if role:
            qs = qs.filter(role=role)
        if department:
            qs = qs.filter(department__icontains=department)
        if status:
            is_active = status.lower() == 'active'
            qs = qs.filter(is_active=is_active)
            
        return qs

    def perform_destroy(self, instance):
        if self.request.user.id == instance.id:
            from rest_framework.exceptions import ValidationError
            raise ValidationError("You cannot delete your own account.")
            
        if instance.role == User.Role.SUPER_ADMIN:
            # Check if this is the last super admin
            super_admin_count = User.objects.filter(role=User.Role.SUPER_ADMIN, is_active=True).count()
            if super_admin_count <= 1:
                from rest_framework.exceptions import ValidationError
                raise ValidationError("Cannot delete the last remaining Super Admin.")
                
        # Log deletion (though the user will be gone, this is just for safety)
        super().perform_destroy(instance)

    @action(detail=True, methods=['post'])
    def reset_password(self, request, pk=None):
        user = self.get_object()
        new_password = request.data.get('password')
        if not new_password:
            from rest_framework.exceptions import ValidationError
            raise ValidationError("Password is required.")
        
        from django.contrib.auth.password_validation import validate_password
        from django.core.exceptions import ValidationError as DjangoValidationError
        from rest_framework.exceptions import ValidationError as DRFValidationError
        
        try:
            validate_password(new_password, user)
        except DjangoValidationError as e:
            raise DRFValidationError({'password': list(e.messages)})
        
        user.set_password(new_password)
        user.save()
        
        UserActivity.objects.create(
            user=user,
            action=UserActivity.ActionType.PASSWORD_RESET,
            description="Password reset by administrator.",
            ip_address=request.META.get('REMOTE_ADDR')
        )
        return api_response(message="Password reset successfully.")

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        user = self.get_object()
        
        if self.request.user.id == user.id:
            from rest_framework.exceptions import ValidationError
            raise ValidationError("You cannot deactivate your own account.")
            
        if user.role == User.Role.SUPER_ADMIN and user.is_active:
            super_admin_count = User.objects.filter(role=User.Role.SUPER_ADMIN, is_active=True).count()
            if super_admin_count <= 1:
                from rest_framework.exceptions import ValidationError
                raise ValidationError("Cannot deactivate the last remaining Super Admin.")
                
        user.is_active = not user.is_active
        user.save()
        
        UserActivity.objects.create(
            user=user,
            action=UserActivity.ActionType.STATUS_CHANGE,
            description=f"Status changed to {'Active' if user.is_active else 'Inactive'} by administrator.",
            ip_address=request.META.get('REMOTE_ADDR')
        )
        return api_response(data={"is_active": user.is_active}, message="User status updated successfully.")

    @action(detail=True, methods=['post'])
    def unlock(self, request, pk=None):
        user = self.get_object()
        user.failed_login_attempts = 0
        user.locked_until = None
        user.save()

        UserActivity.objects.create(
            user=user,
            action=UserActivity.ActionType.ACCOUNT_UNLOCK,
            description="Administrator unlocked account.",
            ip_address=request.META.get('REMOTE_ADDR')
        )
        return api_response(message="User account unlocked successfully.")

    @action(detail=True, methods=['get'])
    def activity(self, request, pk=None):
        user = self.get_object()
        activities = user.activities.all()[:50]
        serializer = UserActivitySerializer(activities, many=True)
        return api_response(data=serializer.data)
