from django.db import models


class Testimonial(models.Model):
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    company = models.CharField(max_length=150, blank=True)
    quote = models.TextField()
    avatar = models.ImageField(upload_to='testimonials/', blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'testimonials'
        ordering = ['order']

    def __str__(self):
        return f"{self.name} — {self.role}"
