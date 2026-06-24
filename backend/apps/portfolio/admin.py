from django.contrib import admin
from django.utils.html import format_html
from .models import ProjectCategory, Technology, ProjectTag, Project, ProjectImage, ProjectMetric


# ---------------------------------------------------------------------------
# Inlines
# ---------------------------------------------------------------------------

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ('image', 'caption', 'display_order')
    ordering = ('display_order',)
    readonly_fields = ('created_at',)


class ProjectMetricInline(admin.TabularInline):
    model = ProjectMetric
    extra = 1
    fields = ('metric_value', 'metric_label', 'display_order')
    ordering = ('display_order',)
    readonly_fields = ('created_at',)


# ---------------------------------------------------------------------------
# Model Admins
# ---------------------------------------------------------------------------

@admin.register(ProjectCategory)
class ProjectCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'project_count', 'created_at')
    list_filter = ('is_active',)
    list_editable = ('is_active',)
    search_fields = ('name', 'slug', 'description')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)
    readonly_fields = ('id', 'created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('id', 'name', 'slug', 'description', 'is_active'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    @admin.display(description='Projects')
    def project_count(self, obj):
        return obj.projects.count()


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon_name', 'is_active', 'project_count', 'created_at')
    list_filter = ('is_active',)
    list_editable = ('is_active',)
    search_fields = ('name', 'slug', 'icon_name')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)
    readonly_fields = ('id', 'created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('id', 'name', 'slug', 'icon_name', 'is_active'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    @admin.display(description='Projects')
    def project_count(self, obj):
        return obj.projects.count()


@admin.register(ProjectTag)
class ProjectTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'project_count', 'created_at')
    list_filter = ('is_active',)
    list_editable = ('is_active',)
    search_fields = ('name', 'slug', 'description')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)
    readonly_fields = ('id', 'created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('id', 'name', 'slug', 'description', 'is_active'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    @admin.display(description='Projects')
    def project_count(self, obj):
        return obj.projects.count()


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'category', 'status', 'is_featured',
        'client_name', 'tech_list', 'tag_list', 'created_at',
    )
    list_filter = ('status', 'is_featured', 'category', 'technologies', 'tags')
    list_editable = ('status', 'is_featured')
    search_fields = ('title', 'slug', 'client_name', 'short_description', 'meta_title')
    prepopulated_fields = {'slug': ('title',)}
    ordering = ('-created_at',)
    filter_horizontal = ('technologies', 'tags')
    readonly_fields = ('id', 'created_at', 'updated_at', 'featured_image_preview')
    inlines = [ProjectImageInline, ProjectMetricInline]

    fieldsets = (
        ('Core Information', {
            'fields': ('id', 'title', 'slug', 'short_description', 'full_description'),
        }),
        ('Media', {
            'fields': ('featured_image', 'featured_image_preview'),
        }),
        ('Project Details', {
            'fields': ('client_name', 'project_url', 'status', 'is_featured'),
        }),
        ('Taxonomy', {
            'fields': ('category', 'technologies', 'tags'),
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    @admin.display(description='Technologies')
    def tech_list(self, obj):
        names = [t.name for t in obj.technologies.all()[:4]]
        if obj.technologies.count() > 4:
            names.append('...')
        return ', '.join(names) if names else '-'

    @admin.display(description='Tags')
    def tag_list(self, obj):
        names = [t.name for t in obj.tags.all()[:4]]
        if obj.tags.count() > 4:
            names.append('...')
        return ', '.join(names) if names else '-'

    @admin.display(description='Featured Image Preview')
    def featured_image_preview(self, obj):
        if obj.featured_image:
            return format_html(
                '<img src="{}" style="max-height:120px; border-radius:4px;" />',
                obj.featured_image.url,
            )
        return '—'


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ('project', 'caption', 'display_order', 'created_at')
    list_filter = ('project',)
    search_fields = ('project__title', 'caption')
    ordering = ('project', 'display_order')
    readonly_fields = ('id', 'created_at', 'updated_at')


@admin.register(ProjectMetric)
class ProjectMetricAdmin(admin.ModelAdmin):
    list_display = ('project', 'metric_value', 'metric_label', 'display_order', 'created_at')
    list_filter = ('project',)
    search_fields = ('project__title', 'metric_label', 'metric_value')
    ordering = ('project', 'display_order')
    readonly_fields = ('id', 'created_at', 'updated_at')
