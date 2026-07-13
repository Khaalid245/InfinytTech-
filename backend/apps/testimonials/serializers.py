from rest_framework import serializers
from .models import Client, Testimonial
from apps.media_library.serializers import MediaFileSerializer
from apps.portfolio.serializers import ProjectListSerializer

# ===========================================================================
# Public Serializers
# ===========================================================================

class ClientSerializer(serializers.ModelSerializer):
    company_logo = MediaFileSerializer(read_only=True)

    class Meta:
        model = Client
        fields = [
            'id', 'company_name', 'slug', 'industry', 'website', 
            'company_logo', 'country', 'company_size'
        ]


class TestimonialSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    related_project = ProjectListSerializer(read_only=True)
    author_photo = MediaFileSerializer(read_only=True)

    class Meta:
        model = Testimonial
        fields = [
            'id', 'client', 'related_project', 'author_name', 'author_position', 
            'author_photo', 'testimonial', 'rating', 'featured', 
            'published_at'
        ]


# ===========================================================================
# Admin Serializers
# ===========================================================================

class AdminClientSerializer(serializers.ModelSerializer):
    testimonials_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Client
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'testimonials_count']

    def to_representation(self, instance):
        repr = super().to_representation(instance)
        repr['company_logo'] = MediaFileSerializer(instance.company_logo).data if instance.company_logo else None
        return repr

    def validate_slug(self, value):
        if value:
            # When updating, exclude self from uniqueness check
            qs = Client.objects.filter(slug=value)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError("A client with this slug already exists.")
        return value


class AdminTestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'published_at']

    def to_representation(self, instance):
        repr = super().to_representation(instance)
        repr['client'] = ClientSerializer(instance.client).data if instance.client else None
        repr['author_photo'] = MediaFileSerializer(instance.author_photo).data if instance.author_photo else None
        return repr

    def validate_testimonial(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Testimonial text cannot be empty.")
        return value

    def validate(self, attrs):
        # Validate rating
        rating = attrs.get('rating')
        if rating is not None and not (1 <= rating <= 5):
            raise serializers.ValidationError({"rating": "Rating must be between 1 and 5."})
            
        # Validate duplicates for the same author and client
        author_name = attrs.get('author_name', getattr(self.instance, 'author_name', None))
        client = attrs.get('client', getattr(self.instance, 'client', None))
        
        if author_name and client:
            qs = Testimonial.objects.filter(author_name__iexact=author_name, client=client)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    "A testimonial from this author for this client already exists."
                )
                
        return attrs
