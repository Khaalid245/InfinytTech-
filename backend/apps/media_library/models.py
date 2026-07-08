import os
import hashlib
import mimetypes
from PIL import Image
from django.db import models
from django.conf import settings
from django.utils.text import slugify
from apps.core.models import UUIDModel, TimeStampedModel


class MediaFolder(UUIDModel, TimeStampedModel):
    """
    Hierarchical folder structures for organizing assets inside the Media Library.
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'media_folders'
        ordering = ['order', 'name']
        verbose_name = 'Media Folder'
        verbose_name_plural = 'Media Folders'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class MediaTag(UUIDModel, TimeStampedModel):
    """
    Tagging keywords to categorize files across folders.
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    color = models.CharField(max_length=7, default='#D4A017')
    description = models.TextField(blank=True)

    class Meta:
        db_table = 'media_tags'
        ordering = ['name']
        verbose_name = 'Media Tag'
        verbose_name_plural = 'Media Tags'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class MediaFile(UUIDModel, TimeStampedModel):
    """
    Centralized file model containing automatically generated dimensions, 
    checksum hashes, file size, and extension whitelist constraints.
    """
    folder = models.ForeignKey(
        MediaFolder,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='files'
    )
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='uploaded_media_files'
    )
    title = models.CharField(max_length=255)
    original_filename = models.CharField(max_length=255, blank=True)
    slug = models.SlugField(max_length=255, unique=True)
    alt_text = models.CharField(max_length=255, blank=True)
    caption = models.CharField(max_length=500, blank=True)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='media_library/', max_length=255)
    mime_type = models.CharField(max_length=100, blank=True)
    extension = models.CharField(max_length=10, blank=True)
    file_size = models.PositiveIntegerField(default=0, help_text="Size in bytes")
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    checksum = models.CharField(max_length=64, blank=True, help_text="SHA-256 hash of file content")
    is_public = models.BooleanField(default=True)
    tags = models.ManyToManyField(MediaTag, blank=True, related_name='files')

    class Meta:
        db_table = 'media_files'
        ordering = ['-created_at']
        verbose_name = 'Media File'
        verbose_name_plural = 'Media Files'

    def __str__(self):
        return self.title or self.original_filename

    def save(self, *args, **kwargs):
        if self.file:
            # 1. Auto-generate slug
            if not self.slug:
                base_slug = slugify(self.title or 'media-file')
                unique_slug = base_slug
                counter = 1
                while MediaFile.objects.filter(slug=unique_slug).exclude(id=self.id).exists():
                    unique_slug = f"{base_slug}-{counter}"
                    counter += 1
                self.slug = unique_slug

            # 2. Extract metadata
            self.original_filename = os.path.basename(self.file.name)
            name_part, ext_part = os.path.splitext(self.original_filename)
            self.extension = ext_part.lower().lstrip('.')
            self.file_size = self.file.size

            # 3. Guess MIME Type
            mime, _ = mimetypes.guess_type(self.original_filename)
            self.mime_type = mime or 'application/octet-stream'

            # 4. Generate SHA-256 checksum
            self.file.seek(0)
            sha256 = hashlib.sha256()
            for chunk in self.file.chunks():
                sha256.update(chunk)
            self.checksum = sha256.hexdigest()
            self.file.seek(0)

            # 5. Extract dimensions for images
            if self.extension in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
                try:
                    with Image.open(self.file) as img:
                        self.width, self.height = img.size
                except Exception:
                    pass
                self.file.seek(0)
            elif self.extension == 'svg':
                # SVG XML parsing for width/height attributes
                try:
                    import xml.etree.ElementTree as ET
                    self.file.seek(0)
                    tree = ET.parse(self.file)
                    root = tree.getroot()
                    self.file.seek(0)

                    w_attr = root.attrib.get('width')
                    h_attr = root.attrib.get('height')
                    vb_attr = root.attrib.get('viewBox')

                    parsed_w, parsed_h = None, None
                    if w_attr and w_attr.replace('px', '').strip().isdigit():
                        parsed_w = int(w_attr.replace('px', '').strip())
                    if h_attr and h_attr.replace('px', '').strip().isdigit():
                        parsed_h = int(h_attr.replace('px', '').strip())

                    if (not parsed_w or not parsed_h) and vb_attr:
                        parts = vb_attr.strip().split()
                        if len(parts) == 4:
                            try:
                                parsed_w = int(float(parts[2]))
                                parsed_h = int(float(parts[3]))
                            except ValueError:
                                pass

                    self.width = parsed_w
                    self.height = parsed_h
                except Exception:
                    pass
                self.file.seek(0)

        super().save(*args, **kwargs)
