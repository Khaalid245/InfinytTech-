from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.media_library.serializers import MediaFileSerializer
from .models import UserActivity

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    avatar_details = MediaFileSerializer(source='avatar', read_only=True)
    full_name = serializers.CharField(read_only=True)
    max_login_attempts = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = (
            'id', 'email', 'first_name', 'last_name', 'full_name', 'role', 
            'department', 'phone', 'avatar', 'avatar_details',
            'is_active', 'is_staff', 'is_superuser', 'last_login', 
            'created_at', 'updated_at', 'failed_login_attempts', 'locked_until',
            'max_login_attempts'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'last_login', 'avatar_details', 'full_name', 'max_login_attempts')

    def get_max_login_attempts(self, obj):
        from apps.site_settings.services import get_active_site_settings
        settings = get_active_site_settings()
        return settings.max_login_attempts if settings else 3

class UserListSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    full_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = User
        fields = (
            'id', 'email', 'first_name', 'last_name', 'full_name', 'role', 
            'department', 'is_active', 'last_login', 'created_at', 'avatar_url',
            'failed_login_attempts', 'locked_until'
        )

    def get_avatar_url(self, obj):
        if obj.avatar and obj.avatar.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.file.url)
            return obj.avatar.file.url
        return None

class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'department', 'phone', 'avatar', 'password', 'is_active', 'is_staff', 'is_superuser')

    def validate_password(self, value):
        from django.core.exceptions import ValidationError as DjangoValidationError
        from django.contrib.auth.password_validation import validate_password
        email = self.initial_data.get('email')
        user = User(email=email) if email else None
        try:
            validate_password(value, user)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UpdateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'department', 'phone', 'avatar', 'password', 'is_active', 'is_staff', 'is_superuser')
        read_only_fields = ('id', 'email') # generally email shouldn't be updated or requires special flow

    def validate_password(self, value):
        from django.core.exceptions import ValidationError as DjangoValidationError
        from django.contrib.auth.password_validation import validate_password
        user = self.instance
        try:
            validate_password(value, user)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get(self.username_field)
        if username:
            try:
                user = User.objects.get(**{self.username_field: username})
                from django.utils import timezone
                if user.locked_until and user.locked_until > timezone.now():
                    from rest_framework.exceptions import PermissionDenied
                    raise PermissionDenied(
                        "Your account has been temporarily locked due to multiple failed login attempts. Please try again later."
                    )
            except User.DoesNotExist:
                pass

        try:
            data = super().validate(attrs)
        except Exception as e:
            if username:
                try:
                    user = User.objects.get(**{self.username_field: username})
                    from django.utils import timezone
                    if user.locked_until and user.locked_until > timezone.now():
                        from rest_framework.exceptions import PermissionDenied
                        raise PermissionDenied(
                            "Your account has been temporarily locked due to multiple failed login attempts. Please try again later."
                        )
                except User.DoesNotExist:
                    pass
            raise e

        # -----------------------------------------------------------------------
        # CRITICAL: Reset last_activity to NOW on every successful login.
        #
        # Without this, if a user's previous session expired (last_activity is
        # stale in the DB), SessionTimeoutJWTAuthentication will immediately
        # reject the first post-login request with 401 — even though login
        # itself just succeeded.  The token refresh that follows also fails for
        # the same reason (last_activity is still stale), causing an immediate
        # logout loop.
        #
        # The correct behaviour is: a fresh login always starts a new inactivity
        # window.  last_activity is set here so the very first authenticated
        # API request passes the session-timeout check.
        # -----------------------------------------------------------------------
        from django.utils import timezone as tz
        self.user.last_activity = tz.now()
        self.user.save(update_fields=['last_activity'])

        data['user'] = UserSerializer(self.user, context=self.context).data
        return data



class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = ('id', 'action', 'description', 'ip_address', 'user_agent', 'created_at')
        read_only_fields = fields
