from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APIClient
from apps.accounts.models import User
from apps.site_settings.models import SiteSettings
from apps.site_settings.services import clear_site_settings_cache


class AuthTests(TestCase):
    def setUp(self):
        from django.core.cache import cache
        cache.clear()
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )

    def test_login_success(self):
        res = self.client.post(reverse('auth-login'), {
            'email': 'test@example.com',
            'password': 'testpass123'
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn('access', res.data)

    def test_login_invalid_credentials(self):
        res = self.client.post(reverse('auth-login'), {
            'email': 'test@example.com',
            'password': 'wrongpass'
        })
        self.assertEqual(res.status_code, 401)

    def test_me_requires_auth(self):
        res = self.client.get(reverse('auth-me'))
        self.assertEqual(res.status_code, 401)

    def test_me_returns_user(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.get(reverse('auth-me'))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['email'], self.user.email)


class AccountLockoutTests(TestCase):
    def setUp(self):
        from django.core.cache import cache
        cache.clear()
        self.client = APIClient()
        # Clean up any existing SiteSettings to avoid singleton violation
        SiteSettings.objects.all().delete()
        clear_site_settings_cache()
        
        self.settings = SiteSettings.objects.create(
            is_active=True,
            company_name='TestCorp',
            max_login_attempts=3,
            lockout_duration=5
        )
        clear_site_settings_cache()
        
        self.user = User.objects.create_user(
            email='locked@example.com',
            password='Password123!',
            first_name='Lock',
            last_name='User'
        )

    def test_failed_login_increments_attempts(self):
        res = self.client.post(reverse('auth-login'), {
            'email': 'locked@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(res.status_code, 401)
        self.user.refresh_from_db()
        self.assertEqual(self.user.failed_login_attempts, 1)
        self.assertIsNone(self.user.locked_until)

    def test_lockout_triggered_at_limit(self):
        # 3 attempts configured as max
        for i in range(2):
            res = self.client.post(reverse('auth-login'), {
                'email': 'locked@example.com',
                'password': 'wrongpassword'
            })
            self.assertEqual(res.status_code, 401)
            
        # 3rd attempt should trigger the lockout
        res = self.client.post(reverse('auth-login'), {
            'email': 'locked@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(res.status_code, 403)
        self.assertIn("temporarily locked", res.data.get('message', str(res.data)))
        
        self.user.refresh_from_db()
        self.assertEqual(self.user.failed_login_attempts, 3)
        self.assertIsNotNone(self.user.locked_until)

    def test_locked_user_denied_immediately(self):
        # Manually lock the user
        self.user.failed_login_attempts = 3
        self.user.locked_until = timezone.now() + timedelta(minutes=5)
        self.user.save()
        
        # Even with correct password, login should be blocked with 403
        res = self.client.post(reverse('auth-login'), {
            'email': 'locked@example.com',
            'password': 'Password123!'
        })
        self.assertEqual(res.status_code, 403)
        self.assertIn("temporarily locked", res.data.get('message', str(res.data)))

    def test_successful_login_resets_attempts(self):
        # 2 failed logins
        for i in range(2):
            self.client.post(reverse('auth-login'), {
                'email': 'locked@example.com',
                'password': 'wrongpassword'
            })
        
        self.user.refresh_from_db()
        self.assertEqual(self.user.failed_login_attempts, 2)
        
        # Successful login
        res = self.client.post(reverse('auth-login'), {
            'email': 'locked@example.com',
            'password': 'Password123!'
        })
        self.assertEqual(res.status_code, 200)
        
        self.user.refresh_from_db()
        self.assertEqual(self.user.failed_login_attempts, 0)
        self.assertIsNone(self.user.locked_until)

    def test_lockout_expires_automatically(self):
        # Lock user with an expired timestamp
        self.user.failed_login_attempts = 3
        self.user.locked_until = timezone.now() - timedelta(minutes=1)
        self.user.save()
        
        # Logging in with correct password should succeed, resetting attributes
        res = self.client.post(reverse('auth-login'), {
            'email': 'locked@example.com',
            'password': 'Password123!'
        })
        self.assertEqual(res.status_code, 200)
        
        self.user.refresh_from_db()
        self.assertEqual(self.user.failed_login_attempts, 0)
        self.assertIsNone(self.user.locked_until)

    def test_dynamic_settings_modification(self):
        # Change limit to 2 attempts dynamically
        self.settings.max_login_attempts = 2
        self.settings.save()
        clear_site_settings_cache()
        
        # 1st failed attempt
        res = self.client.post(reverse('auth-login'), {
            'email': 'locked@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(res.status_code, 401)
        
        # 2nd failed attempt should trigger lockout immediately
        res = self.client.post(reverse('auth-login'), {
            'email': 'locked@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(res.status_code, 403)
        self.assertIn("temporarily locked", res.data.get('message', str(res.data)))


class SessionTimeoutTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        SiteSettings.objects.all().delete()
        clear_site_settings_cache()

        self.settings = SiteSettings.objects.create(
            is_active=True,
            company_name='TestCorp',
            session_timeout=5  # 5 minutes inactivity timeout
        )
        clear_site_settings_cache()

        self.user = User.objects.create_user(
            email='session@example.com',
            password='Password123!',
            first_name='Session',
            last_name='User'
        )
        
        from django.core.cache import cache
        cache.clear()

        # Authenticate via JWT token to perform requests
        res = self.client.post(reverse('auth-login'), {
            'email': 'session@example.com',
            'password': 'Password123!'
        })
        self.assertEqual(res.status_code, 200)
        self.access_token = res.data['access']
        self.refresh_token = res.data['refresh']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

    def test_active_session_updates_last_activity(self):
        # Initial activity should be set/updated on request
        res = self.client.get(reverse('auth-me'))
        self.assertEqual(res.status_code, 200)
        
        self.user.refresh_from_db()
        self.assertIsNotNone(self.user.last_activity)
        first_activity = self.user.last_activity
        
        # Perform request after 65 seconds to bypass 60-second database update throttle
        self.user.last_activity = timezone.now() - timedelta(seconds=65)
        self.user.save()
        
        res = self.client.get(reverse('auth-me'))
        self.assertEqual(res.status_code, 200)
        
        self.user.refresh_from_db()
        self.assertNotEqual(self.user.last_activity, first_activity)
        self.assertTrue(self.user.last_activity > first_activity)

    def test_expired_session_fails(self):
        # Manually set last activity to 6 minutes ago (exceeding 5 min timeout)
        self.user.last_activity = timezone.now() - timedelta(minutes=6)
        self.user.save()
        
        res = self.client.get(reverse('auth-me'))
        self.assertEqual(res.status_code, 401)
        self.assertIn("expired", res.data.get('message', str(res.data)))

    def test_session_timeout_dynamic_change(self):
        # Change session timeout to 10 minutes dynamically
        self.settings.session_timeout = 10
        self.settings.save()
        clear_site_settings_cache()
        
        # Set last activity to 6 minutes ago
        self.user.last_activity = timezone.now() - timedelta(minutes=6)
        self.user.save()
        
        # Under 10 minutes limit, this request should succeed
        res = self.client.get(reverse('auth-me'))
        self.assertEqual(res.status_code, 200)
        
        # Change session timeout to 2 minutes dynamically
        self.settings.session_timeout = 2
        self.settings.save()
        clear_site_settings_cache()
        
        # Reset last activity to 6 minutes ago because the previous request updated it
        self.user.last_activity = timezone.now() - timedelta(minutes=6)
        self.user.save()
        
        # With 6 minutes ago last activity, it should now fail immediately
        res = self.client.get(reverse('auth-me'))
        self.assertEqual(res.status_code, 401)
        self.assertIn("expired", res.data.get('message', str(res.data)))
        self.assertIn("expired", res.data.get('message', str(res.data)))

    def test_logout_clears_last_activity(self):
        # Log out using refresh token
        res = self.client.post(reverse('auth-logout'), {
            'refresh': self.refresh_token
        })
        self.assertEqual(res.status_code, 205)
        
        self.user.refresh_from_db()
        self.assertIsNone(self.user.last_activity)


class PasswordPolicyErrorHandlingTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        SiteSettings.objects.all().delete()
        clear_site_settings_cache()
        
        # Enforce STRICT policy (at least 12 chars, upper, lower, digits, special)
        self.settings = SiteSettings.objects.create(
            is_active=True,
            company_name='TestCorp',
            password_policy='strict'
        )
        clear_site_settings_cache()
        
        # Create an admin user to make API requests to user admin viewset
        self.admin = User.objects.create_superuser(
            email='admin@example.com',
            password='AdminPassword123!',
            first_name='Admin',
            last_name='User'
        )
        self.client.force_authenticate(user=self.admin)
        
        # Create a test target user
        self.target_user = User.objects.create_user(
            email='target@example.com',
            password='InitialPassword123!',
            first_name='Target',
            last_name='User'
        )

    def test_create_user_with_invalid_password_returns_400(self):
        # Create user with a weak password ('weak') that violates STRICT
        res = self.client.post(reverse('users-list'), {
            'email': 'newuser@example.com',
            'first_name': 'New',
            'last_name': 'User',
            'role': 'viewer',
            'password': 'weak'
        })
        self.assertEqual(res.status_code, 400)
        errors = res.data.get('errors', res.data)
        self.assertIn('password', errors)
        self.assertTrue(len(errors['password']) > 0)

    def test_update_user_with_invalid_password_returns_400(self):
        # Update user with a weak password ('weak') that violates STRICT
        res = self.client.patch(reverse('users-detail', kwargs={'pk': self.target_user.pk}), {
            'password': 'weak'
        })
        self.assertEqual(res.status_code, 400)
        errors = res.data.get('errors', res.data)
        self.assertIn('password', errors)
        self.assertTrue(len(errors['password']) > 0)

    def test_reset_password_with_invalid_password_returns_400(self):
        # Reset password with a weak password ('weak') that violates STRICT
        res = self.client.post(reverse('users-reset-password', kwargs={'pk': self.target_user.pk}), {
            'password': 'weak'
        })
        self.assertEqual(res.status_code, 400)
        errors = res.data.get('errors', res.data)
        self.assertIn('password', errors)
        self.assertTrue(len(errors['password']) > 0)


class LoginResetsSessionTest(TestCase):
    """
    Regression test for: Login succeeds but first authenticated request returns 401.

    Root cause: SessionTimeoutJWTAuthentication runs enforce_session_timeout on every
    request.  If a user's last_activity is stale from a previous expired session,
    the elapsed time exceeds the timeout and AuthenticationFailed is raised —
    immediately after a successful login — before the user can do anything.

    The fix: LoginSerializer.validate() must reset last_activity = now() on every
    successful login so the inactivity clock always starts fresh.
    """

    def setUp(self):
        self.client = APIClient()
        SiteSettings.objects.all().delete()
        self.settings = SiteSettings.objects.create(
            session_timeout=60,
            max_login_attempts=5,
            lockout_duration=10,
        )
        clear_site_settings_cache()
        self.user = User.objects.create_user(
            email='regtest@example.com',
            password='ValidPass@12345!',
            first_name='Reg',
            last_name='Test',
            role='super_admin',
        )

    def test_login_resets_last_activity(self):
        """After login, last_activity must be set to now, not left stale."""
        self.user.last_activity = timezone.now() - timedelta(hours=5)
        self.user.save(update_fields=['last_activity'])

        res = self.client.post(reverse('auth-login'), {
            'email': 'regtest@example.com',
            'password': 'ValidPass@12345!',
        })
        self.assertEqual(res.status_code, 200, 'Login must succeed')

        self.user.refresh_from_db()
        self.assertIsNotNone(self.user.last_activity)
        elapsed = (timezone.now() - self.user.last_activity).total_seconds()
        self.assertLess(elapsed, 10, 'last_activity must be within 10 s of login')

    def test_first_authenticated_request_succeeds_after_stale_session(self):
        """First API call after login must return 200 even with stale last_activity."""
        self.user.last_activity = timezone.now() - timedelta(hours=10)
        self.user.save(update_fields=['last_activity'])

        login_res = self.client.post(reverse('auth-login'), {
            'email': 'regtest@example.com',
            'password': 'ValidPass@12345!',
        })
        self.assertEqual(login_res.status_code, 200)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {login_res.data["access"]}')
        me_res = self.client.get(reverse('auth-me'))
        self.assertEqual(
            me_res.status_code, 200,
            'First authenticated request after login must return 200, not 401. '
            'If this fails, LoginSerializer is not resetting last_activity on login.'
        )

    def test_none_last_activity_does_not_cause_401(self):
        """A fresh user (last_activity=None) must log in and call API successfully."""
        self.user.last_activity = None
        self.user.save(update_fields=['last_activity'])

        login_res = self.client.post(reverse('auth-login'), {
            'email': 'regtest@example.com',
            'password': 'ValidPass@12345!',
        })
        self.assertEqual(login_res.status_code, 200)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {login_res.data["access"]}')
        me_res = self.client.get(reverse('auth-me'))
        self.assertEqual(me_res.status_code, 200)


class RateLimitingTests(TestCase):
    """
    Tests for Phase 20.7.4 — API Rate Limiting.

    DRF throttling uses Django's cache backend.  We flush the cache before
    each test so counter state from previous tests does not bleed through.
    """

    def setUp(self):
        from django.core.cache import cache
        cache.clear()

        self.client = APIClient()
        SiteSettings.objects.all().delete()
        self.settings = SiteSettings.objects.create(
            rate_limiting_enabled=True,
            login_rate_limit=3,   # very low limit for test speed
            api_rate_limit=300,
            session_timeout=1440,
            max_login_attempts=10,
            lockout_duration=1,
        )
        clear_site_settings_cache()

        self.user = User.objects.create_user(
            email='ratelimit@example.com',
            password='ValidPass@12345!',
            first_name='Rate',
            last_name='Limit',
            role='super_admin',
        )

    def tearDown(self):
        from django.core.cache import cache
        cache.clear()

    # ------------------------------------------------------------------
    # Login endpoint throttle
    # ------------------------------------------------------------------

    def test_login_throttle_blocks_after_limit(self):
        """After login_rate_limit attempts, further requests must return 429."""
        url = reverse('auth-login')
        payload = {'email': 'ratelimit@example.com', 'password': 'wrong-password'}

        # Exhaust the limit (3 attempts configured)
        for _ in range(self.settings.login_rate_limit):
            self.client.post(url, payload)

        # The next request must be blocked
        res = self.client.post(url, payload)
        self.assertEqual(
            res.status_code, 429,
            'Login endpoint must return 429 after the configured limit is exceeded.'
        )

    def test_login_throttle_429_response_body(self):
        """The 429 response must contain retry information in its JSON body."""
        url = reverse('auth-login')
        payload = {'email': 'ratelimit@example.com', 'password': 'wrong-password'}

        for _ in range(self.settings.login_rate_limit + 1):
            res = self.client.post(url, payload)

        if res.status_code == 429:
            self.assertIn('Retry-After', res.headers,
                          'Retry-After header must be present on 429 responses')
            body = res.json()
            # Our custom exception handler wraps the response
            self.assertIn('message', body)

    def test_login_throttle_disabled_when_rate_limiting_off(self):
        """When rate_limiting_enabled=False the login endpoint must not throttle."""
        from django.core.cache import cache
        cache.clear()

        self.settings.rate_limiting_enabled = False
        self.settings.save()
        clear_site_settings_cache()

        url = reverse('auth-login')
        payload = {'email': 'ratelimit@example.com', 'password': 'wrong-password'}

        # Make more requests than the configured limit — none should return 429
        for i in range(self.settings.login_rate_limit + 5):
            res = self.client.post(url, payload)
            self.assertNotEqual(
                res.status_code, 429,
                f'Request {i + 1} returned 429 but rate limiting is disabled.'
            )

    # ------------------------------------------------------------------
    # Authenticated API throttle
    # ------------------------------------------------------------------

    def test_successful_login_succeeds_within_limit(self):
        """Normal login within limit must always return 200."""
        res = self.client.post(reverse('auth-login'), {
            'email': 'ratelimit@example.com',
            'password': 'ValidPass@12345!',
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn('access', res.data)
