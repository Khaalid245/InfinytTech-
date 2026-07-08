from django.contrib import admin
from django.utils.html import format_html
from .models import Department, TeamMember


# ===========================================================================
# Department Admin
# ===========================================================================

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'display_order', 'is_active', 'created_at')
    list_editable = ('display_order', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'slug', 'description')
    list_filter = ('is_active',)
    ordering = ('display_order', 'name')

    fieldsets = (
        ('Department Details', {
            'fields': ('name', 'slug', 'description')
        }),
        ('Visibility & Ordering', {
            'fields': ('display_order', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    readonly_fields = ('created_at', 'updated_at')


# ===========================================================================
# Team Member Admin
# ===========================================================================

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = (
        'photo_preview',
        'full_name',
        'position',
        'department',
        'is_featured',
        'is_active',
        'display_order',
    )
    list_editable = ('is_featured', 'is_active', 'display_order')
    prepopulated_fields = {'slug': ('first_name', 'last_name')}
    search_fields = ('first_name', 'last_name', 'position')
    list_filter = ('department', 'is_active', 'is_featured')
    ordering = ('display_order', 'last_name', 'first_name')
    autocomplete_fields = ('department',)
    readonly_fields = ('photo_preview', 'created_at', 'updated_at')

    fieldsets = (
        ('Identity', {
            'fields': ('first_name', 'last_name', 'slug', 'position', 'department')
        }),
        ('Photo', {
            'fields': ('photo', 'photo_preview')
        }),
        ('Biography', {
            'fields': ('short_bio', 'biography')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone')
        }),
        ('Social & Web Links', {
            'fields': ('linkedin_url', 'github_url', 'twitter_url', 'website_url'),
            'classes': ('collapse',),
        }),
        ('Professional Details', {
            'fields': ('years_of_experience', 'skills')
        }),
        ('Visibility & Ordering', {
            'fields': ('display_order', 'is_featured', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    actions = [
        'activate_members',
        'deactivate_members',
        'mark_featured',
        'remove_featured',
    ]

    # ------------------------------------------------------------------
    # Custom display methods
    # ------------------------------------------------------------------

    def photo_preview(self, obj):
        """Render a thumbnail if a photo MediaFile is linked."""
        if obj.photo and obj.photo.file:
            return format_html(
                '<img src="{}" style="max-height:48px; max-width:48px; '
                'border-radius:6px; border:1px solid #E2E8F0;" />',
                obj.photo.file.url
            )
        return format_html('<span style="color:#9CA3AF;">No photo</span>')

    photo_preview.short_description = 'Photo'

    # ------------------------------------------------------------------
    # Bulk actions
    # ------------------------------------------------------------------

    @admin.action(description='Activate selected team members')
    def activate_members(self, request, queryset):
        count = queryset.update(is_active=True)
        self.message_user(request, f'{count} team member(s) activated.')

    @admin.action(description='Deactivate selected team members')
    def deactivate_members(self, request, queryset):
        count = queryset.update(is_active=False)
        self.message_user(request, f'{count} team member(s) deactivated.')

    @admin.action(description='Mark selected members as Featured')
    def mark_featured(self, request, queryset):
        count = queryset.update(is_featured=True)
        self.message_user(request, f'{count} team member(s) marked as featured.')

    @admin.action(description='Remove Featured flag from selected members')
    def remove_featured(self, request, queryset):
        count = queryset.update(is_featured=False)
        self.message_user(request, f'{count} team member(s) removed from featured.')
