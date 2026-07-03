"""
Phase 7 – Enterprise Team CMS: Comprehensive Test Suite
Covers: Models, Serializers, CRUD, Permissions, Public API,
        Admin API, Validation, Search, and Filtering.
"""
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework_simplejwt.tokens import AccessToken
from .models import Department, TeamMember

User = get_user_model()


# ===========================================================================
# Helpers
# ===========================================================================

def _make_admin_headers(user):
    token = AccessToken.for_user(user)
    return {'HTTP_AUTHORIZATION': f'Bearer {token}'}


class TeamCMSTestCase(TestCase):
    """Base test case that creates shared fixtures."""

    def setUp(self):
        # Clear rate-limit cache between test runs
        cache.clear()

        # Users
        self.admin_user = User.objects.create_superuser(
            email='admin_team@infinyttech.com',
            password='TestPass123!'
        )
        self.dev_user = User.objects.create_user(
            email='dev_team@infinyttech.com',
            password='TestPass123!',
            role=User.Role.DEVELOPER
        )
        self.admin_headers = _make_admin_headers(self.admin_user)

        # Departments
        self.dept_engineering = Department.objects.create(
            name='Engineering',
            slug='engineering',
            description='Software engineering team',
            display_order=1,
            is_active=True
        )
        self.dept_design = Department.objects.create(
            name='Design',
            slug='design',
            description='Product design team',
            display_order=2,
            is_active=True
        )
        self.dept_inactive = Department.objects.create(
            name='Legacy',
            slug='legacy',
            is_active=False
        )

        # Team Members
        self.member_active = TeamMember.objects.create(
            first_name='Alice',
            last_name='Smith',
            slug='alice-smith',
            position='Lead Engineer',
            department=self.dept_engineering,
            short_bio='Alice leads our engineering team.',
            biography='Full biography of Alice Smith.',
            email='alice@infinyttech.com',
            linkedin_url='https://linkedin.com/in/alicesmith',
            skills=['Python', 'Django', 'AWS'],
            years_of_experience=8,
            display_order=1,
            is_featured=True,
            is_active=True
        )
        self.member_featured = TeamMember.objects.create(
            first_name='Bob',
            last_name='Jones',
            slug='bob-jones',
            position='Head of Design',
            department=self.dept_design,
            short_bio='Bob leads product design.',
            email='bob@infinyttech.com',
            skills=['Figma', 'UX Research'],
            display_order=2,
            is_featured=True,
            is_active=True
        )
        self.member_inactive = TeamMember.objects.create(
            first_name='Carol',
            last_name='Doe',
            slug='carol-doe',
            position='Retired CTO',
            department=self.dept_engineering,
            is_active=False
        )

        self.client = Client()


# ===========================================================================
# 1. Model Tests
# ===========================================================================

class DepartmentModelTest(TeamCMSTestCase):

    def test_str_representation(self):
        self.assertEqual(str(self.dept_engineering), 'Engineering')

    def test_auto_slug_generation(self):
        dept = Department.objects.create(name='Product Management')
        self.assertEqual(dept.slug, 'product-management')

    def test_ordering(self):
        depts = list(Department.objects.filter(is_active=True))
        self.assertEqual(depts[0].slug, 'engineering')
        self.assertEqual(depts[1].slug, 'design')

    def test_uuid_primary_key(self):
        import uuid
        self.assertIsInstance(self.dept_engineering.id, uuid.UUID)

    def test_timestamps_auto_set(self):
        self.assertIsNotNone(self.dept_engineering.created_at)
        self.assertIsNotNone(self.dept_engineering.updated_at)


class TeamMemberModelTest(TeamCMSTestCase):

    def test_full_name_property(self):
        self.assertEqual(self.member_active.full_name, 'Alice Smith')

    def test_str_representation(self):
        self.assertEqual(str(self.member_active), 'Alice Smith')

    def test_auto_slug_generation(self):
        member = TeamMember.objects.create(
            first_name='Dave',
            last_name='Wu',
            position='Backend Engineer',
            department=self.dept_engineering
        )
        self.assertEqual(member.slug, 'dave-wu')

    def test_auto_slug_uniqueness_collision(self):
        """Duplicate name should get a numeric suffix."""
        member2 = TeamMember.objects.create(
            first_name='Alice',
            last_name='Smith',
            position='QA Engineer',
            department=self.dept_engineering
        )
        self.assertEqual(member2.slug, 'alice-smith-1')

    def test_uuid_primary_key(self):
        import uuid
        self.assertIsInstance(self.member_active.id, uuid.UUID)

    def test_department_fk_protect(self):
        """Deleting a department that has members should raise ProtectedError."""
        from django.db.models import ProtectedError
        with self.assertRaises(ProtectedError):
            self.dept_engineering.delete()

    def test_skills_defaults_to_empty_list(self):
        member = TeamMember.objects.create(
            first_name='Eve',
            last_name='Park',
            position='Advisor',
            department=self.dept_engineering
        )
        self.assertEqual(member.skills, [])


