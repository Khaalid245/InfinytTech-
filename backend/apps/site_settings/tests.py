from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from .models import SiteSettings, OfficeLocation, SocialLink

User = get_user_model()


class SiteSettingsModelTest(TestCase):
    def test_singleton_enforcement(self):
        # Create first active site settings
        setting1 = SiteSettings.objects.create(company_name="InfinytTech", is_active=True)
        
        # Creating a second active site settings should fail
        setting2 = SiteSettings(company_name="Other", is_active=True)
        with self.assertRaises(ValidationError):
            setting2.clean()

    def test_allow_multiple_inactive(self):
        setting1 = SiteSettings.objects.create(company_name="InfinytTech", is_active=True)
        setting2 = SiteSettings.objects.create(company_name="Other", is_active=False)
        self.assertEqual(SiteSettings.objects.count(), 2)


class SiteSettingsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.settings = SiteSettings.objects.create(
            company_name="InfinytTech", 
            is_active=True,
            hero_title="Welcome to InfinytTech",
            completed_projects=100
        )
        self.office = OfficeLocation.objects.create(
            site_settings=self.settings,
            city="New York",
            country="USA",
            address="123 Tech Avenue"
        )
        self.social = SocialLink.objects.create(
            site_settings=self.settings,
            platform="github",
            url="https://github.com/infinyttech"
        )

        self.user = User.objects.create_user(email="user@test.com", password="password", first_name="Test", last_name="User", role="developer")
        self.admin = User.objects.create_superuser(email="admin@test.com", password="password", first_name="Admin", last_name="User")

        self.public_url = reverse('public-site-settings')
        self.admin_url = reverse('admin-site-settings-list')

    def test_public_read_only(self):
        response = self.client.get(self.public_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['company_name'], "InfinytTech")
        self.assertEqual(len(response.data['office_locations']), 1)
        self.assertEqual(response.data['office_locations'][0]['city'], "New York")
        self.assertEqual(len(response.data['social_links']), 1)
        self.assertEqual(response.data['social_links'][0]['platform'], "github")

        # Public POST should not exist at this URL
        response_post = self.client.post(self.public_url, {"company_name": "Hack"})
        self.assertEqual(response_post.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_admin_api_requires_auth(self):
        response = self.client.get(self.admin_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_api_requires_admin(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.admin_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_api_crud_access(self):
        self.client.force_authenticate(user=self.admin)
        
        # GET
        response = self.client.get(self.admin_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data.get('results', response.data)), 1)

        # POST (Create new inactive setting)
        new_data = {
            "company_name": "InfinytTech V2",
            "is_active": False
        }
        post_response = self.client.post(self.admin_url, new_data)
        self.assertEqual(post_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SiteSettings.objects.count(), 2)

    def test_public_404_when_no_active(self):
        self.settings.is_active = False
        self.settings.save()

        response = self.client.get(self.public_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
