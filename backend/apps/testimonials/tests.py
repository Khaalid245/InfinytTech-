from django.test import TestCase, Client as TestClient
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework_simplejwt.tokens import AccessToken

from .models import Client, Testimonial

User = get_user_model()

def _make_admin_headers(user):
    token = AccessToken.for_user(user)
    return {'HTTP_AUTHORIZATION': f'Bearer {token}'}

class TestimonialCMSTestCase(TestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            email='admin_testim@infinyttech.com',
            password='TestPass123!'
        )
        self.dev_user = User.objects.create_user(
            email='dev_testim@infinyttech.com',
            password='TestPass123!',
            role=User.Role.DEVELOPER
        )
        self.admin_headers = _make_admin_headers(self.admin_user)

        self.client_acme = Client.objects.create(
            company_name='Acme Corp',
            industry='Manufacturing',
            country='USA'
        )
        self.client_inactive = Client.objects.create(
            company_name='Old Corp',
            industry='Retail',
            is_active=False
        )
        
        self.testimonial_published = Testimonial.objects.create(
            client=self.client_acme,
            author_name='John Doe',
            author_position='CEO',
            testimonial='Great work!',
            rating=5,
            status=Testimonial.Status.PUBLISHED,
            featured=True,
            display_order=1
        )
        
        self.testimonial_draft = Testimonial.objects.create(
            client=self.client_acme,
            author_name='Jane Smith',
            author_position='CTO',
            testimonial='Still drafting this.',
            rating=4,
            status=Testimonial.Status.DRAFT,
            display_order=2
        )
        
        self.api_client = TestClient()


class ClientModelTest(TestimonialCMSTestCase):
    def test_auto_slug_generation(self):
        client = Client.objects.create(company_name='Stark Industries')
        self.assertEqual(client.slug, 'stark-industries')
        
        client2 = Client.objects.create(company_name='Stark Industries')
        self.assertEqual(client2.slug, 'stark-industries-1')

    def test_str_representation(self):
        self.assertEqual(str(self.client_acme), 'Acme Corp')


class TestimonialModelTest(TestimonialCMSTestCase):
    def test_auto_publish_date(self):
        t = Testimonial.objects.create(
            client=self.client_acme,
            author_name='Alice',
            author_position='Manager',
            testimonial='Good job.'
        )
        self.assertIsNone(t.published_at)
        
        t.status = Testimonial.Status.PUBLISHED
        t.save()
        self.assertIsNotNone(t.published_at)


class PublicAPITest(TestimonialCMSTestCase):
    def test_get_active_clients(self):
        res = self.api_client.get('/api/testimonials/clients/')
        self.assertEqual(res.status_code, 200)
        data = res.json()['data']['results']
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['company_name'], 'Acme Corp')

    def test_get_published_testimonials(self):
        res = self.api_client.get('/api/testimonials/')
        self.assertEqual(res.status_code, 200)
        data = res.json()['data']['results']
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['author_name'], 'John Doe')

    def test_get_featured_testimonials(self):
        res = self.api_client.get('/api/testimonials/featured/')
        self.assertEqual(res.status_code, 200)
        data = res.json()['data']['results'] if 'results' in res.json().get('data', {}) else res.json()['data']
        # Depending on pagination behavior
        results = data.get('results', data) if isinstance(data, dict) else data
        self.assertTrue(len(results) > 0)
        self.assertTrue(all(t['featured'] for t in results))


class AdminAPITest(TestimonialCMSTestCase):
    def test_admin_can_get_all_clients(self):
        res = self.api_client.get('/api/testimonials/admin/clients/', **self.admin_headers)
        self.assertEqual(res.status_code, 200)
        body = res.json()
        data = body.get('data', {})
        results = data.get('results', data) if isinstance(data, dict) else data
        self.assertEqual(len(results), 2)  # Active and inactive

    def test_admin_can_get_all_testimonials(self):
        res = self.api_client.get('/api/testimonials/admin/', **self.admin_headers)
        self.assertEqual(res.status_code, 200)
        body = res.json()
        data = body.get('data', {})
        results = data.get('results', data) if isinstance(data, dict) else data
        self.assertEqual(len(results), 2)  # Published and draft

    def test_create_duplicate_testimonial_rejected(self):
        # John Doe for Acme Corp already exists
        payload = {
            'client': str(self.client_acme.id),
            'author_name': 'John Doe',
            'author_position': 'CEO',
            'testimonial': 'Another quote',
            'rating': 5
        }
        res = self.api_client.post(
            '/api/testimonials/admin/', 
            data=payload, 
            content_type='application/json',
            **self.admin_headers
        )
        self.assertEqual(res.status_code, 400)
        response_body = res.json()
        self.assertTrue(
            'non_field_errors' in response_body or 'non_field_errors' in response_body.get('errors', {}),
            f'Expected validation error: {response_body}'
        )

    def test_invalid_rating_rejected(self):
        payload = {
            'client': str(self.client_acme.id),
            'author_name': 'Bob',
            'author_position': 'VP',
            'testimonial': 'Not good',
            'rating': 6  # Invalid
        }
        res = self.api_client.post(
            '/api/testimonials/admin/', 
            data=payload, 
            content_type='application/json',
            **self.admin_headers
        )
        self.assertEqual(res.status_code, 400)

class PermissionsTest(TestimonialCMSTestCase):
    def test_anonymous_cannot_access_admin(self):
        res = self.api_client.get('/api/testimonials/admin/')
        self.assertEqual(res.status_code, 401)
        
    def test_developer_cannot_access_admin(self):
        headers = _make_admin_headers(self.dev_user)
        res = self.api_client.get('/api/testimonials/admin/', **headers)
        self.assertEqual(res.status_code, 403)
