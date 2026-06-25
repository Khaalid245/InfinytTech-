import re
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from .models import MediaFolder, MediaTag, MediaFile
from .validators import validate_file_extension, validate_file_size, validate_mime_type

User = get_user_model()



class MediaAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'role')


class MediaFolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaFolder
        fields = ('id', 'name', 'slug', 'description', 'parent', 'order', 'is_active', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate(self, attrs):
        parent = attrs.get('parent')
        if parent and self.instance:
            if parent.id == self.instance.id:
                raise serializers.ValidationError({"parent": "A folder cannot be its own parent."})
            
            # Prevent recursive loop
            curr = parent
            while curr:
                if curr.id == self.instance.id:
                    raise serializers.ValidationError({"parent": "Folder hierarchy loop detected."})
                curr = curr.parent
        return attrs


class MediaTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaTag
        fields = ('id', 'name', 'slug', 'color', 'description', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_color(self, value):
        if not re.match(r'^#[0-9A-Fa-f]{6}$', value):
            raise serializers.ValidationError("Color must be a valid hex color code (e.g. #D4A017).")
        return value


class MediaFileSerializer(serializers.ModelSerializer):
    folder_details = MediaFolderSerializer(source='folder', read_only=True)
    tag_details = MediaTagSerializer(source='tags', many=True, read_only=True)
    author_details = MediaAuthorSerializer(source='uploaded_by', read_only=True)

    class Meta:
        model = MediaFile
        fields = (
            'id', 'folder', 'folder_details', 'uploaded_by', 'author_details',
            'title', 'original_filename', 'slug', 'alt_text', 'caption', 'description',
            'file', 'mime_type', 'extension', 'file_size', 'width', 'height',
            'checksum', 'is_public', 'tags', 'tag_details', 'created_at', 'updated_at'
        )
        read_only_fields = (
            'id', 'uploaded_by', 'original_filename', 'slug', 'mime_type', 
            'extension', 'file_size', 'width', 'height', 'checksum', 'created_at', 'updated_at'
        )

    def validate(self, attrs):
        file_obj = attrs.get('file')
        folder = attrs.get('folder', getattr(self.instance, 'folder', None))

        if file_obj:
            filename = file_obj.name
            # Run whitelisting size and extension validators
            try:
                validate_file_extension(file_obj)
                validate_file_size(file_obj)
                validate_mime_type(file_obj, filename)
            except ValidationError as e:
                raise serializers.ValidationError({"file": e.messages})
        elif self.instance:
            filename = self.instance.original_filename
        else:
            filename = None

        if filename:
            # Enforce duplicate filename checks inside the folder scope
            qs = MediaFile.objects.filter(folder=folder, original_filename=filename)
            if self.instance:
                qs = qs.exclude(id=self.instance.id)
            if qs.exists():
                raise serializers.ValidationError(
                    {"file": f"A file named '{filename}' already exists in this folder context."}
                )

        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            validated_data['uploaded_by'] = request.user
        return super().create(validated_data)
