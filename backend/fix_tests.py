import re

path = r'c:\Users\Khalid\InfinytTech-\backend\apps\accounts\tests.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add cache.clear() to AccountLockoutTests setUp (after 'self.client = APIClient()')
content = content.replace(
    'class AccountLockoutTests(TestCase):\n    def setUp(self):\n        self.client = APIClient()\n        # Clean up any existing SiteSettings',
    'class AccountLockoutTests(TestCase):\n    def setUp(self):\n        from django.core.cache import cache\n        cache.clear()\n        self.client = APIClient()\n        # Clean up any existing SiteSettings',
    1
)

# 2. Fix res.data['detail'] -> res.data.get('message', str(res.data))
content = content.replace("res.data['detail']", "res.data.get('message', str(res.data))")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Replacements done')
