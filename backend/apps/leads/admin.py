from django.contrib import admin
from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'subject', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('full_name', 'email', 'subject')
    readonly_fields = ('full_name', 'email', 'phone', 'company', 'service_interest', 'subject', 'message', 'created_at')

    def has_add_permission(self, request):
        return False
