from django.db import models
from apps.core.models import UUIDModel, TimeStampedModel


class ProjectCategory(UUIDModel, TimeStampedModel):
    """
    Taxonomy for grouping projects (e.g. Web Applications, AI Solutions).
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'portfolio_categories'
        ordering = ['name']
        verbose_name = 'Project Category'
        verbose_name_plural = 'Project Categories'

    def __str__(self):
        return self.name


class Technology(UUIDModel, TimeStampedModel):
    """
    Technology tag used across projects (e.g. React, Django, PostgreSQL).
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    icon_name = models.CharField(
        max_length=100, blank=True,
        help_text='Icon identifier for frontend rendering (e.g. "react", "django")'
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'portfolio_technologies'
        ordering = ['name']
        verbose_name = 'Technology'
        verbose_name_plural = 'Technologies'

    def __str__(self):
        return self.name


class ProjectTag(UUIDModel, TimeStampedModel):
    """
    Fine-grained labels for projects (e.g. Healthcare, SaaS, Automation).
    More specific than Category (broad domain) and distinct from Technology (stack).
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.CharField(
        max_length=255, blank=True,
        help_text='Optional short description of what this tag represents.'
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'portfolio_tags'
        ordering = ['name']
        verbose_name = 'Project Tag'
        verbose_name_plural = 'Project Tags'

    def __str__(self):
        return self.name


class Project(UUIDModel, TimeStampedModel):
    """
    Core portfolio project model. Supports full CMS lifecycle: Draft → Published → Archived.
    """
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'
        ARCHIVED = 'archived', 'Archived'

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    short_description = models.CharField(
        max_length=300,
        help_text='Brief summary shown in project cards and list views.'
    )
    full_description = models.TextField(
        blank=True,
        help_text='Rich detail shown on the project detail page.'
    )
    featured_image = models.ImageField(
        upload_to='portfolio/projects/featured/',
        blank=True,
        null=True,
        help_text='Legacy/Fallback raw image upload'
    )
    featured_media = models.ForeignKey(
        'media_library.MediaFile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='portfolio_projects',
        help_text='Selected image from Media Library'
    )
    client_name = models.CharField(max_length=150, blank=True)
    project_url = models.URLField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        db_index=True,
    )
    is_featured = models.BooleanField(default=False, db_index=True)

    # SEO
    meta_title = models.CharField(max_length=160, blank=True)
    meta_description = models.CharField(max_length=320, blank=True)

    # Relations
    category = models.ForeignKey(
        ProjectCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='projects',
    )
    technologies = models.ManyToManyField(
        Technology,
        blank=True,
        related_name='projects',
    )
    tags = models.ManyToManyField(
        ProjectTag,
        blank=True,
        related_name='projects',
    )

    class Meta:
        db_table = 'portfolio_projects'
        ordering = ['-created_at']
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'

    def __str__(self):
        return self.title


class ProjectImage(UUIDModel, TimeStampedModel):
    """
    Additional gallery images for a project (hero, screenshots, mockups).
    """
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='images',
    )
    image = models.ImageField(upload_to='portfolio/projects/gallery/', blank=True, null=True, help_text='Legacy/Fallback raw image upload')
    media_file = models.ForeignKey(
        'media_library.MediaFile',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='portfolio_gallery_images',
        help_text='Selected image from Media Library'
    )
    caption = models.CharField(max_length=255, blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'portfolio_project_images'
        ordering = ['display_order', 'created_at']
        verbose_name = 'Project Image'
        verbose_name_plural = 'Project Images'

    def __str__(self):
        return f'{self.project.title} — Image #{self.display_order}'


class ProjectMetric(UUIDModel, TimeStampedModel):
    """
    Business impact metrics displayed on a project (e.g. "40% Faster Operations").
    """
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='metrics',
    )
    metric_label = models.CharField(
        max_length=150,
        help_text='e.g. "Faster Operations", "Records Managed"'
    )
    metric_value = models.CharField(
        max_length=50,
        help_text='e.g. "40%", "5000+", "2x"'
    )
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'portfolio_project_metrics'
        ordering = ['display_order', 'created_at']
        verbose_name = 'Project Metric'
        verbose_name_plural = 'Project Metrics'

    def __str__(self):
        return f'{self.project.title} — {self.metric_value} {self.metric_label}'
