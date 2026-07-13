from django.db import models
from django.conf import settings
from apps.core.models import UUIDModel, TimeStampedModel


class Lead(UUIDModel, TimeStampedModel):
    class PriorityChoices(models.TextChoices):
        LOW = 'low', 'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high', 'High'
        URGENT = 'urgent', 'Urgent'
    class StatusChoices(models.TextChoices):
        NEW = 'new', 'New'
        CONTACTED = 'contacted', 'Contacted'
        QUALIFIED = 'qualified', 'Qualified'
        PROPOSAL_SENT = 'proposal_sent', 'Proposal Sent'
        NEGOTIATION = 'negotiation', 'Negotiation'
        WON = 'won', 'Won'
        LOST = 'lost', 'Lost'

    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    whatsapp = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=150, blank=True)
    industry = models.CharField(max_length=100, blank=True)
    website = models.URLField(max_length=255, blank=True)
    company_size = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=100, blank=True)
    project_type = models.CharField(max_length=100, blank=True)
    budget_range = models.CharField(max_length=100, blank=True)
    services = models.ManyToManyField(
        'services.Service',
        blank=True,
        related_name='leads'
    )
    message = models.TextField()
    source = models.CharField(
        max_length=100, 
        blank=True, 
        help_text="Where the lead came from (e.g. Google, Showcase, Contact Form)"
    )
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.NEW,
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='leads'
    )
    priority = models.CharField(
        max_length=20,
        choices=PriorityChoices.choices,
        default=PriorityChoices.LOW,
    )
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'leads'
        ordering = ['-created_at']
        verbose_name = 'Lead'
        verbose_name_plural = 'Leads'

    def __str__(self):
        return f"{self.first_name} {self.last_name} — {self.company or self.email}"


class LeadTimeline(UUIDModel, TimeStampedModel):
    """
    Tracks all major events for a Lead (Creation, Status Change, Assignment, Notes).
    """
    lead = models.ForeignKey(
        Lead,
        on_delete=models.CASCADE,
        related_name='timeline'
    )
    action = models.CharField(max_length=50)
    description = models.TextField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='lead_timeline_actions'
    )

    class Meta:
        db_table = 'lead_timeline'
        ordering = ['-created_at']
        verbose_name = 'Lead Timeline Event'
        verbose_name_plural = 'Lead Timeline Events'

    def __str__(self):
        return f"{self.action} on {self.lead}"
