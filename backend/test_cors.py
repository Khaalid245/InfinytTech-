import os
import sys
import django
import urllib.request
from urllib.error import HTTPError

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.site_settings.models import SiteSettings

def check_origin(origin):
    req = urllib.request.Request(
        'http://127.0.0.1:8000/api/dashboard/', 
        headers={'Origin': origin},
        method='OPTIONS'
    )
    try:
        resp = urllib.request.urlopen(req)
        headers = dict(resp.headers)
    except HTTPError as e:
        headers = dict(e.headers)
        
    return headers.get('Access-Control-Allow-Origin'), headers.get('Access-Control-Allow-Credentials')

print("--- Testing CORS Implementation ---")

# Ensure test settings
settings = SiteSettings.objects.filter(is_active=True).first()
if not settings:
    settings = SiteSettings.objects.create(is_active=True, allowed_origins="")

print("\n[Scenario] Development Origin (http://localhost:5173)")
allow_origin, allow_cred = check_origin('http://localhost:5173')
print(f"Origin returned: {allow_origin}")
print(f"Credentials returned: {allow_cred}")

print("\n[Scenario] Unknown Origin (https://evil.com)")
allow_origin, allow_cred = check_origin('https://evil.com')
print(f"Origin returned: {allow_origin}")
print(f"Credentials returned: {allow_cred}")

print("\n[Scenario] Update Site Settings (Add https://app.infinyt.tech, https://dashboard.infinyt.tech)")
settings.allowed_origins = "https://app.infinyt.tech, https://dashboard.infinyt.tech"
settings.save() # Saves and clears cache

allow_origin, allow_cred = check_origin('https://app.infinyt.tech')
print(f"Origin returned for app.infinyt.tech: {allow_origin}")

allow_origin, allow_cred = check_origin('https://dashboard.infinyt.tech')
print(f"Origin returned for dashboard.infinyt.tech: {allow_origin}")

print("\n[Scenario] Remove Origin (Remove dashboard.infinyt.tech)")
settings.allowed_origins = "https://app.infinyt.tech"
settings.save()

allow_origin, allow_cred = check_origin('https://dashboard.infinyt.tech')
print(f"Origin returned for dashboard.infinyt.tech after removal: {allow_origin}")

