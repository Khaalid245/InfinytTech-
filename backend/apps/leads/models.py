from django.db import models
from apps.core.models import UUIDModel, TimeStampedModel

class Lead(UUIDModel, TimeStampedModel):
    class Status(models.TextChoices):
        NEW = 'new', 'New'
        READ = 'read', 'Read'
        REPLIED = 'replied', 'Replied'

    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=150, blank=True)
    service_interest = models.CharField(max_length=100, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.NEW,
    )

    class Meta:
        db_table = 'leads'
        ordering = ['-created_at']
        verbose_name_plural = 'leads'

    def __str__(self):
        return f"{self.full_name} — {self.subject}"
