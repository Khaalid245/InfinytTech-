import urllib.request

headers_to_check = [
    'Content-Security-Policy',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Permissions-Policy',
    'Strict-Transport-Security',
    'X-XSS-Protection',
    'Cache-Control',
    'Cross-Origin-Opener-Policy',
    'Server',
]

req = urllib.request.Request('http://localhost:8000/api/site-settings/')
res = urllib.request.urlopen(req)

print('=== HTTP SECURITY HEADERS ===')
for h in headers_to_check:
    val = res.headers.get(h)
    tag = 'PRESENT' if val else 'MISSING'
    print('[' + tag + '] ' + h + ': ' + str(val if val else '-'))

# Also check rate limiting headers
print()
print('=== RATE LIMITING ===')
for h in ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'Retry-After']:
    val = res.headers.get(h)
    print('[' + ('PRESENT' if val else 'MISSING') + '] ' + h)

print()
print('=== ALL RESPONSE HEADERS ===')
for k, v in res.headers.items():
    print(k + ': ' + v)
