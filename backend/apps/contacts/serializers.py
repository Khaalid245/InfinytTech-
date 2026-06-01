from rest_framework import serializers
from .models import Inquiry


class InquiryCreateSerializer(serializers.ModelSerializer):
    """Public form submission — maps frontend field names to model fields."""
    name = serializers.CharField(source='full_name', max_length=150)
    service = serializers.CharField(source='service_interest', max_length=100, required=False, allow_blank=True)

    class Meta:
        model = Inquiry
        fields = ('id', 'name', 'email', 'company', 'service', 'message')
        read_only_fields = ('id',)


class InquiryAdminSerializer(serializers.ModelSerializer):
    """Full serializer for admin — all fields, internal naming."""
    class Meta:
        model = Inquiry
        fields = (
            'id', 'full_name', 'email', 'phone', 'company',
            'service_interest', 'subject', 'message', 'status', 'created_at',
        )
        read_only_fields = ('id', 'created_at')
