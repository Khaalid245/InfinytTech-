from django.contrib import admin
from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'subject', 'status', 'created_at')
    list_filter = ('status',)
    list_editable = ('status',)
    search_fields = ('full_name', 'email', 'subject')
    readonly_fields = ('full_name', 'email', 'phone', 'subject', 'message', 'created_at')
