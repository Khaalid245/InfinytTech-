from django.contrib import admin
from django.utils.html import format_html
from .models import Client, Testimonial

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'logo_preview', 'industry', 'country', 'is_active', 'created_at')
    list_filter = ('is_active', 'country', 'industry')
    search_fields = ('company_name', 'slug', 'industry')
    prepopulated_fields = {'slug': ('company_name',)}
    autocomplete_fields = ['company_logo']
    
    def logo_preview(self, obj):
        if obj.company_logo and obj.company_logo.file:
            return format_html(
                '<img src="{}" style="height: 30px; object-fit: contain; border-radius: 4px;" />',
                obj.company_logo.file.url
            )
        return "No Logo"
    logo_preview.short_description = "Logo"


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = (
        'author_name', 'client', 'rating', 'featured', 
        'status', 'display_order', 'published_at'
    )
    list_filter = ('status', 'featured', 'rating', 'client__industry')
    search_fields = ('author_name', 'testimonial', 'client__company_name')
    autocomplete_fields = ['client', 'related_project', 'author_photo']
    list_editable = ('featured', 'status', 'display_order')
    
    actions = ['publish_testimonials', 'archive_testimonials', 'feature_testimonials', 'unfeature_testimonials']
    
    def publish_testimonials(self, request, queryset):
        # Setting status to PUBLISHED will automatically trigger published_at in the model save()
        # but bulk update does not call save(). So we iterate or set published_at manually if missing.
        from django.utils import timezone
        now = timezone.now()
        for obj in queryset:
            if obj.status != Testimonial.Status.PUBLISHED:
                obj.status = Testimonial.Status.PUBLISHED
                if not obj.published_at:
                    obj.published_at = now
                obj.save(update_fields=['status', 'published_at'])
        self.message_user(request, f"{queryset.count()} testimonials published successfully.")
    publish_testimonials.short_description = "Publish selected testimonials"
    
    def archive_testimonials(self, request, queryset):
        updated = queryset.update(status=Testimonial.Status.ARCHIVED)
        self.message_user(request, f"{updated} testimonials archived successfully.")
    archive_testimonials.short_description = "Archive selected testimonials"

    def feature_testimonials(self, request, queryset):
        updated = queryset.update(featured=True)
        self.message_user(request, f"{updated} testimonials featured.")
    feature_testimonials.short_description = "Feature selected testimonials"

    def unfeature_testimonials(self, request, queryset):
        updated = queryset.update(featured=False)
        self.message_user(request, f"{updated} testimonials removed from featured.")
    unfeature_testimonials.short_description = "Remove featured status"
