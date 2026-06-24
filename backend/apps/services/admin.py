from django.contrib import admin
from django import forms
from .models import ServiceCategory, Service, ServiceFeature, Industry, ProcessStep, FAQ


class FAQAdminForm(forms.ModelForm):
    answer_bullets_text = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 10, 'cols': 80}),
        required=False,
        help_text="Enter each bullet point on a new line. They will be stored as JSON automatically.",
        label="Answer bullets"
    )

    class Meta:
        model = FAQ
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.answer_bullets:
            if isinstance(self.instance.answer_bullets, list):
                self.initial['answer_bullets_text'] = '\n'.join(self.instance.answer_bullets)
            else:
                self.initial['answer_bullets_text'] = str(self.instance.answer_bullets)

    def clean(self):
        cleaned_data = super().clean()
        bullets_text = cleaned_data.get('answer_bullets_text', '')
        bullets_list = [line.strip() for line in bullets_text.split('\n') if line.strip()]
        cleaned_data['answer_bullets'] = bullets_list
        return cleaned_data


class ProcessStepAdminForm(forms.ModelForm):
    deliverables_text = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 6, 'cols': 80}),
        required=False,
        help_text="Enter each deliverable on a new line.",
        label="Deliverables"
    )
    outcomes_text = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 6, 'cols': 80}),
        required=False,
        help_text="Enter each outcome on a new line.",
        label="Outcomes"
    )

    class Meta:
        model = ProcessStep
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance:
            if self.instance.deliverables and isinstance(self.instance.deliverables, list):
                self.initial['deliverables_text'] = '\n'.join(self.instance.deliverables)
            else:
                self.initial['deliverables_text'] = str(self.instance.deliverables or '')

            if self.instance.outcomes and isinstance(self.instance.outcomes, list):
                self.initial['outcomes_text'] = '\n'.join(self.instance.outcomes)
            else:
                self.initial['outcomes_text'] = str(self.instance.outcomes or '')

    def clean(self):
        cleaned_data = super().clean()
        del_text = cleaned_data.get('deliverables_text', '')
        out_text = cleaned_data.get('outcomes_text', '')
        
        cleaned_data['deliverables'] = [line.strip() for line in del_text.split('\n') if line.strip()]
        cleaned_data['outcomes'] = [line.strip() for line in out_text.split('\n') if line.strip()]
        return cleaned_data


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
    form = ProcessStepAdminForm
    list_display = ('step_number', 'short_title', 'duration', 'is_active', 'order', 'created_at')
    list_editable = ('is_active', 'order')
    search_fields = ('short_title', 'full_title', 'description')
    list_filter = ('is_active',)
    ordering = ('order', 'step_number')
    fields = (
        'step_number', 'short_title', 'full_title', 'description', 
        'icon', 'duration', 'deliverables_text', 'outcomes_text', 
        'is_active', 'order'
    )


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    form = FAQAdminForm
    list_display = ('question', 'is_active', 'order', 'created_at')
    list_editable = ('is_active', 'order')
    search_fields = ('question', 'answer_intro')
    list_filter = ('is_active',)
    ordering = ('order', 'question')
    fields = ('question', 'answer_intro', 'answer_bullets_text', 'answer_outro', 'is_active', 'order')
