from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from apps.core.models import UUIDModel, TimeStampedModel


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        
        # Ensure role exists and is valid, fallback to VIEWER if not provided
        if 'role' not in extra_fields:
            extra_fields['role'] = User.Role.VIEWER
            
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.SUPER_ADMIN)
        return self.create_user(email, password, **extra_fields)


class User(UUIDModel, TimeStampedModel, AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        SUPER_ADMIN = 'super_admin', 'Super Admin'
        ADMIN = 'admin', 'Administrator'
        CONTENT_MANAGER = 'content_manager', 'Content Manager'
        SALES = 'sales', 'Sales'
        HR = 'hr', 'HR'
        EDITOR = 'editor', 'Editor'
        VIEWER = 'viewer', 'Viewer'

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.VIEWER
    )
    
    # Extended Enterprise Fields
    department = models.CharField(max_length=100, blank=True, null=True, help_text="e.g. Engineering, Sales, Marketing")
    phone = models.CharField(max_length=30, blank=True, null=True)
    avatar = models.ForeignKey(
        'media_library.MediaFile', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='user_avatars'
    )
    
    failed_login_attempts = models.PositiveIntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)
    last_activity = models.DateTimeField(null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'accounts_users'

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.email


class UserActivity(UUIDModel, TimeStampedModel):
    """
    Tracks logins and administrative actions for security audits and user profiles.
    """
    class ActionType(models.TextChoices):
        LOGIN = 'login', 'Login'
        LOGOUT = 'logout', 'Logout'
        PASSWORD_RESET = 'password_reset', 'Password Reset'
        PROFILE_UPDATE = 'profile_update', 'Profile Update'
        ROLE_CHANGE = 'role_change', 'Role Change'
        STATUS_CHANGE = 'status_change', 'Status Change'
        ACCOUNT_LOCK = 'account_lock', 'Account Lock'
        ACCOUNT_UNLOCK = 'account_unlock', 'Account Unlock'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=50, choices=ActionType.choices)
    description = models.CharField(max_length=255, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    class Meta:
        db_table = 'accounts_user_activities'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.action} at {self.created_at}"
