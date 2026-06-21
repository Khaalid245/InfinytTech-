from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken

from apps.services.models import ServiceCategory, Service, ServiceFeature, Industry, ProcessStep, FAQ

User = get_user_model()


class ServicesCMSTestCase(TestCase):
    def setUp(self):
        # 1. Create test user
        self.email = "testadmin_services@infinyttech.com"
        self.password = "testpassword123"
        self.admin_user = User.objects.create_superuser(
            email=self.email,
            password=self.password
        )

        # Get JWT Token
        token = AccessToken.for_user(self.admin_user)
        self.auth_header = f"Bearer {token}"

        # 2. Create test database entries
        self.category = ServiceCategory.objects.create(
            name="AI & Analytics",
            slug="ai-analytics",
            description="Custom AI & ML systems",
            order=1
        )

        self.service = Service.objects.create(
            category=self.category,
            title="Generative AI Integration",
            slug="generative-ai-integration",
            description="Integrate generative AI models into products",
            icon="cpu",
            order=1
        )

        self.feature = ServiceFeature.objects.create(
            service=self.service,
            title="LLM Fine-tuning",
            description="Fine-tune models on proprietary data",
            order=1
        )

        self.industry = Industry.objects.create(
            name="Healthcare Tech",
            slug="healthcare-tech",
            description="Digital solutions for healthcare",
            icon="activity",
            order=1
        )

        self.process = ProcessStep.objects.create(
            step_number="01",
            short_title="Discovery",
            full_title="Requirement Discovery and Scoping",
            description="Understand your goals and scope the project",
            icon="search",
            duration="1 Week",
            deliverables=["Project roadmap", "Technical specification"],
            outcomes=["Scope alignment", "Architecture outline"],
            order=1
        )

        self.faq = FAQ.objects.create(
            question="How long does integration take?",
            answer_intro="It depends on the complexity.",
            answer_bullets=["Small models: 2-4 weeks", "Complex fine-tuning: 2-3 months"],
            answer_outro="Contact us for a detailed estimate.",
            order=1
        )

        self.client = Client()

    def test_public_endpoints(self):
        public_endpoints = {
            "Categories": "/api/services/categories/",
            "Services": "/api/services/",
            "Industries": "/api/services/industries/",
            "Process": "/api/services/process/",
            "FAQs": "/api/services/faqs/"
        }

        for name, path in public_endpoints.items():
            res = self.client.get(path)
            self.assertEqual(res.status_code, 200, f"Failed public endpoint {name}")
            data = res.json()
            self.assertTrue(data['success'])
            self.assertIn('data', data)

            payload = data['data']
            if name == "Services":
                self.assertIn('results', payload)
                results = payload['results']
                self.assertGreater(len(results), 0)
                self.assertEqual(results[0]['title'], self.service.title)
            else:
                self.assertGreater(len(payload), 0)

    def test_security_anonymous_denied(self):
        admin_get_endpoints = [
            "/api/services/admin/categories/",
            "/api/services/admin/services/",
            "/api/services/admin/features/",
            "/api/services/admin/industries/",
            "/api/services/admin/process/",
            "/api/services/admin/faqs/"
        ]

        for path in admin_get_endpoints:
            res = self.client.get(path)
            self.assertIn(res.status_code, [401, 403], f"Security failure at {path}")

    def test_admin_get_endpoints_authorized(self):
        admin_get_endpoints = [
            "/api/services/admin/categories/",
            "/api/services/admin/services/",
            "/api/services/admin/features/",
            "/api/services/admin/industries/",
            "/api/services/admin/process/",
            "/api/services/admin/faqs/"
        ]

        headers = {"HTTP_AUTHORIZATION": self.auth_header}
        for path in admin_get_endpoints:
            res = self.client.get(path, **headers)
            self.assertEqual(res.status_code, 200, f"Admin GET failed at {path}")

    def test_admin_crud_operations(self):
        headers = {"HTTP_AUTHORIZATION": self.auth_header}

        # Create Category
        res = self.client.post(
            "/api/services/admin/categories/",
            data={"name": "Cybersecurity", "slug": "cybersecurity", "description": "Securing applications"},
            content_type="application/json",
            **headers
        )
        self.assertEqual(res.status_code, 201)

        # Update Category
        res = self.client.put(
            "/api/services/admin/categories/cybersecurity/",
            data={"name": "Cybersecurity & InfoSec", "slug": "cybersecurity", "description": "Enterprise security"},
            content_type="application/json",
            **headers
        )
        self.assertEqual(res.status_code, 200)

        # Delete Category
        res = self.client.delete(
            "/api/services/admin/categories/cybersecurity/",
            **headers
        )
        self.assertEqual(res.status_code, 200)
