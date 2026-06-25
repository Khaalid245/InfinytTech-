from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from apps.accounts.models import User


class AuthTests(TestCase):
    def setUp(self):
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

