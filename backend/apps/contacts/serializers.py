from rest_framework import serializers
from .models import Inquiry


class InquiryCreateSerializer(serializers.ModelSerializer):
    """Used for public form submission — no status field exposed."""
    class Meta:
        model = Inquiry
        fields = ('id', 'full_name', 'email', 'phone', 'subject', 'message')
        read_only_fields = ('id',)


class InquiryAdminSerializer(serializers.ModelSerializer):
    """Full serializer for admin — includes status and timestamps."""
    class Meta:
        model = Inquiry
        fields = ('id', 'full_name', 'email', 'phone', 'subject', 'message', 'status', 'created_at')
        read_only_fields = ('id', 'created_at')
