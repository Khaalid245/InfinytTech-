from django.db import models
from apps.core.models import UUIDModel, TimeStampedModel


class ServiceCategory(UUIDModel, TimeStampedModel):
    """
    Broad categorization of services (e.g. Design, Development, Strategy).
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'service_categories'
        ordering = ['order', 'name']
        verbose_name = 'Service Category'
        verbose_name_plural = 'Service Categories'

    def __str__(self):
        return self.name


class Service(UUIDModel, TimeStampedModel):
    """
    Individual digital services offered (e.g. Frontend Development, UX Audits).
    """
    category = models.ForeignKey(
        ServiceCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='services'
    )
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField()
    icon = models.CharField(
        max_length=100, blank=True,
        help_text='Icon identifier for frontend rendering (e.g. "code", "search")'
    )
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'services'
        ordering = ['order', 'title']
        verbose_name = 'Service'
        verbose_name_plural = 'Services'

    def __str__(self):
        return self.title


class ServiceFeature(UUIDModel, TimeStampedModel):
    """
    Granular features or features list included under a specific service.
    """
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name='features'
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'service_features'
        ordering = ['order', 'title']
        verbose_name = 'Service Feature'
        verbose_name_plural = 'Service Features'

    def __str__(self):
        return f"{self.service.title} - {self.title}"


class Industry(UUIDModel, TimeStampedModel):
    """
    Industries served by the agency (e.g. Fintech, Healthcare).
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(
        max_length=100, blank=True,
        help_text='Icon identifier for frontend rendering (e.g. "heart", "dollar-sign")'
    )
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'industries'
        ordering = ['order', 'name']
        verbose_name = 'Industry'
        verbose_name_plural = 'Industries'

    def __str__(self):
        return self.name


class ProcessStep(UUIDModel, TimeStampedModel):
    """
    Methodology or step-by-step process of delivery.
    """
    step_number = models.CharField(max_length=10, help_text='e.g. "01"')
    short_title = models.CharField(max_length=100)
    full_title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(
        max_length=100, blank=True,
        help_text='Icon identifier for frontend rendering (e.g. "search", "rocket")'
    )
    duration = models.CharField(max_length=100, help_text='e.g. "1-2 Weeks"')
    deliverables = models.JSONField(default=list, blank=True, help_text='List of deliverables strings')
    outcomes = models.JSONField(default=list, blank=True, help_text='List of outcomes strings')
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'process_steps'
        ordering = ['order', 'step_number']
        verbose_name = 'Process Step'
        verbose_name_plural = 'Process Steps'

    def __str__(self):
        return f"{self.step_number} - {self.short_title}"


class FAQ(UUIDModel, TimeStampedModel):
    """
    Frequently Asked Questions for services.
    """
    question = models.CharField(max_length=255)
    answer_intro = models.TextField()
    answer_bullets = models.JSONField(default=list, blank=True, help_text='List of bullets strings')
    answer_outro = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'faqs'
        ordering = ['order', 'question']
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'

    def __str__(self):
        return self.question
