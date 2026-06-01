from django.contrib import admin
from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'is_active', 'order', 'created_at')
    list_editable = ('is_active', 'order')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title',)
