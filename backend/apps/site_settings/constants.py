from django.db import models

class PasswordPolicy(models.TextChoices):
    RELAXED = "relaxed", "Relaxed"
    STANDARD = "standard", "Standard"
    STRICT = "strict", "Strict"
