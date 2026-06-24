from django.contrib import admin
from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = (
        'first_name', 'last_name', 'email', 'company', 
        'project_type', 'status', 'assigned_to', 'created_at'
    )
    list_editable = ('status', 'assigned_to')
    search_fields = ('first_name', 'last_name', 'email', 'company', 'project_type', 'message')
    list_filter = ('status', 'country', 'created_at', 'assigned_to')
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ('Lead Information', {
            'fields': ('first_name', 'last_name', 'email', 'phone', 'company', 'country')
        }),
        ('Project Requirements', {
            'fields': ('project_type', 'budget_range', 'message', 'source')
        }),
        ('CRM Status & Assignment', {
            'fields': ('status', 'assigned_to', 'notes')
        }),
        ('System Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    actions = ['mark_as_contacted', 'mark_as_qualified', 'assign_to_me']

    @admin.action(description='Mark selected leads as Contacted')
    def mark_as_contacted(self, request, queryset):
        rows_updated = queryset.update(status=Lead.StatusChoices.CONTACTED)
        self.message_user(request, f"{rows_updated} leads marked as Contacted.")

    @admin.action(description='Mark selected leads as Qualified')
    def mark_as_qualified(self, request, queryset):
        rows_updated = queryset.update(status=Lead.StatusChoices.QUALIFIED)
        self.message_user(request, f"{rows_updated} leads marked as Qualified.")

    @admin.action(description='Assign selected leads to myself')
    def assign_to_me(self, request, queryset):
        rows_updated = queryset.update(assigned_to=request.user)
        self.message_user(request, f"{rows_updated} leads successfully assigned to you.")
