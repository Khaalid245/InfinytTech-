from rest_framework import serializers
from .models import Department, TeamMember


# ---------------------------------------------------------------------------
# Department
# ---------------------------------------------------------------------------

class DepartmentSerializer(serializers.ModelSerializer):
    """Full serializer for Department — used in public and admin contexts."""

    members_count = serializers.IntegerField(read_only=True, required=False)

    class Meta:
        model = Department
        fields = (
            'id', 'name', 'slug', 'description',
            'display_order', 'is_active', 'members_count', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'members_count')

    def validate_slug(self, value):
        qs = Department.objects.filter(slug=value)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        if qs.exists():
            raise serializers.ValidationError('A department with this slug already exists.')
        return value

    def validate_display_order(self, value):
        if value < 0:
            raise serializers.ValidationError('Display order must be a non-negative integer.')
        return value


# ---------------------------------------------------------------------------
# Nested photo reference (read-only, React-ready)
# ---------------------------------------------------------------------------

class TeamMemberPhotoSerializer(serializers.Serializer):
    """Lightweight read-only representation of a MediaFile photo."""
    id = serializers.UUIDField(read_only=True)
    title = serializers.CharField(read_only=True)
    file = serializers.FileField(read_only=True)
    alt_text = serializers.CharField(read_only=True)
    width = serializers.IntegerField(read_only=True)
    height = serializers.IntegerField(read_only=True)


# ---------------------------------------------------------------------------
# Public — List (card/grid view)
# ---------------------------------------------------------------------------

class TeamMemberListSerializer(serializers.ModelSerializer):
    """
    Compact read-only serializer for list endpoints.
    Returns enough data to render team member cards without the full biography.
    """
    department = DepartmentSerializer(read_only=True)
    photo = TeamMemberPhotoSerializer(read_only=True)
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = TeamMember
        fields = (
            'id', 'full_name', 'first_name', 'last_name', 'slug',
            'position', 'department', 'photo', 'short_bio',
            'linkedin_url', 'github_url', 'twitter_url', 'website_url',
            'years_of_experience', 'skills',
            'is_featured', 'display_order', 'created_at'
        )
        read_only_fields = fields


# ---------------------------------------------------------------------------
# Public — Detail (full profile)
# ---------------------------------------------------------------------------

class TeamMemberDetailSerializer(serializers.ModelSerializer):
    """
    Complete read-only serializer for the public profile / detail endpoint.
    Includes biography and all contact / social fields.
    """
    department = DepartmentSerializer(read_only=True)
    photo = TeamMemberPhotoSerializer(read_only=True)
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = TeamMember
        fields = (
            'id', 'full_name', 'first_name', 'last_name', 'slug',
            'position', 'department', 'photo',
            'short_bio', 'biography',
            'email', 'phone',
            'linkedin_url', 'github_url', 'twitter_url', 'website_url',
            'years_of_experience', 'skills',
            'is_featured', 'is_active', 'display_order',
            'created_at', 'updated_at'
        )
        read_only_fields = fields


# ---------------------------------------------------------------------------
# Admin — Full writable serializer
# ---------------------------------------------------------------------------

class AdminTeamMemberSerializer(serializers.ModelSerializer):
    """
    Full writable serializer for admin CRUD operations.
    Accepts photo as a FK UUID, returns nested photo data on read.
    """
    photo_details = TeamMemberPhotoSerializer(source='photo', read_only=True)
    department_details = DepartmentSerializer(source='department', read_only=True)
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = TeamMember
        fields = (
            'id', 'full_name',
            'first_name', 'last_name', 'slug',
            'position', 'department', 'department_details',
            'photo', 'photo_details',
            'short_bio', 'biography',
            'email', 'phone',
            'linkedin_url', 'github_url', 'twitter_url', 'website_url',
            'years_of_experience', 'skills',
            'display_order', 'is_featured', 'is_active',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'full_name', 'created_at', 'updated_at',
                            'photo_details', 'department_details')

    def to_representation(self, instance):
        repr = super().to_representation(instance)
        # Map IDs back to full objects for frontend compatibility
        repr['department'] = DepartmentSerializer(instance.department).data if instance.department else None
        repr['photo'] = TeamMemberPhotoSerializer(instance.photo).data if instance.photo else None
        return repr

    # ------------------------------------------------------------------
    # Field-level validation
    # ------------------------------------------------------------------

    def validate_slug(self, value):
        qs = TeamMember.objects.filter(slug=value)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        if qs.exists():
            raise serializers.ValidationError('A team member with this slug already exists.')
        return value

    def validate_email(self, value):
        if not value:
            return value
        qs = TeamMember.objects.filter(email=value)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        if qs.exists():
            raise serializers.ValidationError('A team member with this email already exists.')
        return value

    def validate_display_order(self, value):
        if value < 0:
            raise serializers.ValidationError('Display order must be a non-negative integer.')
        return value

    def _validate_url_field(self, value, field_name):
        """Reusable URL pattern check (URLField handles structure; this adds extra guard)."""
        if value and not (value.startswith('http://') or value.startswith('https://')):
            raise serializers.ValidationError(
                f'{field_name} must be a valid URL starting with http:// or https://.'
            )
        return value

    def validate_linkedin_url(self, value):
        return self._validate_url_field(value, 'LinkedIn URL')

    def validate_github_url(self, value):
        return self._validate_url_field(value, 'GitHub URL')

    def validate_twitter_url(self, value):
        return self._validate_url_field(value, 'Twitter/X URL')

    def validate_website_url(self, value):
        return self._validate_url_field(value, 'Website URL')

    def validate_photo(self, value):
        """Ensure the referenced MediaFile exists and is an image."""
        if value is None:
            return value
        allowed_extensions = {'jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'}
        if hasattr(value, 'extension') and value.extension not in allowed_extensions:
            raise serializers.ValidationError(
                'The selected media file is not a supported image type (jpg, png, webp, gif, svg).'
            )
        return value

    def validate_skills(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('Skills must be a JSON array of strings.')
        for item in value:
            if not isinstance(item, str):
                raise serializers.ValidationError('Each skill must be a string.')
        return value
