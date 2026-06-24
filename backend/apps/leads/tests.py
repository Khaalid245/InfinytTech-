from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.core.cache import cache
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
