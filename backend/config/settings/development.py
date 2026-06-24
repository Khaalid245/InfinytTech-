from .base import *

DEBUG = True

# Allow all origins in development to prevent local port binding conflicts (e.g. 5173 vs 5174)
CORS_ALLOW_ALL_ORIGINS = True
CORS_ORIGIN_ALLOW_ALL = True