# ===========================================================================
# 2. Serializer Validation Tests
# ===========================================================================

class DepartmentSerializerTest(TeamCMSTestCase):

    def test_duplicate_slug_rejected(self):
        from .serializers import DepartmentSerializer
        serializer = DepartmentSerializer(data={
            'name': 'Another Engineering',
            'slug': 'engineering',   # already exists
        })
        self.assertFalse(serializer.is_valid())
        self.assertIn('slug', serializer.errors)

    def test_valid_department_passes(self):
        from .serializers import DepartmentSerializer
        serializer = DepartmentSerializer(data={
            'name': 'Marketing',
            'slug': 'marketing',
            'display_order': 5,
            'is_active': True
        })
        self.assertTrue(serializer.is_valid(), serializer.errors)


class AdminTeamMemberSerializerTest(TeamCMSTestCase):

    def _base_payload(self, **overrides):
        payload = {
            'first_name': 'Frank',
            'last_name': 'Lee',
            'slug': 'frank-lee',
            'position': 'DevOps Engineer',
            'department': str(self.dept_engineering.id),
            'skills': ['Docker', 'Kubernetes'],
            'display_order': 5,
        }
        payload.update(overrides)
        return payload

    def test_duplicate_slug_rejected(self):
        from .serializers import AdminTeamMemberSerializer
        payload = self._base_payload(slug='alice-smith')  # already exists
        serializer = AdminTeamMemberSerializer(data=payload)
        self.assertFalse(serializer.is_valid())
        self.assertIn('slug', serializer.errors)

    def test_duplicate_email_rejected(self):
        from .serializers import AdminTeamMemberSerializer
        payload = self._base_payload(email='alice@infinyttech.com')  # already taken
        serializer = AdminTeamMemberSerializer(data=payload)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

    def test_blank_email_allowed(self):
        """Null/blank email is acceptable — email is optional."""
        from .serializers import AdminTeamMemberSerializer
        payload = self._base_payload(email='')
        serializer = AdminTeamMemberSerializer(data=payload)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_invalid_linkedin_url_rejected(self):
        from .serializers import AdminTeamMemberSerializer
        payload = self._base_payload(linkedin_url='not-a-url')
        serializer = AdminTeamMemberSerializer(data=payload)
        self.assertFalse(serializer.is_valid())
        self.assertIn('linkedin_url', serializer.errors)

    def test_skills_must_be_list(self):
        from .serializers import AdminTeamMemberSerializer
        payload = self._base_payload(skills='Python,Django')
        serializer = AdminTeamMemberSerializer(data=payload)
        self.assertFalse(serializer.is_valid())
        self.assertIn('skills', serializer.errors)


# ===========================================================================
# 3. Public API Tests
# ===========================================================================

