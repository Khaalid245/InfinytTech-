from django.contrib import admin
from .models import ServiceCategory, Service, ServiceFeature, Industry, ProcessStep, FAQ


class ServiceFeatureInline(admin.TabularInline):
    model = ServiceFeature
    extra = 1
    fields = ('title', 'description', 'is_active', 'order')
    ordering = ('order', 'title')


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'order', 'created_at')
    list_editable = ('is_active', 'order')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')
    list_filter = ('is_active',)
    ordering = ('order', 'name')


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'slug', 'is_active', 'order', 'created_at')
    list_editable = ('is_active', 'order')
    list_filter = ('category', 'is_active')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ServiceFeatureInline]
    ordering = ('order', 'title')


@admin.register(ServiceFeature)
class ServiceFeatureAdmin(admin.ModelAdmin):
    list_display = ('title', 'service', 'is_active', 'order', 'created_at')
    list_editable = ('is_active', 'order')
    list_filter = ('service', 'is_active')
    search_fields = ('title', 'description')
    ordering = ('service', 'order', 'title')


@admin.register(Industry)
class IndustryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'order', 'created_at')
    list_editable = ('is_active', 'order')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')
    list_filter = ('is_active',)
    ordering = ('order', 'name')


@admin.register(ProcessStep)
class ProcessStepAdmin(admin.ModelAdmin):
    list_display = ('step_number', 'short_title', 'duration', 'is_active', 'order', 'created_at')
    list_editable = ('is_active', 'order')
    search_fields = ('short_title', 'full_title', 'description')
    list_filter = ('is_active',)
    ordering = ('order', 'step_number')


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'is_active', 'order', 'created_at')
    list_editable = ('is_active', 'order')
    search_fields = ('question', 'answer_intro')
    list_filter = ('is_active',)
    ordering = ('order', 'question')
