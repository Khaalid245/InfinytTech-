from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.generics import get_object_or_404
from apps.common.response import api_response, api_error
from .models import Testimonial
from .serializers import TestimonialSerializer


class TestimonialListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Testimonial.objects.filter(is_active=True)
        serializer = TestimonialSerializer(qs, many=True, context={'request': request})
        return api_response(data=serializer.data)

    def post(self, request):
        if not request.user.is_staff:
            return api_error('Permission denied.', status=403)
        serializer = TestimonialSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Testimonial created.', status=201)


class TestimonialDetailView(APIView):
    permission_classes = [AllowAny]

    def get_object(self, pk):
        return get_object_or_404(Testimonial, pk=pk, is_active=True)

    def put(self, request, pk):
        if not request.user.is_staff:
            return api_error('Permission denied.', status=403)
        serializer = TestimonialSerializer(
            get_object_or_404(Testimonial, pk=pk),
            data=request.data, partial=True,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Testimonial updated.')

    def delete(self, request, pk):
        if not request.user.is_staff:
            return api_error('Permission denied.', status=403)
        get_object_or_404(Testimonial, pk=pk).delete()
        return api_response(message='Testimonial deleted.')
