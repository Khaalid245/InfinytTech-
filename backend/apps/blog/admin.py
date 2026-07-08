import uuid
from django.contrib import admin
from django.contrib.admin.widgets import AutocompleteSelect
from .models import BlogCategory, BlogTag, BlogPost


class SafeAutocompleteSelect(AutocompleteSelect):
    def optgroups(self, name, value, attrs=None):
        sanitized_value = []
        for val in value:
            if val:
                try:
                    uuid.UUID(str(val))
                    sanitized_value.append(val)
                except ValueError:
                    # Ignore invalid UUID values to prevent database filter crash
                    pass
        return super().optgroups(name, sanitized_value, attrs)


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'order', 'created_at')
    list_editable = ('is_active', 'order')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')
    list_filter = ('is_active',)
    ordering = ('order', 'name')


@admin.register(BlogTag)
class BlogTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'is_featured', 'reading_time', 'published_at')
    list_editable = ('status', 'category', 'is_featured')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'excerpt', 'content')
    list_filter = ('status', 'is_featured', 'category', 'tags', 'published_at')
    autocomplete_fields = ('author', 'category')
    filter_horizontal = ('tags',)
    readonly_fields = ('reading_time', 'published_at', 'created_at', 'updated_at')

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        formfield = super().formfield_for_foreignkey(db_field, request, **kwargs)
        if db_field.name in ['author', 'category'] and formfield and isinstance(formfield.widget, AutocompleteSelect):
            formfield.widget = SafeAutocompleteSelect(
                formfield.widget.field,
                formfield.widget.admin_site,
                attrs=formfield.widget.attrs,
                choices=formfield.widget.choices,
                using=formfield.widget.db
            )
        return formfield

    fieldsets = (
        ('Article Details', {
            'fields': ('title', 'slug', 'author', 'category', 'tags')
        }),
        ('Content Body', {
            'fields': ('excerpt', 'content', 'featured_image')
        }),
        ('Publish Status & Promoted Content', {
            'fields': ('status', 'is_featured', 'published_at')
        }),
        ('SEO Meta Overrides', {
            'fields': ('seo_title', 'seo_description')
        }),
        ('System Metadata', {
            'fields': ('reading_time', 'created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    actions = ['make_published', 'make_draft']

    @admin.action(description='Publish selected blog posts')
    def make_published(self, request, queryset):
        rows_updated = 0
        for post in queryset:
            if post.status != BlogPost.StatusChoices.PUBLISHED:
                post.status = BlogPost.StatusChoices.PUBLISHED
                post.save()
                rows_updated += 1
        self.message_user(request, f"{rows_updated} posts successfully published.")

    @admin.action(description='Revert selected posts to Draft')
    def make_draft(self, request, queryset):
        rows_updated = 0
        for post in queryset:
            if post.status != BlogPost.StatusChoices.DRAFT:
                post.status = BlogPost.StatusChoices.DRAFT
                post.save()
                rows_updated += 1
        self.message_user(request, f"{rows_updated} posts reverted to Draft.")
