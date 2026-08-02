from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.core.cache import cache
from unittest.mock import patch
from rest_framework_simplejwt.tokens import AccessToken
from apps.leads.models import Lead

User = get_user_model()


class LeadsCRMTestCase(TestCase):
    def setUp(self):
        # Clear cache to reset throttle rates for each test
        cache.clear()

        # 1. Create admin user and token
        self.email = "admin_leads@infinyttech.com"
        self.password = "testpassword123"
        self.admin_user = User.objects.create_superuser(
            email=self.email,
            password=self.password
        )
        token = AccessToken.for_user(self.admin_user)
        self.auth_header = f"Bearer {token}"

        # 2. Create normal user (explicitly non-admin role)
        self.user_email = "user_leads@infinyttech.com"
        self.normal_user = User.objects.create_user(
            email=self.user_email,
            password=self.password,
            role=User.Role.DEVELOPER
        )

        # 3. Create dummy Lead
        self.lead = Lead.objects.create(
            first_name="Jane",
            last_name="Doe",
            email="jane.doe@example.com",
            phone="1234567890",
            company="Acme Corp",
            country="Somalia",
            project_type="Mobile App",
            budget_range="$10k - $25k",
            message="Hello, I need an app.",
            source="Showcase",
            status=Lead.StatusChoices.NEW
        )

        self.client = Client()

    def test_public_contact_submission(self):
        # Successful submission
        payload = {
            "first_name": "John",
            "last_name": "Smith",
            "email": "john.smith@example.com",
            "phone": "0987654321",
            "company": "Beta Inc",
            "country": "Kenya",
            "project_type": "Web Portal",
            "budget_range": "$25k - $50k",
            "message": "Please contact me for building our portal.",
            "source": "Google"
        }
        res = self.client.post(
            "/api/leads/contact/",
            data=payload,
            content_type="application/json"
        )
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['data']['first_name'], "John")
        
        # Verify it created a Lead in the DB
        self.assertTrue(Lead.objects.filter(email="john.smith@example.com").exists())

    def test_public_contact_submission_validation(self):
        # Missing required email
        payload = {
            "first_name": "John",
            "last_name": "Smith",
            "message": "No email here."
        }
        res = self.client.post(
            "/api/leads/contact/",
            data=payload,
            content_type="application/json"
        )
        self.assertEqual(res.status_code, 400)

    def test_security_anonymous_denied_admin(self):
        # Anonymous GET denied
        res = self.client.get("/api/leads/")
        self.assertIn(res.status_code, [401, 403])

        # Anonymous Retrieve denied
        res = self.client.get(f"/api/leads/{self.lead.id}/")
        self.assertIn(res.status_code, [401, 403])

    def test_normal_user_denied_admin(self):
        # Authenticated but non-admin user
        token = AccessToken.for_user(self.normal_user)
        auth_header = f"Bearer {token}"
        headers = {"HTTP_AUTHORIZATION": auth_header}

        res = self.client.get("/api/leads/", **headers)
        self.assertEqual(res.status_code, 403)

    def test_admin_leads_list_retrieve(self):
        headers = {"HTTP_AUTHORIZATION": self.auth_header}

        # Admin GET all leads
        res = self.client.get("/api/leads/", **headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreater(len(data), 0)

        # Admin GET single lead
        res = self.client.get(f"/api/leads/{self.lead.id}/", **headers)
        self.assertEqual(res.status_code, 200)
        lead_data = res.json()
        self.assertEqual(lead_data['first_name'], "Jane")

    def test_admin_leads_patch_update(self):
        headers = {"HTTP_AUTHORIZATION": self.auth_header}

        # Change status and assign to user
        payload = {
            "status": Lead.StatusChoices.CONTACTED,
            "assigned_to": str(self.admin_user.id),
            "notes": "Spoke to Jane on the phone today."
        }
        res = self.client.patch(
            f"/api/leads/{self.lead.id}/",
            data=payload,
            content_type="application/json",
            **headers
        )
        self.assertEqual(res.status_code, 200)
        
        # Verify DB updates
        self.lead.refresh_from_db()
        self.assertEqual(self.lead.status, Lead.StatusChoices.CONTACTED)
        self.assertEqual(self.lead.assigned_to, self.admin_user)
        self.assertEqual(self.lead.notes, "Spoke to Jane on the phone today.")

    def test_admin_leads_delete(self):
        headers = {"HTTP_AUTHORIZATION": self.auth_header}

        # Admin delete lead
        res = self.client.delete(f"/api/leads/{self.lead.id}/", **headers)
        self.assertEqual(res.status_code, 204)

        # Verify it no longer exists
        self.assertFalse(Lead.objects.filter(id=self.lead.id).exists())

    def test_public_contact_submission_throttling(self):
        # Throttling is configured for 10/hour, so the 11th request should return 429.
        payload = {
            "first_name": "Spam",
            "last_name": "Bot",
            "email": "spam@example.com",
            "message": "Spam contact request"
        }
        # Send 10 successful requests
        for i in range(10):
            res = self.client.post(
                "/api/leads/contact/",
                data=payload,
                content_type="application/json"
            )
            self.assertEqual(res.status_code, 201)

        # 11th request should return 429 Too Many Requests
        res = self.client.post(
            "/api/leads/contact/",
            data=payload,
            content_type="application/json"
        )
        self.assertEqual(res.status_code, 429)


class LeadEmailIntegrationTests(TestCase):
    """
    Phase 21.5 — Contact & Lead Email Integration Tests.
    All SMTP calls are patched; we only verify dispatch logic and graceful failure handling.
    """

    def setUp(self):
        from django.core.cache import cache
        from apps.site_settings.models import SiteSettings
        from apps.site_settings.services import clear_site_settings_cache
        from rest_framework.test import APIClient

        cache.clear()
        self.client = APIClient()
        SiteSettings.objects.all().delete()
        clear_site_settings_cache()

        self.site = SiteSettings.objects.create(
            company_name='TestCorp',
            is_active=True,
            sales_email='sales@testcorp.com',
            primary_email='info@testcorp.com',
            support_email='support@testcorp.com',
            phone='+1234567890',
        )
        clear_site_settings_cache()

    LEAD_PAYLOAD = {
        'first_name': 'Alice',
        'last_name': 'Smith',
        'email': 'alice@example.com',
        'message': 'I need help with a web project.',
        'phone': '+447700000000',
        'company': 'AliceCo',
        'country': 'UK',
        'project_type': 'Web App',
        'budget_range': '$10k–$25k',
    }

    @patch('apps.leads.views.EmailService.send_template_email')
    def test_customer_confirmation_email_is_sent(self, mock_send):
        """Submitting a lead dispatches a confirmation email to the visitor."""
        mock_send.return_value.success = True

        res = self.client.post('/api/leads/contact/', self.LEAD_PAYLOAD, format='json')
        self.assertEqual(res.status_code, 201)

        calls = [c for c in mock_send.call_args_list if c[1]['template_name'] == 'emails/contact_confirmation.html']
        self.assertEqual(len(calls), 1)
        self.assertEqual(calls[0][1]['recipient_list'], ['alice@example.com'])

    @patch('apps.leads.views.EmailService.send_template_email')
    def test_internal_notification_sent_to_sales_email(self, mock_send):
        """Internal notification goes to sales_email when configured."""
        mock_send.return_value.success = True

        res = self.client.post('/api/leads/contact/', self.LEAD_PAYLOAD, format='json')
        self.assertEqual(res.status_code, 201)

        calls = [c for c in mock_send.call_args_list if c[1]['template_name'] == 'emails/contact_notification.html']
        self.assertEqual(len(calls), 1)
        self.assertEqual(calls[0][1]['recipient_list'], ['sales@testcorp.com'])

    @patch('apps.leads.views.EmailService.send_template_email')
    def test_internal_notification_fallback_to_primary_email(self, mock_send):
        """Internal notification falls back to primary_email when sales_email is blank."""
        from apps.site_settings.services import clear_site_settings_cache
        self.site.sales_email = ''
        self.site.save()
        clear_site_settings_cache()

        mock_send.return_value.success = True
        res = self.client.post('/api/leads/contact/', self.LEAD_PAYLOAD, format='json')
        self.assertEqual(res.status_code, 201)

        notification_calls = [c for c in mock_send.call_args_list if c[1]['template_name'] == 'emails/contact_notification.html']
        self.assertEqual(notification_calls[0][1]['recipient_list'], ['info@testcorp.com'])

    @patch('apps.leads.views.EmailService.send_template_email')
    def test_lead_created_even_if_email_fails(self, mock_send):
        """Email delivery failure must never prevent lead creation."""
        mock_send.side_effect = Exception('SMTP server is down')

        res = self.client.post('/api/leads/contact/', self.LEAD_PAYLOAD, format='json')
        # Lead must still be created (201), email failure is swallowed
        self.assertEqual(res.status_code, 201)

        from apps.leads.models import Lead
        self.assertTrue(Lead.objects.filter(email='alice@example.com').exists())

    @patch('apps.leads.views.EmailService.send_template_email')
    def test_both_emails_dispatched_on_submission(self, mock_send):
        """Exactly 2 send_template_email calls are made: one for visitor, one for internal."""
        mock_send.return_value.success = True

        res = self.client.post('/api/leads/contact/', self.LEAD_PAYLOAD, format='json')
        self.assertEqual(res.status_code, 201)
        self.assertEqual(mock_send.call_count, 2)

    @patch('apps.leads.views.EmailService.send_template_email')
    def test_notification_context_contains_lead_data(self, mock_send):
        """Internal notification context must include the lead object."""
        mock_send.return_value.success = True

        self.client.post('/api/leads/contact/', self.LEAD_PAYLOAD, format='json')

        notification_call = next(
            (c for c in mock_send.call_args_list if c[1]['template_name'] == 'emails/contact_notification.html'),
            None
        )
        self.assertIsNotNone(notification_call)
        context = notification_call[1]['context']
        self.assertIn('lead', context)
        self.assertIn('submitted_at', context)
        self.assertIn('admin_lead_url', context)

