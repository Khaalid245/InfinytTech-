from pathlib import Path
from datetime import timedelta
import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR points to backend/
BASE_DIR = Path(__file__).resolve().parent.parent.parent

env = environ.Env(
    DEBUG=(bool, False)
)
environ.Env.read_env(BASE_DIR / '.env')

SECRET_KEY = env('SECRET_KEY')
DEBUG = env('DEBUG')
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[])

DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    'drf_spectacular',
]

LOCAL_APPS = [
    'apps.core',
    'apps.accounts',
    'apps.services',
    'apps.portfolio',
    'apps.leads',
    'apps.blog',
    'apps.media_library',
    'apps.team',
    'apps.testimonials',
    'apps.site_settings',
    'apps.dashboard',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'apps.accounts.middleware.SessionTimeoutMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'apps.core.middleware.SecurityHeadersMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('DB_NAME', default='infinyttech_db'),
        'USER': env('DB_USER', default='root'),
        'PASSWORD': env('DB_PASSWORD', default=''),
        'HOST': env('DB_HOST', default='localhost'),
        'PORT': env('DB_PORT', default='3306'),
        'OPTIONS': {'charset': 'utf8mb4'},
    }
}

AUTH_USER_MODEL = 'accounts.User'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
    {'NAME': 'apps.accounts.validators.SitePasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'static'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ---------------------------------------------------------------------------
# Security Settings
# ---------------------------------------------------------------------------
# X-Content-Type-Options
SECURE_CONTENT_TYPE_NOSNIFF = True
# Referrer-Policy
SECURE_REFERRER_POLICY = 'same-origin'
# X-Frame-Options
X_FRAME_OPTIONS = 'DENY'

# ---------------------------------------------------------------------------
# Cache — used by DRF rate-limiting throttle counters.
# LocMemCache is process-local (fine for single-process dev/staging).
# Replace with a Redis/Memcached backend for multi-process production.
# ---------------------------------------------------------------------------
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'infinyttech-throttle',
    }
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'apps.accounts.authentication.SessionTimeoutJWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    # -----------------------------------------------------------------------
    # Rate limiting — reads limits from SiteSettings at request time so
    # changes take effect immediately without a server restart.
    # LoginRateThrottle is applied directly on the login view.
    # -----------------------------------------------------------------------
    'DEFAULT_THROTTLE_CLASSES': [
        'apps.accounts.throttling.ApiUserRateThrottle',
        'apps.accounts.throttling.ApiAnonRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        # Placeholder strings — actual rates are computed dynamically from
        # SiteSettings in each throttle class, so these are never used.
        'login':    '10/min',
        'api_user': '300/min',
        'api_anon': '60/min',
    },
    # Custom exception handler: formats 429 with Retry-After + JSON body.
    'EXCEPTION_HANDLER': 'apps.core.exceptions.custom_exception_handler',
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'InfinytTech API',
    'DESCRIPTION': 'Backend API for InfinytTech digital services platform',
    'VERSION': '1.0.0',
}

from corsheaders.defaults import default_headers

CORS_ALLOW_HEADERS = list(default_headers) + [
    'cache-control',
    'pragma',
    'expires',
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = False


AUTHENTICATION_BACKENDS = [
    'apps.accounts.backends.SecurityModelBackend',
]
