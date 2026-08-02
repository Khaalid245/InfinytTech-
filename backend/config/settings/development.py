from .base import *

DEBUG = True

# Allow specific origins for development to prevent local port binding conflicts
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]

# ---------------------------------------------------------------------------
# Disable rate limiting in development.
# The throttle classes in base.py are active in production; locally they just
# get in the way when rapidly refreshing pages or hammering the admin panel.
# ---------------------------------------------------------------------------
REST_FRAMEWORK = {
    **REST_FRAMEWORK,
    'DEFAULT_THROTTLE_CLASSES': [],
    'DEFAULT_THROTTLE_RATES': {},
}
