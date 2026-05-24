from django.contrib import admin
from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'company', 'is_active', 'order')
    list_editable = ('is_active', 'order')
    search_fields = ('name', 'role', 'company')
