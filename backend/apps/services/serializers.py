from rest_framework import serializers
from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ('id', 'title', 'slug', 'description', 'icon', 'is_active', 'order', 'created_at')
        read_only_fields = ('id', 'created_at')
