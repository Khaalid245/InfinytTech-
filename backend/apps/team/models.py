from django.db import models
from django.utils.text import slugify
from apps.core.models import UUIDModel, TimeStampedModel


class Department(UUIDModel, TimeStampedModel):
    """
    Organizational grouping for team members
    (e.g. Engineering, Design, Leadership, Advisory Board).
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'team_departments'
        ordering = ['display_order', 'name']
        verbose_name = 'Department'
        verbose_name_plural = 'Departments'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class TeamMember(UUIDModel, TimeStampedModel):
    """
    Production-grade team member profile powering About, Leadership,
    Executive Team, Advisors, and future Careers pages.
    """
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=220, unique=True)
    position = models.CharField(max_length=200)

    department = models.ForeignKey(
        Department,
        on_delete=models.PROTECT,
        related_name='members'
    )

    # Photo — ForeignKey to Media Library for clean asset management
    photo = models.ForeignKey(
        'media_library.MediaFile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='team_member_photos',
        help_text='Select a photo from the Media Library.'
    )

    short_bio = models.CharField(
        max_length=500,
        blank=True,
        help_text='Short summary shown in card/grid views (max 500 chars).'
    )
    biography = models.TextField(
        blank=True,
        help_text='Full biography shown on the detail/profile page.'
    )

    # Contact — all optional
    email = models.EmailField(
        blank=True,
        null=True,
        unique=True,
        help_text='Public contact email (must be unique if provided).'
    )
    phone = models.CharField(max_length=30, blank=True)

    # Social / Web links — all optional
    linkedin_url = models.URLField(max_length=300, blank=True)
    github_url = models.URLField(max_length=300, blank=True)
    twitter_url = models.URLField(max_length=300, blank=True)
    website_url = models.URLField(max_length=300, blank=True)

    # Professional metadata
    years_of_experience = models.PositiveIntegerField(
        default=0,
        help_text='Total years of professional experience.'
    )
    skills = models.JSONField(
        default=list,
        blank=True,
        help_text='List of skill strings (e.g. ["Python", "React", "AWS"]).'
    )

    # Ordering and visibility
    display_order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(
        default=False,
        help_text='Featured members are promoted on the homepage / hero sections.'
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'team_members'
        ordering = ['display_order', 'last_name', 'first_name']
        verbose_name = 'Team Member'
        verbose_name_plural = 'Team Members'

    def __str__(self):
        return self.full_name

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def save(self, *args, **kwargs):
        # Auto-generate slug from full name if not explicitly provided
        if not self.slug:
            base_slug = slugify(f"{self.first_name} {self.last_name}")
            unique_slug = base_slug
            counter = 1
            while TeamMember.objects.filter(slug=unique_slug).exclude(id=self.id).exists():
                unique_slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = unique_slug
        super().save(*args, **kwargs)
