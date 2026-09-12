from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework_simplejwt.tokens import AccessToken

from .models import ProjectCategory, Technology, ProjectTag, Project, ProjectImage, ProjectMetric

User = get_user_model()


class PortfolioCMSTestCase(TestCase):
    """
    Phase 22.3 — Portfolio CMS Test Suite.
    Covers:
      - Public API: published project listing, filters (category, technology, tag, featured),
        search, detail by slug, category/technology/tag lists.
      - Draft isolation: non-published projects hidden from public view.
      - Admin API: create, update, delete, list all statuses.
      - Security: anonymous (401) and viewer (403) access restrictions.
    """

    def setUp(self):
        cache.clear()
        self.client = Client()

        # 1. Create Admin User & Auth Header
        self.admin_user = User.objects.create_superuser(
            email="admin_portfolio@infinyttech.com",
            password="testpassword123"
        )
        token = AccessToken.for_user(self.admin_user)
        self.admin_auth_header = f"Bearer {token}"

        # 2. Create Unprivileged Viewer User & Auth Header
        self.viewer_user = User.objects.create_user(
            email="viewer_portfolio@infinyttech.com",
            password="testpassword123",
            role=User.Role.VIEWER
        )
        token_viewer = AccessToken.for_user(self.viewer_user)
        self.viewer_auth_header = f"Bearer {token_viewer}"

        # 3. Create Taxonomies
        self.category_web = ProjectCategory.objects.create(
            name="Web Applications",
            slug="web-applications",
            description="Web platforms and portals",
            is_active=True
        )
        self.category_ai = ProjectCategory.objects.create(
            name="AI Solutions",
            slug="ai-solutions",
            description="Machine learning systems",
            is_active=True
        )
        self.tech_react = Technology.objects.create(
            name="React",
            slug="react",
            icon_name="react",
            is_active=True
        )
        self.tech_django = Technology.objects.create(
            name="Django",
            slug="django",
            icon_name="django",
            is_active=True
        )
        self.tag_fintech = ProjectTag.objects.create(
            name="FinTech",
            slug="fintech",
            description="Financial technology",
            is_active=True
        )

        # 4. Create Projects across lifecycle statuses
        self.published_project = Project.objects.create(
            title="Enterprise Banking Portal",
            slug="enterprise-banking-portal",
            short_description="Core banking infrastructure overhaul",
            full_description="Complete microservices re-architecture for a top-tier bank.",
            client_name="Global Bank Corp",
            status=Project.Status.PUBLISHED,
            is_featured=True,
            category=self.category_web,
        )
        self.published_project.technologies.add(self.tech_react, self.tech_django)
        self.published_project.tags.add(self.tag_fintech)

        self.draft_project = Project.objects.create(
            title="Internal Analytics Pipeline",
            slug="internal-analytics-pipeline",
            short_description="Confidential ML data pipeline",
            full_description="Internal platform under active NDA.",
            client_name="Stealth AI",
            status=Project.Status.DRAFT,
            is_featured=False,
            category=self.category_ai,
        )

        self.archived_project = Project.objects.create(
            title="Legacy Mobile App",
            slug="legacy-mobile-app",
            short_description="Retired native application",
            status=Project.Status.ARCHIVED,
            is_featured=False,
            category=self.category_web,
        )

    def _extract_results(self, response):
        """Extract items from StandardPagination / ApiResponse envelope."""
        body = response.json()
        if isinstance(body, dict):
            inner = body.get('data', body)
            if isinstance(inner, dict) and 'results' in inner:
                return inner['results']
            if isinstance(inner, list):
                return inner
            if 'results' in body:
                return body['results']
        return []

    # ---------------------------------------------------------------------------
    # Public API Tests
    # ---------------------------------------------------------------------------

    def test_public_projects_list_only_published(self):
        """Public list must return only PUBLISHED projects."""
        res = self.client.get("/api/portfolio/projects/")
        self.assertEqual(res.status_code, 200)
        results = self._extract_results(res)
        self.assertGreaterEqual(len(results), 1)
        slugs = [p['slug'] for p in results]

        self.assertIn("enterprise-banking-portal", slugs)
        self.assertNotIn("internal-analytics-pipeline", slugs)
        self.assertNotIn("legacy-mobile-app", slugs)

    def test_public_projects_filter_by_category(self):
        """Filter by ?category=<slug> returns matching projects only."""
        res = self.client.get("/api/portfolio/projects/?category=web-applications")
        self.assertEqual(res.status_code, 200)
        results = self._extract_results(res)
        self.assertGreaterEqual(len(results), 1)
        self.assertTrue(all(p['category']['slug'] == 'web-applications' for p in results if p.get('category')))

    def test_public_projects_filter_by_technology(self):
        """Filter by ?technology=<slug> returns projects with that tech."""
        res = self.client.get("/api/portfolio/projects/?technology=react")
        self.assertEqual(res.status_code, 200)
        results = self._extract_results(res)
        self.assertGreaterEqual(len(results), 1)
        self.assertEqual(results[0]['slug'], "enterprise-banking-portal")

    def test_public_projects_filter_by_tag(self):
        """Filter by ?tag=<slug> returns projects with that tag."""
        res = self.client.get("/api/portfolio/projects/?tag=fintech")
        self.assertEqual(res.status_code, 200)
        results = self._extract_results(res)
        self.assertGreaterEqual(len(results), 1)
        self.assertEqual(results[0]['slug'], "enterprise-banking-portal")

    def test_public_projects_filter_by_featured(self):
        """Filter by ?featured=1 returns only featured projects."""
        res = self.client.get("/api/portfolio/projects/?featured=1")
        self.assertEqual(res.status_code, 200)
        results = self._extract_results(res)
        self.assertGreaterEqual(len(results), 1)
        self.assertTrue(all(p['is_featured'] is True for p in results))

    def test_public_projects_search(self):
        """Search by keyword in title or description."""
        res = self.client.get("/api/portfolio/projects/?search=Banking")
        self.assertEqual(res.status_code, 200)
        results = self._extract_results(res)
        self.assertGreaterEqual(len(results), 1)
        self.assertEqual(results[0]['slug'], "enterprise-banking-portal")

    def test_public_project_detail_by_slug(self):
        """Public detail returns full details of a published project."""
        res = self.client.get("/api/portfolio/projects/enterprise-banking-portal/")
        self.assertEqual(res.status_code, 200)
        body = res.json()
        data = body.get('data', body)
        self.assertEqual(data['title'], "Enterprise Banking Portal")
        self.assertEqual(data['client_name'], "Global Bank Corp")

    def test_public_project_detail_draft_returns_404(self):
        """Public detail must return 404 for draft/unpublished projects."""
        res = self.client.get("/api/portfolio/projects/internal-analytics-pipeline/")
        self.assertEqual(res.status_code, 404)

    def test_public_categories_list(self):
        """Public categories endpoint returns active categories."""
        res = self.client.get("/api/portfolio/project-categories/")
        self.assertEqual(res.status_code, 200)
        body = res.json()
        categories = body.get('data', body)
        slugs = [c['slug'] for c in categories]
        self.assertIn("web-applications", slugs)
        self.assertIn("ai-solutions", slugs)

    def test_public_technologies_list(self):
        """Public technologies endpoint returns active technologies."""
        res = self.client.get("/api/portfolio/technologies/")
        self.assertEqual(res.status_code, 200)
        body = res.json()
        techs = body.get('data', body)
        slugs = [t['slug'] for t in techs]
        self.assertIn("react", slugs)
        self.assertIn("django", slugs)

    def test_public_tags_list(self):
        """Public tags endpoint returns active tags."""
        res = self.client.get("/api/portfolio/tags/")
        self.assertEqual(res.status_code, 200)
        body = res.json()
        tags = body.get('data', body)
        slugs = [t['slug'] for t in tags]
        self.assertIn("fintech", slugs)

    # ---------------------------------------------------------------------------
    # Admin API & CRUD Tests
    # ---------------------------------------------------------------------------

    def test_admin_projects_list_includes_drafts(self):
        """Admin list endpoint returns all projects regardless of status."""
        headers = {"HTTP_AUTHORIZATION": self.admin_auth_header}
        res = self.client.get("/api/portfolio/admin/projects/", **headers)
        self.assertEqual(res.status_code, 200)
        results = self._extract_results(res)
        slugs = [p['slug'] for p in results]
        self.assertIn("enterprise-banking-portal", slugs)
        self.assertIn("internal-analytics-pipeline", slugs)
        self.assertIn("legacy-mobile-app", slugs)

    def test_admin_project_create_success(self):
        """Admin can create a new project."""
        headers = {"HTTP_AUTHORIZATION": self.admin_auth_header}
        payload = {
            "title": "Cloud Healthcare System",
            "slug": "cloud-healthcare-system",
            "short_description": "HIPAA-compliant patient data portal",
            "client_name": "HealthCare Plus",
            "status": "published",
            "category": str(self.category_web.id),
        }
        res = self.client.post(
            "/api/portfolio/admin/projects/",
            data=payload,
            content_type="application/json",
            **headers
        )
        self.assertEqual(res.status_code, 201)
        self.assertTrue(Project.objects.filter(slug="cloud-healthcare-system").exists())

    def test_admin_project_update_patch(self):
        """Admin can partially update an existing project."""
        headers = {"HTTP_AUTHORIZATION": self.admin_auth_header}
        payload = {
            "title": "Updated Banking Portal",
            "is_featured": False
        }
        res = self.client.patch(
            f"/api/portfolio/admin/projects/{self.published_project.slug}/",
            data=payload,
            content_type="application/json",
            **headers
        )
        self.assertEqual(res.status_code, 200)
        self.published_project.refresh_from_db()
        self.assertEqual(self.published_project.title, "Updated Banking Portal")
        self.assertFalse(self.published_project.is_featured)

    def test_admin_project_delete_success(self):
        """Admin can delete a project."""
        headers = {"HTTP_AUTHORIZATION": self.admin_auth_header}
        res = self.client.delete(
            f"/api/portfolio/admin/projects/{self.draft_project.slug}/",
            **headers
        )
        self.assertEqual(res.status_code, 200)
        self.assertFalse(Project.objects.filter(slug="internal-analytics-pipeline").exists())

    # ---------------------------------------------------------------------------
    # Security Tests
    # ---------------------------------------------------------------------------

    def test_security_anonymous_denied_admin(self):
        """Unauthenticated request to admin endpoint must return 401."""
        res = self.client.get("/api/portfolio/admin/projects/")
        self.assertEqual(res.status_code, 401)

    def test_security_viewer_denied_admin(self):
        """Non-admin user (Viewer role) must return 403 Forbidden."""
        headers = {"HTTP_AUTHORIZATION": self.viewer_auth_header}
        res = self.client.get("/api/portfolio/admin/projects/", **headers)
        self.assertEqual(res.status_code, 403)