class PublicTeamMemberListAPITest(TeamCMSTestCase):

    def test_list_returns_only_active_members(self):
        res = self.client.get('/api/team/')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data['success'])
        slugs = [r['slug'] for r in data['data']['results']]
        self.assertIn('alice-smith', slugs)
        self.assertIn('bob-jones', slugs)
        self.assertNotIn('carol-doe', slugs)  # inactive — must be hidden

    def test_pagination_present(self):
        res = self.client.get('/api/team/')
        self.assertEqual(res.status_code, 200)
        payload = res.json()['data']
        self.assertIn('count', payload)
        self.assertIn('results', payload)
        self.assertIn('next', payload)
        self.assertIn('previous', payload)

    def test_search_by_first_name(self):
        res = self.client.get('/api/team/?search=Alice')
        self.assertEqual(res.status_code, 200)
        results = res.json()['data']['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['slug'], 'alice-smith')

    def test_search_by_position(self):
        res = self.client.get('/api/team/?search=Design')
        self.assertEqual(res.status_code, 200)
        results = res.json()['data']['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['slug'], 'bob-jones')

    def test_filter_by_department_slug(self):
        res = self.client.get('/api/team/?department=engineering')
        self.assertEqual(res.status_code, 200)
        results = res.json()['data']['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['slug'], 'alice-smith')

    def test_filter_featured_only(self):
        res = self.client.get('/api/team/?featured=true')
        self.assertEqual(res.status_code, 200)
        results = res.json()['data']['results']
        slugs = [r['slug'] for r in results]
        self.assertIn('alice-smith', slugs)
        self.assertIn('bob-jones', slugs)

    def test_ordered_by_display_order(self):
        res = self.client.get('/api/team/')
        self.assertEqual(res.status_code, 200)
        results = res.json()['data']['results']
        orders = [r['display_order'] for r in results]
        self.assertEqual(orders, sorted(orders))


class PublicTeamMemberDetailAPITest(TeamCMSTestCase):

    def test_active_member_detail_returns_200(self):
        res = self.client.get(f'/api/team/alice-smith/')
        self.assertEqual(res.status_code, 200)
        data = res.json()['data']
        self.assertEqual(data['slug'], 'alice-smith')
        self.assertIn('biography', data)
        self.assertIn('email', data)

    def test_inactive_member_returns_404(self):
        res = self.client.get('/api/team/carol-doe/')
        self.assertEqual(res.status_code, 404)

    def test_nonexistent_slug_returns_404(self):
        res = self.client.get('/api/team/does-not-exist/')
        self.assertEqual(res.status_code, 404)


class PublicDepartmentListAPITest(TeamCMSTestCase):

    def test_list_returns_only_active_departments(self):
        res = self.client.get('/api/team/departments/')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data['success'])
        slugs = [d['slug'] for d in data['data']]
        self.assertIn('engineering', slugs)
        self.assertIn('design', slugs)
        self.assertNotIn('legacy', slugs)  # inactive department hidden


# ===========================================================================
# 4. Security / Permission Tests
# ===========================================================================

class TeamPermissionTest(TeamCMSTestCase):

    def test_anonymous_cannot_access_admin_members(self):
        res = self.client.get('/api/team/admin/members/')
        self.assertIn(res.status_code, [401, 403])

    def test_anonymous_cannot_access_admin_departments(self):
        res = self.client.get('/api/team/admin/departments/')
        self.assertIn(res.status_code, [401, 403])

    def test_developer_role_blocked_from_admin_members(self):
        headers = _make_admin_headers(self.dev_user)
        res = self.client.get('/api/team/admin/members/', **headers)
        self.assertEqual(res.status_code, 403)

    def test_developer_role_blocked_from_admin_departments(self):
        headers = _make_admin_headers(self.dev_user)
        res = self.client.get('/api/team/admin/departments/', **headers)
        self.assertEqual(res.status_code, 403)

    def test_admin_user_can_access_admin_members(self):
        res = self.client.get('/api/team/admin/members/', **self.admin_headers)
        self.assertEqual(res.status_code, 200)

    def test_admin_user_can_access_admin_departments(self):
        res = self.client.get('/api/team/admin/departments/', **self.admin_headers)
        self.assertEqual(res.status_code, 200)

    def test_public_list_allows_anonymous(self):
        res = self.client.get('/api/team/')
        self.assertEqual(res.status_code, 200)

    def test_public_detail_allows_anonymous(self):
        res = self.client.get('/api/team/alice-smith/')
        self.assertEqual(res.status_code, 200)


# ===========================================================================
# 5. Admin CRUD API Tests
# ===========================================================================

class AdminDepartmentCRUDTest(TeamCMSTestCase):

    def test_create_department(self):
        res = self.client.post(
            '/api/team/admin/departments/',
            data={'name': 'Marketing', 'slug': 'marketing', 'display_order': 10},
            content_type='application/json',
            **self.admin_headers
        )
        self.assertEqual(res.status_code, 201)
        dept_id = res.json()['data']['id']
        self.assertTrue(Department.objects.filter(id=dept_id).exists())

    def test_update_department(self):
        res = self.client.patch(
            f'/api/team/admin/departments/{self.dept_design.id}/',
            data={'display_order': 99},
            content_type='application/json',
            **self.admin_headers
        )
        self.assertEqual(res.status_code, 200)
        self.dept_design.refresh_from_db()
        self.assertEqual(self.dept_design.display_order, 99)

    def test_delete_empty_department(self):
        empty_dept = Department.objects.create(name='Temp', slug='temp-dept')
        res = self.client.delete(
            f'/api/team/admin/departments/{empty_dept.id}/',
            **self.admin_headers
        )
        self.assertEqual(res.status_code, 200)
        self.assertFalse(Department.objects.filter(id=empty_dept.id).exists())

    def test_duplicate_slug_create_rejected(self):
        res = self.client.post(
            '/api/team/admin/departments/',
            data={'name': 'Dup', 'slug': 'engineering'},
            content_type='application/json',
            **self.admin_headers
        )
        self.assertEqual(res.status_code, 400)


class AdminTeamMemberCRUDTest(TeamCMSTestCase):

    def _member_payload(self, **overrides):
        payload = {
            'first_name': 'Grace',
            'last_name': 'Hopper',
            'slug': 'grace-hopper',
            'position': 'Chief Architect',
            'department': str(self.dept_engineering.id),
            'short_bio': 'Pioneer of computing.',
            'skills': ['COBOL', 'Python'],
            'display_order': 10,
            'is_featured': False,
            'is_active': True,
        }
        payload.update(overrides)
        return payload

    def test_create_team_member(self):
        res = self.client.post(
            '/api/team/admin/members/',
            data=self._member_payload(),
            content_type='application/json',
            **self.admin_headers
        )
        self.assertEqual(res.status_code, 201, res.json())
        member_id = res.json()['data']['id']
        self.assertTrue(TeamMember.objects.filter(id=member_id).exists())

    def test_retrieve_team_member(self):
        res = self.client.get(
            f'/api/team/admin/members/{self.member_active.id}/',
            **self.admin_headers
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['data']['slug'], 'alice-smith')

    def test_update_team_member(self):
        res = self.client.patch(
            f'/api/team/admin/members/{self.member_active.id}/',
            data={'position': 'VP Engineering'},
            content_type='application/json',
            **self.admin_headers
        )
        self.assertEqual(res.status_code, 200)
        self.member_active.refresh_from_db()
        self.assertEqual(self.member_active.position, 'VP Engineering')

    def test_delete_team_member(self):
        payload = self._member_payload(
            first_name='Temp', last_name='Member',
            slug='temp-member', email='temp@infinyttech.com'
        )
        create_res = self.client.post(
            '/api/team/admin/members/',
            data=payload,
            content_type='application/json',
            **self.admin_headers
        )
        self.assertEqual(create_res.status_code, 201)
        member_id = create_res.json()['data']['id']

        del_res = self.client.delete(
            f'/api/team/admin/members/{member_id}/',
            **self.admin_headers
        )
        self.assertEqual(del_res.status_code, 200)
        self.assertFalse(TeamMember.objects.filter(id=member_id).exists())

    def test_duplicate_slug_on_create_rejected(self):
        res = self.client.post(
            '/api/team/admin/members/',
            data=self._member_payload(slug='alice-smith'),  # already exists
            content_type='application/json',
            **self.admin_headers
        )
        self.assertEqual(res.status_code, 400)
        # DRF returns validation errors at root level of the response body
        response_body = res.json()
        self.assertTrue(
            'slug' in response_body or 'slug' in response_body.get('errors', {}),
            f'Expected slug error in response: {response_body}'
        )

    def test_duplicate_email_on_create_rejected(self):
        res = self.client.post(
            '/api/team/admin/members/',
            data=self._member_payload(email='alice@infinyttech.com'),
            content_type='application/json',
            **self.admin_headers
        )
        self.assertEqual(res.status_code, 400)

    def test_invalid_url_rejected(self):
        res = self.client.post(
            '/api/team/admin/members/',
            data=self._member_payload(linkedin_url='not-a-url'),
            content_type='application/json',
            **self.admin_headers
        )
        self.assertEqual(res.status_code, 400)

    def test_admin_list_includes_inactive_members(self):
        """Admin list should return ALL members regardless of is_active."""
        res = self.client.get('/api/team/admin/members/', **self.admin_headers)
        self.assertEqual(res.status_code, 200)
        body = res.json()
        # Collect all slugs regardless of response wrapping style
        # Style A: api_response wrapped  -> body['data']['results'] or body['data'] (list)
        # Style B: DRF default paginator -> body['results'] or body (list)
        all_members = []
        if isinstance(body, list):
            all_members = body
        elif 'results' in body:
            all_members = body['results']
        elif 'data' in body:
            data = body['data']
            if isinstance(data, list):
                all_members = data
            elif isinstance(data, dict):
                all_members = data.get('results', [])
        slugs = [r['slug'] for r in all_members]
        self.assertIn(
            'carol-doe', slugs,
            f'Inactive member not found in admin list. slugs={slugs}'
        )


# ===========================================================================
# 6. Nested Serializer Tests
# ===========================================================================

class NestedDepartmentSerializerTest(TeamCMSTestCase):

    def test_list_returns_nested_department(self):
        res = self.client.get('/api/team/')
        self.assertEqual(res.status_code, 200)
        results = res.json()['data']['results']
        alice = next(r for r in results if r['slug'] == 'alice-smith')
        self.assertIsInstance(alice['department'], dict)
        self.assertEqual(alice['department']['slug'], 'engineering')

    def test_detail_returns_nested_department(self):
        res = self.client.get('/api/team/alice-smith/')
        self.assertEqual(res.status_code, 200)
        dept = res.json()['data']['department']
        self.assertIsInstance(dept, dict)
        self.assertEqual(dept['name'], 'Engineering')
