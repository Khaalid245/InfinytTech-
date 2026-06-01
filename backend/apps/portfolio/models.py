from django.db import models
from apps.services.models import Service


class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    tag = models.CharField(max_length=100, blank=True)
    description = models.TextField()
    key_metric = models.CharField(max_length=100, blank=True)
    thumbnail = models.ImageField(upload_to='portfolio/', blank=True)
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    client_name = models.CharField(max_length=150, blank=True)
    project_url = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'portfolio_projects'
        ordering = ['-created_at']

    def __str__(self):
        return self.title
