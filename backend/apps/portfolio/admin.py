from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'service', 'is_featured', 'created_at')
    list_editable = ('is_featured',)
    list_filter = ('is_featured', 'service')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'client_name')
