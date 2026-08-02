from rest_framework_simplejwt.authentication import JWTAuthentication
from .services import enforce_session_timeout


class SessionTimeoutJWTAuthentication(JWTAuthentication):
    """Custom JWT Authentication class that verifies token and enforces inactivity timeout."""

    def authenticate(self, request):
        auth_result = super().authenticate(request)
        if auth_result is not None:
            user, token = auth_result
            enforce_session_timeout(user, request=request, is_jwt=True)
            return user, token
        return None
