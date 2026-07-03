import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.accounts.models import User
from apps.portfolio.models import Project
from apps.leads.models import Lead

class DashboardAPITests(APITestCase):
    def setUp(self):
        self.dashboard_url = reverse('dashboard:dashboard-overview')
        
        # Create normal user
        self.user = User.objects.create_user(
            email='user@example.com',
            password='password123',
            first_name='Normal',
            last_name='User',
            role=User.Role.CONTENT_MANAGER
        )
        
        # Create admin user
        self.admin = User.objects.create_superuser(
            email='admin@example.com',
            password='password123',
            first_name='Admin',
            last_name='User'
        )

    def test_dashboard_requires_authentication(self):
        """Test that unauthenticated users cannot access the dashboard"""
        response = self.client.get(self.dashboard_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_dashboard_requires_admin(self):
        """Test that non-admin users cannot access the dashboard"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.dashboard_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_dashboard_access_for_admin(self):
        """Test that admin users can access the dashboard and it returns correct structure"""
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.dashboard_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        
        # Check main keys
        self.assertIn('overview', data)
        self.assertIn('recent_activity', data)
        self.assertIn('lead_analytics', data)
        self.assertIn('content_health', data)
        self.assertIn('media_health', data)
        self.assertIn('system_health', data)
        
        # Check specific system health
        self.assertEqual(data['system_health']['database_connection'], 'Healthy')
        self.assertEqual(data['system_health']['application_version'], '1.0.0')

    def test_dashboard_data_aggregation(self):
        """Test that adding models correctly reflects in the dashboard data"""
        # Add a lead
        Lead.objects.create(
            first_name='Test',
            last_name='Lead',
            email='lead@example.com',
            message='Test message',
            status=Lead.StatusChoices.NEW
        )
        
        # Add a project
        Project.objects.create(
            title='Test Project',
            slug='test-project',
            short_description='Test',
            full_description='Test',
            status=Project.Status.PUBLISHED
        )

        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.dashboard_url)
        data = response.json()
        
        # Verify counts
        self.assertEqual(data['overview']['leads']['total_leads'], 1)
        self.assertEqual(data['overview']['leads']['new'], 1)
        
        self.assertEqual(data['overview']['portfolio']['total_projects'], 1)
        self.assertEqual(data['overview']['portfolio']['published'], 1)
        
        # Verify recent activity
        self.assertEqual(len(data['recent_activity']['recent_leads']), 1)
        self.assertEqual(data['recent_activity']['recent_leads'][0]['first_name'], 'Test')
        
        self.assertEqual(len(data['recent_activity']['recent_projects']), 1)
        self.assertEqual(data['recent_activity']['recent_projects'][0]['title'], 'Test Project')
        
        # Content health missing featured image
        self.assertEqual(data['content_health']['projects_without_image'], 1)
