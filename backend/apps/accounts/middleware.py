from django.core.exceptions import PermissionDenied
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.utils.deprecation import MiddlewareMixin
from .services import enforce_session_timeout


class SessionTimeoutMiddleware(MiddlewareMixin):
    """Middleware for session-based request routes (like Django Admin)

    that logs the user out and redirects them to login upon timeout.
    """

    def process_request(self, request):
        if request.user and request.user.is_authenticated:
            try:
                enforce_session_timeout(request.user, request=request, is_jwt=False)
            except PermissionDenied:
                # If they are on an admin page, redirect them to the admin login page
                if request.path.startswith("/admin/"):
                    return HttpResponseRedirect(reverse("admin:login"))
                # Let it raise for non-admin pages (which might handle it as 403 Forbidden)
                raise
        return None
