from rest_framework import serializers
from apps.services.serializers import ServiceSerializer
from apps.services.models import Service
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)
    service_id = serializers.PrimaryKeyRelatedField(
        source='service',
        queryset=Service.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            'id', 'title', 'slug', 'tag', 'description', 'key_metric',
            'thumbnail', 'service', 'service_id', 'client_name',
            'project_url', 'is_featured', 'order', 'created_at',
        )
        read_only_fields = ('id', 'created_at')

    def get_thumbnail(self, obj):
        if not obj.thumbnail:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(obj.thumbnail.url) if request else obj.thumbnail.url
