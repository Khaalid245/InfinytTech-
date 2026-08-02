from .base import *

DEBUG = False

CORS_ALLOW_ALL_ORIGINS = False
# In production, allowed origins are managed dynamically via SiteSettings (django-cors-headers signal)
CORS_ALLOWED_ORIGINS = []

# ---------------------------------------------------------------------------
# Production Security Headers
# ---------------------------------------------------------------------------
# HTTP Strict-Transport-Security (HSTS)
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Secure Cookies
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# SSL Redirect (optional, often handled by load balancers, but good for app-level enforcement)
SECURE_SSL_REDIRECT = True

