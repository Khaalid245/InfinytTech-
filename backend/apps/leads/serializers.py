from rest_framework import serializers
from apps.services.models import Service
from .models import Lead, LeadTimeline


class LeadCreateSerializer(serializers.ModelSerializer):
    """
    Public lead submission serializer.
    Only exposes input fields required for contact form submission.
    """
    class Meta:
        model = Lead
        fields = (
            'id', 'first_name', 'last_name', 'email', 'phone', 'whatsapp',
            'company', 'industry', 'website', 'company_size',
            'country', 'project_type', 'budget_range', 
            'message', 'source', 'services', 'created_at'
        )
        read_only_fields = ('id', 'created_at')

    def validate_email(self, value):
        # Perform basic email validation (can be expanded if needed)
        if not value:
            raise serializers.ValidationError("Email is required.")
        return value.lower()


class LeadTimelineSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = LeadTimeline
        fields = ('id', 'action', 'description', 'created_by_name', 'created_at')
        read_only_fields = ('id', 'created_at')

    def get_created_by_name(self, obj):
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}".strip() or obj.created_by.email
        return "System"


class LeadAdminSerializer(serializers.ModelSerializer):
    """
    Full Lead serializer for Admin CRUD operations.
    Includes status workflow management, staff assignments, and internal notes.
    """
    assigned_to_email = serializers.EmailField(source='assigned_to.email', read_only=True)
    assigned_to_name = serializers.SerializerMethodField(read_only=True)
    timeline = LeadTimelineSerializer(many=True, read_only=True)
    services = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Service.objects.all(),
        required=False
    )

    class Meta:
        model = Lead
        fields = (
            'id', 'first_name', 'last_name', 'email', 'phone', 'whatsapp',
            'company', 'industry', 'website', 'company_size',
            'country', 'project_type', 'budget_range', 
            'message', 'source', 'status', 'priority', 'assigned_to', 
            'assigned_to_email', 'assigned_to_name', 'services',
            'notes', 'timeline', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'assigned_to_email', 'assigned_to_name', 'timeline')

    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return f"{obj.assigned_to.first_name} {obj.assigned_to.last_name}".strip() or obj.assigned_to.email
        return None
