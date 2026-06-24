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
    UpdateUserSerializer
)
from .permissions import IsAdminOrSuperAdmin

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = LoginSerializer


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
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


class UserListCreateView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdminOrSuperAdmin)
    queryset = User.objects.all().order_by('-created_at')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateUserSerializer
        return UserListSerializer


class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAdminOrSuperAdmin)
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'PUT']:
            return UpdateUserSerializer
        return UserSerializer
