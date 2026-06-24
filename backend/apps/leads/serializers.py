from rest_framework import serializers
from .models import Lead


class LeadCreateSerializer(serializers.ModelSerializer):
    """
    Public lead submission serializer.
    Only exposes input fields required for contact form submission.
    """
    class Meta:
        model = Lead
        fields = (
            'id', 'first_name', 'last_name', 'email', 'phone', 
            'company', 'country', 'project_type', 'budget_range', 
            'message', 'source', 'created_at'
        )
        read_only_fields = ('id', 'created_at')

    def validate_email(self, value):
        # Perform basic email validation (can be expanded if needed)
        if not value:
            raise serializers.ValidationError("Email is required.")
        return value.lower()


class LeadAdminSerializer(serializers.ModelSerializer):
    """
    Full Lead serializer for Admin CRUD operations.
    Includes status workflow management, staff assignments, and internal notes.
    """
    assigned_to_email = serializers.EmailField(source='assigned_to.email', read_only=True)

    class Meta:
        model = Lead
        fields = (
            'id', 'first_name', 'last_name', 'email', 'phone', 
            'company', 'country', 'project_type', 'budget_range', 
            'message', 'source', 'status', 'assigned_to', 
            'assigned_to_email', 'notes', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'assigned_to_email')
