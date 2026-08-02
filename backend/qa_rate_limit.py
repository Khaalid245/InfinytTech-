import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
django.setup()

# Verify the SiteSettings now has all rate limiting fields
from apps.site_settings.services import get_active_site_settings, clear_site_settings_cache
clear_site_settings_cache()
s = get_active_site_settings()
print('=== SiteSettings Rate Limiting Configuration ===')
print(f'rate_limiting_enabled : {s.rate_limiting_enabled}')
print(f'login_rate_limit      : {s.login_rate_limit} requests/min/IP')
print(f'api_rate_limit        : {s.api_rate_limit} requests/min/user')
print()

# Verify throttle classes load correctly
from apps.accounts.throttling import LoginRateThrottle, ApiUserRateThrottle, ApiAnonRateThrottle
lt = LoginRateThrottle()
lt.scope = 'login'
rate = lt.get_rate()
print(f'LoginRateThrottle.get_rate()     -> {repr(rate)}')
ut = ApiUserRateThrottle()
rate2 = ut.get_rate()
print(f'ApiUserRateThrottle.get_rate()   -> {repr(rate2)}')
at = ApiAnonRateThrottle()
rate3 = at.get_rate()
print(f'ApiAnonRateThrottle.get_rate()   -> {repr(rate3)}')
print()

# Verify 429 JSON format
from apps.core.exceptions import custom_exception_handler
from rest_framework.exceptions import Throttled

class FakeExc(Throttled):
    def __init__(self): 
        self.wait = 45.7
        self.detail = 'Request limit exceeded.'

exc = FakeExc()

result = custom_exception_handler(exc, {})
if result:
    print('=== HTTP 429 Response ===')
    print(f'Status : {result.status_code}')
    print(f'Headers: Retry-After={result.get("Retry-After")}, X-RateLimit-Reset={result.get("X-RateLimit-Reset")}')
    import json
    print(f'Body   : {json.dumps(dict(result.data), indent=2)}')
