from rest_framework import serializers
from apps.services.serializers import ServiceSerializer
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)
    service_id = serializers.PrimaryKeyRelatedField(
        source='service',
        queryset=__import__('apps.services.models', fromlist=['Service']).Service.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Project
        fields = (
            'id', 'title', 'slug', 'description', 'thumbnail',
            'service', 'service_id', 'client_name', 'project_url',
            'is_featured', 'created_at',
        )
        read_only_fields = ('id', 'created_at')
