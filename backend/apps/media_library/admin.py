from django import forms
from django.contrib import admin
from django.utils.html import format_html
from django.shortcuts import render
from django.http import HttpResponseRedirect
from .models import MediaFolder, MediaTag, MediaFile


# ===========================================================================
# Forms and Actions for Bulk Management
# ===========================================================================

class MoveFolderForm(forms.Form):
    _selected_action = forms.CharField(widget=forms.MultipleHiddenInput)
    folder = forms.ModelChoiceField(
        queryset=MediaFolder.objects.filter(is_active=True), 
        required=False, 
        label="Destination Folder", 
        empty_label="[Root Folder]"
    )


def move_folder_action(modeladmin, request, queryset):
    """
    Bulk action to move files to a selected folder.
    """
    form = None
    if 'apply' in request.POST:
        form = MoveFolderForm(request.POST)
        if form.is_valid():
            folder = form.cleaned_data['folder']
            count = queryset.count()
            queryset.update(folder=folder)
            modeladmin.message_user(request, f"Successfully moved {count} files to {folder or '[Root]'}.")
            return HttpResponseRedirect(request.get_full_path())
    
    if not form:
        form = MoveFolderForm(initial={
            '_selected_action': request.POST.getlist(admin.ACTION_CHECKBOX_NAME)
        })
        
    return render(request, 'admin/media_library/move_folder.html', {
        'items': queryset,
        'form': form,
        'title': 'Move Selected Files to Folder',
        'opts': modeladmin.model._meta,
    })

move_folder_action.short_description = "Move selected files to folder"


# ===========================================================================
# Custom Filters
# ===========================================================================

class FileTypeFilter(admin.SimpleListFilter):
    title = 'File Type'
    parameter_name = 'file_type'

    def lookups(self, request, model_admin):
        return (
            ('image', 'Images'),
            ('document', 'Documents (PDF)'),
            ('other', 'Other Files'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'image':
            return queryset.filter(mime_type__startswith='image/')
        if self.value() == 'document':
            return queryset.filter(mime_type='application/pdf')
        if self.value() == 'other':
            return queryset.exclude(mime_type__startswith='image/').exclude(mime_type='application/pdf')
        return queryset


# ===========================================================================
# Model Admin Classes
# ===========================================================================

@admin.register(MediaFolder)
class MediaFolderAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'parent', 'order', 'is_active', 'created_at')
    list_editable = ('order', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')
    list_filter = ('is_active', 'parent')
    ordering = ('order', 'name')


@admin.register(MediaTag)
class MediaTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'color', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(MediaFile)
class MediaFileAdmin(admin.ModelAdmin):
    list_display = (
        'thumbnail_preview', 'original_filename', 'title', 'file_size_display', 
        'dimensions_display', 'mime_type', 'folder', 'uploaded_by', 'is_public', 'created_at'
    )
    list_filter = (
        'folder', FileTypeFilter, 'is_public', 'uploaded_by', 'created_at'
    )
    list_editable = ('is_public', 'folder')
    search_fields = ('title', 'original_filename', 'alt_text', 'caption', 'description')
    autocomplete_fields = ('folder', 'uploaded_by')
    filter_horizontal = ('tags',)
    readonly_fields = (
        'original_filename', 'mime_type', 'extension', 'file_size', 
        'width', 'height', 'checksum', 'uploaded_by', 'created_at', 'updated_at'
    )
    actions = [move_folder_action, 'make_public', 'make_private']

    fieldsets = (
        ('Media Upload', {
            'fields': ('file', 'original_filename')
        }),
        ('Taxonomy & Organization', {
            'fields': ('folder', 'tags')
        }),
        ('Display Metadata', {
            'fields': ('title', 'slug', 'alt_text', 'caption', 'description')
        }),
        ('Visibility Settings', {
            'fields': ('is_public', 'uploaded_by')
        }),
        ('File Extraction Data', {
            'fields': ('mime_type', 'extension', 'file_size', 'width', 'height', 'checksum'),
            'classes': ('collapse',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    def thumbnail_preview(self, obj):
        if not obj.file:
            return "No File"
        if obj.extension in ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']:
            return format_html(
                '<img src="{}" style="max-height: 40px; max-width: 40px; border-radius: 4px; border: 1px solid #E2E8F0;" />', 
                obj.file.url
            )
        if obj.extension == 'pdf':
            return format_html('<span style="font-size: 20px; line-height: 40px;">📄</span>')
        return format_html('<span style="font-size: 20px; line-height: 40px;">📁</span>')
    
    thumbnail_preview.short_description = 'Preview'

    def file_size_display(self, obj):
        if obj.file_size < 1024:
            return f"{obj.file_size} B"
        if obj.file_size < 1024 * 1024:
            return f"{obj.file_size / 1024:.1f} KB"
        return f"{obj.file_size / (1024 * 1024):.1f} MB"
    
    file_size_display.short_description = 'Size'

    def dimensions_display(self, obj):
        if obj.width and obj.height:
            return f"{obj.width} × {obj.height}"
        return "—"
    
    dimensions_display.short_description = 'Dimensions'

    def save_model(self, request, obj, form, change):
        if not change:
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)

    # Pre-defined bulk actions
    @admin.action(description="Make selected files public")
    def make_public(self, request, queryset):
        queryset.update(is_public=True)
        self.message_user(request, "Selected files are now public.")

    @admin.action(description="Make selected files private")
    def make_private(self, request, queryset):
        queryset.update(is_public=False)
        self.message_user(request, "Selected files are now private.")
