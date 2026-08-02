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

    def perform_create(self, serializer):
        # Save user
        user = serializer.save()
        
        # Determine the login URL
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        login_url = f"{frontend_url}/login"
        
        # Send Welcome Email
        result = EmailService.send_template_email(
            subject="Welcome to InfinytTech Platform",
            template_name="emails/welcome.html",
            recipient_list=[user.email],
            context={
                "user": user,
                "login_url": login_url,
            }
        )
        if not result.success:
            logger.warning(f"Failed to send welcome email to {user.email}: {result.error}")

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
        
        # Send Password Changed Email
        result = EmailService.send_template_email(
            subject="Security Notification: Password Changed by Admin",
            template_name="emails/password_changed.html",
            recipient_list=[user.email],
            context={"user": user}
        )
        if not result.success:
            logger.warning(f"Failed to send password changed email to {user.email}: {result.error}")
            
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
        
        # Send Account Unlocked Email
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        login_url = f"{frontend_url}/login"
        
        result = EmailService.send_template_email(
            subject="Account Unlocked",
            template_name="emails/account_unlocked.html",
            recipient_list=[user.email],
            context={
                "user": user,
                "login_url": login_url,
            }
        )
        if not result.success:
            logger.warning(f"Failed to send account unlocked email to {user.email}: {result.error}")
            
        return api_response(message="User account unlocked successfully.")

    @action(detail=True, methods=['get'])
    def activity(self, request, pk=None):
        user = self.get_object()
        activities = user.activities.all()[:50]
        serializer = UserActivitySerializer(activities, many=True)
        return api_response(data=serializer.data)


# ---------------------------------------------------------------------------
# Self-Service Password Endpoints
# ---------------------------------------------------------------------------

from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from apps.core.services import EmailService
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class ForgotPasswordView(APIView):
    """
    POST /api/auth/forgot-password/
    Generates a secure password reset link and sends an email.
    Always returns success to prevent email enumeration.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return api_response(message="Email is required.", success=False, status_code=400)
            
        user = User.objects.filter(email=email).first()
        if user and user.is_active:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            
            # The frontend URL should handle the reset form
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
            reset_url = f"{frontend_url}/auth/reset-password?uid={uid}&token={token}"
            
            # Send Email (non-blocking)
            result = EmailService.send_template_email(
                subject="Password Reset Request",
                template_name="emails/password_reset.html",
                recipient_list=[user.email],
                context={
                    "user": user,
                    "reset_url": reset_url,
                    "expiration_time": "24 hours",
                }
            )
            if not result.success:
                logger.warning(f"Failed to send password reset email to {user.email}: {result.error}")
                
            UserActivity.objects.create(
                user=user,
                action=UserActivity.ActionType.PASSWORD_RESET,
                description="User requested a password reset link.",
                ip_address=request.META.get('REMOTE_ADDR')
            )

        # Always return success to prevent user enumeration
        return api_response(message="If an account exists with that email, a reset link has been sent.")


class ResetPasswordConfirmView(APIView):
    """
    POST /api/auth/reset-password-confirm/
    Validates token and changes the password.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('password')
        
        if not all([uidb64, token, new_password]):
            return api_response(message="UID, token, and new password are required.", success=False, status_code=400)
            
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
            
        if user is not None and default_token_generator.check_token(user, token):
            from django.contrib.auth.password_validation import validate_password
            from django.core.exceptions import ValidationError as DjangoValidationError
            
            try:
                validate_password(new_password, user)
            except DjangoValidationError as e:
                return api_response(data={'password': list(e.messages)}, message="Password validation failed.", success=False, status_code=400)
                
            user.set_password(new_password)
            user.save()
            
            UserActivity.objects.create(
                user=user,
                action=UserActivity.ActionType.PASSWORD_RESET,
                description="User successfully reset their password via email link.",
                ip_address=request.META.get('REMOTE_ADDR')
            )
            
            # Send confirmation email
            result = EmailService.send_template_email(
                subject="Password Changed Successfully",
                template_name="emails/password_changed.html",
                recipient_list=[user.email],
                context={"user": user}
            )
            if not result.success:
                logger.warning(f"Failed to send password changed email to {user.email}: {result.error}")
                
            return api_response(message="Password has been reset successfully.")
        else:
            return api_response(message="The reset link is invalid or has expired.", success=False, status_code=400)


class ChangePasswordView(APIView):
    """
    POST /api/auth/change-password/
    Allows logged-in users to change their password by providing the old password.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not old_password or not new_password:
            return api_response(message="Both old and new passwords are required.", success=False, status_code=400)
            
        if not user.check_password(old_password):
            return api_response(message="Incorrect old password.", success=False, status_code=400)
            
        from django.contrib.auth.password_validation import validate_password
        from django.core.exceptions import ValidationError as DjangoValidationError
        
        try:
            validate_password(new_password, user)
        except DjangoValidationError as e:
            return api_response(data={'password': list(e.messages)}, message="Password validation failed.", success=False, status_code=400)
            
        user.set_password(new_password)
        user.save()
        
        UserActivity.objects.create(
            user=user,
            action=UserActivity.ActionType.PASSWORD_RESET,
            description="User changed their password from profile settings.",
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        # Send security notification
        result = EmailService.send_template_email(
            subject="Security Notification: Password Changed",
            template_name="emails/password_changed.html",
            recipient_list=[user.email],
            context={"user": user}
        )
        if not result.success:
            logger.warning(f"Failed to send password changed email to {user.email}: {result.error}")
            
        return api_response(message="Password changed successfully.")
