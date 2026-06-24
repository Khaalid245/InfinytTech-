from django.db import models
from django.conf import settings
from apps.core.models import UUIDModel, TimeStampedModel


class Lead(UUIDModel, TimeStampedModel):
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
    company = models.CharField(max_length=150, blank=True)
    country = models.CharField(max_length=100, blank=True)
    project_type = models.CharField(max_length=100, blank=True)
    budget_range = models.CharField(max_length=100, blank=True)
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
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'leads'
        ordering = ['-created_at']
        verbose_name = 'Lead'
        verbose_name_plural = 'Leads'

    def __str__(self):
        return f"{self.first_name} {self.last_name} — {self.company or self.email}"
