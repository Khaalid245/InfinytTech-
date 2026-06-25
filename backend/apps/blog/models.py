from django.db import models
from django.conf import settings
from django.utils import timezone
from apps.core.models import UUIDModel, TimeStampedModel


class BlogCategory(UUIDModel, TimeStampedModel):
    """
    Segmentation for blog articles (e.g. Engineering, Design, Strategy).
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'blog_categories'
        ordering = ['order', 'name']
        verbose_name = 'Blog Category'
        verbose_name_plural = 'Blog Categories'

    def __str__(self):
        return self.name


class BlogTag(UUIDModel, TimeStampedModel):
    """
    Flexible taxonomy keyword tags for articles (e.g. React, Python, UX).
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)

    class Meta:
        db_table = 'blog_tags'
        ordering = ['name']
        verbose_name = 'Blog Tag'
        verbose_name_plural = 'Blog Tags'

    def __str__(self):
        return self.name


class BlogPost(UUIDModel, TimeStampedModel):
    """
    Production-grade Blog article model containing publishing stages,
    auto-calculated reading times, and SEO overrides.
    """
    class StatusChoices(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'
        ARCHIVED = 'archived', 'Archived'

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    excerpt = models.CharField(max_length=500, blank=True)
    content = models.TextField()
    featured_image = models.ImageField(upload_to='blog/images/', max_length=255, blank=True, null=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='blog_posts'
    )
    category = models.ForeignKey(
        BlogCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='posts'
    )
    tags = models.ManyToManyField(
        BlogTag,
        blank=True,
        related_name='posts'
    )
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.DRAFT,
    )
    is_featured = models.BooleanField(default=False)
    published_at = models.DateTimeField(blank=True, null=True)
    seo_title = models.CharField(max_length=150, blank=True, help_text="SEO Meta Title Override")
    seo_description = models.CharField(max_length=250, blank=True, help_text="SEO Meta Description Override")
    reading_time = models.PositiveIntegerField(default=0, help_text="Calculated reading duration in minutes")

    class Meta:
        db_table = 'blog_posts'
        ordering = ['-published_at', '-created_at']
        verbose_name = 'Blog Post'
        verbose_name_plural = 'Blog Posts'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # 1. Estimate reading duration based on 200 words-per-minute average
        if self.content:
            word_count = len(self.content.split())
            self.reading_time = max(1, round(word_count / 200))
        else:
            self.reading_time = 0

        # 2. Update publication timestamps upon switching status to PUBLISHED
        if self.status == self.StatusChoices.PUBLISHED and not self.published_at:
            self.published_at = timezone.now()
        elif self.status == self.StatusChoices.DRAFT:
            # Clear publishing date if reverted back to draft
            self.published_at = None

        super().save(*args, **kwargs)
