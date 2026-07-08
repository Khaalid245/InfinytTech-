from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.cache import cache
from rest_framework_simplejwt.tokens import AccessToken
from .models import BlogCategory, BlogTag, BlogPost

User = get_user_model()


class BlogCMSTestCase(TestCase):
    def setUp(self):
        # Reset rate limiting cache between test runs
        cache.clear()

        # 1. Create admin user and JWT headers
        self.email = "admin_blog@infinyttech.com"
        self.password = "testpassword123"
        self.admin_user = User.objects.create_superuser(
            email=self.email,
            password=self.password
        )
        token = AccessToken.for_user(self.admin_user)
        self.auth_header = f"Bearer {token}"

        # 2. Create non-admin developer user
        self.dev_user = User.objects.create_user(
            email="developer_blog@infinyttech.com",
            password=self.password,
            role=User.Role.DEVELOPER
        )

        # 3. Create test database records
        self.category = BlogCategory.objects.create(
            name="Engineering",
            slug="engineering",
            description="Software engineering articles",
            order=1
        )

        self.tag = BlogTag.objects.create(
            name="React",
            slug="react"
        )

        self.draft_post = BlogPost.objects.create(
            title="Building React Apps",
            slug="building-react-apps",
            excerpt="Excerpt for React post",
            content="This is a simple blog content about React component design patterns. Let's make it a bit longer to test reading time. Writing software components requires focus and dedication to modular design systems.",
            author=self.admin_user,
            category=self.category,
            status=BlogPost.StatusChoices.DRAFT
        )
        self.draft_post.tags.add(self.tag)

        self.published_post = BlogPost.objects.create(
            title="Scaling Python APIs",
            slug="scaling-python-apis",
            excerpt="Excerpt for Python post",
            content="This is a simple blog post about scaling Python APIs with standard web architectures.",
            author=self.admin_user,
            category=self.category,
            status=BlogPost.StatusChoices.PUBLISHED
        )

        self.client = Client()

    def test_model_lifecycle_hooks(self):
        # Verify reading time was estimated on save (approx 20 words for React post)
        # 20 words / 200 = 0.1 -> rounded should be max(1, 0) = 1
        self.assertEqual(self.draft_post.reading_time, 1)

        # Verify draft post does not have published_at timestamp
        self.assertIsNone(self.draft_post.published_at)

        # Verify published post has published_at timestamp set automatically
        self.assertIsNotNone(self.published_post.published_at)

        # Reverting published post to draft clears published_at
        self.published_post.status = BlogPost.StatusChoices.DRAFT
        self.published_post.save()
        self.assertIsNone(self.published_post.published_at)

    def test_public_categories_tags_lists(self):
        # GET Categories
        res = self.client.get("/api/blog/categories/")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['data'][0]['name'], "Engineering")

        # GET Tags
        res = self.client.get("/api/blog/tags/")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['data'][0]['name'], "React")

    def test_public_posts_list_filtering(self):
        # 1. Verify list only contains PUBLISHED posts
        res = self.client.get("/api/blog/posts/")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data['success'])
        # Only self.published_post is returned, draft_post is hidden
        results = data['data']['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['slug'], "scaling-python-apis")

        # 2. Get single post by slug details
        res = self.client.get(f"/api/blog/posts/{self.published_post.slug}/")
        self.assertEqual(res.status_code, 200)
        post_data = res.json()['data']
        self.assertEqual(post_data['title'], "Scaling Python APIs")

        # 3. GET draft post by slug details returns 404
        res = self.client.get(f"/api/blog/posts/{self.draft_post.slug}/")
        self.assertEqual(res.status_code, 404)

    def test_security_admin_endpoints_guarding(self):
        admin_paths = [
            "/api/blog/admin/categories/",
            "/api/blog/admin/tags/",
            "/api/blog/admin/posts/"
        ]

        # Anonymous request blocked
        for path in admin_paths:
            res = self.client.get(path)
            self.assertIn(res.status_code, [401, 403])

        # Standard developer request blocked
        token = AccessToken.for_user(self.dev_user)
        headers = {"HTTP_AUTHORIZATION": f"Bearer {token}"}
        for path in admin_paths:
            res = self.client.get(path, **headers)
            self.assertEqual(res.status_code, 403)

    def test_admin_crud_operations(self):
        headers = {"HTTP_AUTHORIZATION": self.auth_header}

        # Create Category
        res = self.client.post(
            "/api/blog/admin/categories/",
            data={"name": "UX Design", "slug": "ux-design", "description": "User experience"},
            content_type="application/json",
            **headers
        )
        self.assertEqual(res.status_code, 201)
        cat_id = res.json()['data']['id']

        # Create Tag
        res = self.client.post(
            "/api/blog/admin/tags/",
            data={"name": "Tailwind", "slug": "tailwind"},
            content_type="application/json",
            **headers
        )
        self.assertEqual(res.status_code, 201)
        tag_id = res.json()['data']['id']

        # Create BlogPost
        post_payload = {
            "title": "Designing Sleek Grids",
            "slug": "designing-sleek-grids",
            "content": "This is a detailed post about grid spacing metrics.",
            "author": str(self.admin_user.id),
            "category": cat_id,
            "tags": [tag_id],
            "status": "published"
        }
        res = self.client.post(
            "/api/blog/admin/posts/",
            data=post_payload,
            content_type="application/json",
            **headers
        )
        self.assertEqual(res.status_code, 201)
        post_id = res.json()['data']['id']

        # Verify publication status and timestamps on creation
        self.assertTrue(BlogPost.objects.filter(id=post_id, status="published").exists())

        # Update BlogPost
        res = self.client.patch(
            f"/api/blog/admin/posts/{post_id}/",
            data={"status": "draft"},
            content_type="application/json",
            **headers
        )
        self.assertEqual(res.status_code, 200)

        # Delete BlogPost
        res = self.client.delete(f"/api/blog/admin/posts/{post_id}/", **headers)
        self.assertEqual(res.status_code, 200)  # We return standard status with success msg
        self.assertFalse(BlogPost.objects.filter(id=post_id).exists())
