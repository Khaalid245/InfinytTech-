from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.generics import get_object_or_404
from apps.common.response import api_response, api_error
from .models import Service
from .serializers import ServiceSerializer


class ServiceListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        services = Service.objects.filter(is_active=True)
        return api_response(data=ServiceSerializer(services, many=True).data)

    def post(self, request):
        if not request.user.is_staff:
            return api_error('Permission denied.', status=403)
        serializer = ServiceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Service created.', status=201)


class ServiceDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, slug):
        return get_object_or_404(Service, slug=slug)

    def get(self, request, slug):
        return api_response(data=ServiceSerializer(self.get_object(slug)).data)

    def put(self, request, slug):
        if not request.user.is_staff:
            return api_error('Permission denied.', status=403)
        serializer = ServiceSerializer(self.get_object(slug), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Service updated.')

    def delete(self, request, slug):
        if not request.user.is_staff:
            return api_error('Permission denied.', status=403)
        self.get_object(slug).delete()
        return api_response(message='Service deleted.')
