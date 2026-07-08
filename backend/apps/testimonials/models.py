from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.core.models import UUIDModel, TimeStampedModel
from django.utils import timezone


class Client(UUIDModel, TimeStampedModel):
    """
    Represents a client or partner company.
    """
    company_name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    industry = models.CharField(max_length=100)
    website = models.URLField(max_length=255, blank=True)
    company_logo = models.ForeignKey(
        'media_library.MediaFile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='client_logos',
        help_text="Company logo from Media Library."
    )
    country = models.CharField(max_length=100, blank=True)
    company_size = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['company_name']
        verbose_name = 'Client'
        verbose_name_plural = 'Clients'

    def __str__(self):
        return self.company_name

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.company_name)
            slug = base_slug
            counter = 1
            while Client.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)


class Testimonial(UUIDModel, TimeStampedModel):
    """
    Represents a client testimonial or success story quote.
    """
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PUBLISHED = 'PUBLISHED', 'Published'
        ARCHIVED = 'ARCHIVED', 'Archived'

    client = models.ForeignKey(
        Client, 
        on_delete=models.PROTECT, 
        related_name='testimonials'
    )
    project = models.ForeignKey(
        'portfolio.Project',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='testimonials'
    )
    
    author_name = models.CharField(max_length=255)
    author_position = models.CharField(max_length=255)
    author_photo = models.ForeignKey(
        'media_library.MediaFile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='testimonial_authors'
    )
    
    testimonial = models.TextField()
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=5
    )
    
    featured = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20, 
        choices=Status.choices, 
        default=Status.DRAFT
    )
    display_order = models.IntegerField(default=0)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['display_order', '-created_at']
        verbose_name = 'Testimonial'
        verbose_name_plural = 'Testimonials'

    def __str__(self):
        return f"{self.author_name} ({self.client.company_name})"

    def save(self, *args, **kwargs):
        # Auto-set published_at when status changes to PUBLISHED
        if self.status == self.Status.PUBLISHED and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)
