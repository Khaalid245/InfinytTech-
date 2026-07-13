from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.media_library.serializers import MediaFileSerializer
from .models import UserActivity

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    avatar_details = MediaFileSerializer(source='avatar', read_only=True)
    full_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = User
        fields = (
            'id', 'email', 'first_name', 'last_name', 'full_name', 'role', 
            'department', 'phone', 'avatar', 'avatar_details',
            'is_active', 'is_staff', 'is_superuser', 'last_login', 
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'last_login', 'avatar_details', 'full_name')

class UserListSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    full_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = User
        fields = (
            'id', 'email', 'first_name', 'last_name', 'full_name', 'role', 
            'department', 'is_active', 'last_login', 'created_at', 'avatar_url'
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
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user, context=self.context).data
        return data


class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = ('id', 'action', 'description', 'ip_address', 'user_agent', 'created_at')
        read_only_fields = fields
