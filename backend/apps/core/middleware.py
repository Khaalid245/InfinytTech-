class SecurityHeadersMiddleware:
    """
    Middleware that adds security headers not natively handled by Django's
    built-in SecurityMiddleware, such as Permissions-Policy and Content-Security-Policy.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Permissions-Policy
        # Disable access to geolocation, microphone, and camera
        response['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'

        # Content-Security-Policy (CSP)
        # Tuned to allow Django Admin and Swagger UI (drf-spectacular) functionality
        # which require some inline scripts and styles.
        csp_directives = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data: https:",
            "connect-src 'self' *"
        ]
        response['Content-Security-Policy'] = "; ".join(csp_directives)

        return response
