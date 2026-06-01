from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.generics import get_object_or_404
from apps.common.response import api_response, api_error
from .models import Project
from .serializers import ProjectSerializer


class ProjectListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        qs = Project.objects.select_related('service').all()
        if request.query_params.get('featured'):
            qs = qs.filter(is_featured=True)
        if request.query_params.get('tag'):
            qs = qs.filter(tag__iexact=request.query_params['tag'])
        serializer = ProjectSerializer(qs, many=True, context={'request': request})
        return api_response(data=serializer.data)

    def post(self, request):
        if not request.user.is_staff:
            return api_error('Permission denied.', status=403)
        serializer = ProjectSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Project created.', status=201)


class ProjectDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, slug):
        return get_object_or_404(Project, slug=slug)

    def get(self, request, slug):
        serializer = ProjectSerializer(self.get_object(slug), context={'request': request})
        return api_response(data=serializer.data)

    def put(self, request, slug):
        if not request.user.is_staff:
            return api_error('Permission denied.', status=403)
        serializer = ProjectSerializer(
            self.get_object(slug), data=request.data,
            partial=True, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Project updated.')

    def delete(self, request, slug):
        if not request.user.is_staff:
            return api_error('Permission denied.', status=403)
        self.get_object(slug).delete()
        return api_response(message='Project deleted.')
