import io
from PIL import Image
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.exceptions import ValidationError
from django.core.cache import cache
from rest_framework_simplejwt.tokens import AccessToken

from .models import MediaFolder, MediaTag, MediaFile
from .serializers import MediaFolderSerializer, MediaTagSerializer, MediaFileSerializer
from .validators import MAX_FILE_SIZE

User = get_user_model()


class MediaLibraryTestCase(TestCase):
    def setUp(self):
        cache.clear()

        # 1. Create admin user
        self.admin_user = User.objects.create_superuser(
            email="admin_media@infinyttech.com",
            password="testpassword123"
        )
        token = AccessToken.for_user(self.admin_user)
        self.auth_header = f"Bearer {token}"

        # 2. Create non-admin user
        self.non_admin = User.objects.create_user(
            email="user_media@infinyttech.com",
            password="testpassword123",
            role=User.Role.DEVELOPER
        )
        token_dev = AccessToken.for_user(self.non_admin)
        self.dev_auth_header = f"Bearer {token_dev}"

        # 3. Setup Folders
        self.folder_root = MediaFolder.objects.create(
            name="Assets Root",
            slug="assets-root",
            order=1
        )
        self.folder_child = MediaFolder.objects.create(
            name="Images Category",
            slug="images-category",
            parent=self.folder_root,
            order=2
        )

        # 4. Setup Tag
        self.tag_gold = MediaTag.objects.create(
            name="Brand Gold",
            slug="brand-gold",
            color="#D4A017"
        )

        # Create a mock image file
        img_buffer = io.BytesIO()
        img = Image.new('RGB', (120, 80), color='red')
        img.save(img_buffer, format='JPEG')
        img_buffer.seek(0)
        self.mock_image_data = img_buffer.read()

        # 5. Create a public media file
        self.public_file = MediaFile.objects.create(
            title="Logo Image",
            file=SimpleUploadedFile("logo.jpg", self.mock_image_data, content_type="image/jpeg"),
            folder=self.folder_root,
            uploaded_by=self.admin_user,
            is_public=True
        )
        self.public_file.tags.add(self.tag_gold)

        # 6. Create a private media file
        self.private_file = MediaFile.objects.create(
            title="Private Design Specifications",
            file=SimpleUploadedFile("design_spec.pdf", b"pdf mock contents", content_type="application/pdf"),
            folder=self.folder_child,
            uploaded_by=self.admin_user,
            is_public=False
        )

        self.client = Client()

    def test_metadata_extraction_image(self):
        """
        Verify image dimensions, checksum, size, extension, and slug are extracted correctly.
        """
        self.assertEqual(self.public_file.extension, "jpg")
        self.assertEqual(self.public_file.mime_type, "image/jpeg")
        self.assertEqual(self.public_file.width, 120)
        self.assertEqual(self.public_file.height, 80)
        self.assertIsNotNone(self.public_file.checksum)
        self.assertIsNotNone(self.public_file.slug)
        self.assertEqual(self.public_file.original_filename, "logo.jpg")

    def test_metadata_extraction_pdf(self):
        """
        Verify PDF uploads do not set width/height but capture file size and extensions.
        """
        self.assertEqual(self.private_file.extension, "pdf")
        self.assertEqual(self.private_file.mime_type, "application/pdf")
        self.assertIsNone(self.private_file.width)
        self.assertIsNone(self.private_file.height)
        self.assertEqual(self.private_file.original_filename, "design_spec.pdf")

    def test_validator_file_size(self):
        """
        Ensure size limits are enforced.
        """
        serializer = MediaFileSerializer(
            data={
                "title": "Large File Test",
                "file": SimpleUploadedFile("too_large.jpg", b"0" * (MAX_FILE_SIZE + 100), content_type="image/jpeg"),
                "folder": str(self.folder_root.id)
            }
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("file", serializer.errors)

    def test_validator_allowed_extensions(self):
        """
        Ensure non-whitelisted extensions (e.g. .exe, .sh) are blocked.
        """
        serializer = MediaFileSerializer(
            data={
                "title": "Malware Script",
                "file": SimpleUploadedFile("script.exe", b"malware contents", content_type="application/x-msdownload"),
                "folder": str(self.folder_root.id)
            }
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("file", serializer.errors)

    def test_validator_mime_spoofing_prevention(self):
        """
        Ensure that renaming an executable to a whitelisted extension gets blocked.
        """
        serializer = MediaFileSerializer(
            data={
                "title": "Spoofed Logo",
                "file": SimpleUploadedFile("spoofed.jpg", b"sh payload", content_type="text/x-shellscript"),
                "folder": str(self.folder_root.id)
            }
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("file", serializer.errors)

    def test_validator_duplicate_filename_checks(self):
        """
        Ensure that creating two files with the exact same filename inside the same folder is prohibited.
        """
        serializer = MediaFileSerializer(
            data={
                "title": "Logo Image Duplicate",
                "file": SimpleUploadedFile("logo.jpg", self.mock_image_data, content_type="image/jpeg"),
                "folder": str(self.folder_root.id)
            }
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("file", serializer.errors)

    def test_validation_folder_recursion_loop(self):
        """
        Ensure parent validation prevents folder hierarchy cycles.
        """
        # Form loop: Child becomes parent of Root
        serializer = MediaFolderSerializer(
            instance=self.folder_root,
            data={
                "name": "Assets Root Loop",
                "parent": str(self.folder_child.id)
            },
            partial=True
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("parent", serializer.errors)

    def test_validation_tag_color(self):
        """
        Ensure color codes must follow proper hexadecimal notation rules.
        """
        serializer = MediaTagSerializer(
            data={
                "name": "Invalid Color Tag",
                "color": "#D4A01Z"
            }
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("color", serializer.errors)

    def test_security_anonymous_read_only(self):
        """
        Anonymous and non-admin users should only query public files.
        """
        # 1. Anonymous list request
        res = self.client.get("/api/media/")
        self.assertEqual(res.status_code, 200)
        results = res.json()['data']['results']
        # Only public_file is returned, private_file is filtered
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['id'], str(self.public_file.id))

        # 2. Anonymous retrieve private file returns 404
        res = self.client.get(f"/api/media/{self.private_file.id}/")
        self.assertEqual(res.status_code, 404)

        # 3. Anonymous write is blocked (401/403)
        res = self.client.post(
            "/api/media/",
            data={"title": "Anonymous upload", "file": SimpleUploadedFile("logo2.jpg", self.mock_image_data, content_type="image/jpeg")}
        )
        self.assertEqual(res.status_code, 401)

    def test_security_role_based_permissions(self):
        """
        Ensure non-admin accounts cannot upload or delete media assets.
        """
        headers = {"HTTP_AUTHORIZATION": self.dev_auth_header}

        # Developer is blocked from uploading
        res = self.client.post(
            "/api/media/",
            data={
                "title": "Developer Upload",
                "file": SimpleUploadedFile("dev_upload.png", self.mock_image_data, content_type="image/png"),
                "folder": str(self.folder_root.id)
            },
            **headers
        )
        self.assertEqual(res.status_code, 403)

        # Developer is blocked from deleting
        res = self.client.delete(f"/api/media/{self.public_file.id}/", **headers)
        self.assertEqual(res.status_code, 403)

    def test_api_admin_uploads_and_deletes_successfully(self):
        """
        Ensure Admin / SuperAdmin can perform all write operations.
        """
        headers = {"HTTP_AUTHORIZATION": self.auth_header}

        # Upload
        res = self.client.post(
            "/api/media/",
            data={
                "title": "Admin Upload",
                "file": SimpleUploadedFile("admin_upload.png", self.mock_image_data, content_type="image/png"),
                "folder": str(self.folder_root.id)
            },
            **headers
        )
        self.assertEqual(res.status_code, 201)
        new_file_id = res.json()['data']['id']

        # Verify database record exists
        self.assertTrue(MediaFile.objects.filter(id=new_file_id).exists())

        # Delete
        res = self.client.delete(f"/api/media/{new_file_id}/", **headers)
        self.assertEqual(res.status_code, 200)
        self.assertFalse(MediaFile.objects.filter(id=new_file_id).exists())

    def test_filters_and_search(self):
        """
        Ensure tag, folder, type filters and keyword searches behave correctly.
        """
        headers = {"HTTP_AUTHORIZATION": self.auth_header}

        # 1. Filter by folder
        res = self.client.get(f"/api/media/?folder={self.folder_child.id}", **headers)
        self.assertEqual(res.status_code, 200)
        results = res.json()['data']['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['id'], str(self.private_file.id))

        # 2. Filter by type (document)
        res = self.client.get("/api/media/?type=document", **headers)
        results = res.json()['data']['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['id'], str(self.private_file.id))

        # 3. Filter by tag slug
        res = self.client.get(f"/api/media/?tag={self.tag_gold.slug}", **headers)
        results = res.json()['data']['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['id'], str(self.public_file.id))

        # 4. Search by title
        res = self.client.get("/api/media/?search=Specifications", **headers)
        results = res.json()['data']['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['title'], "Private Design Specifications")
