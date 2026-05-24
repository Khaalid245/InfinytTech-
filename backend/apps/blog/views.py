from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.generics import get_object_or_404
from apps.common.response import api_response, api_error
from .models import Post, Category
from .serializers import PostListSerializer, PostDetailSerializer, CategorySerializer


class PostListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        qs = Post.objects.select_related('author', 'category').filter(status=Post.Status.PUBLISHED)
        if request.query_params.get('category'):
            qs = qs.filter(category__slug=request.query_params['category'])
        return api_response(data=PostListSerializer(qs, many=True).data)

    def post(self, request):
        if not request.user.is_staff:
            return api_error('Permission denied.', status=403)
        serializer = PostDetailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)
        return api_response(data=serializer.data, message='Post created.', status=201)


class PostDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, slug):
        return get_object_or_404(Post, slug=slug, status=Post.Status.PUBLISHED)

    def get_admin_object(self, slug):
        return get_object_or_404(Post, slug=slug)

    def get(self, request, slug):
        return api_response(data=PostDetailSerializer(self.get_object(slug)).data)

    def put(self, request, slug):
        if not request.user.is_staff:
            return api_error('Permission denied.', status=403)
        serializer = PostDetailSerializer(self.get_admin_object(slug), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Post updated.')

    def delete(self, request, slug):
        if not request.user.is_staff:
            return api_error('Permission denied.', status=403)
        self.get_admin_object(slug).delete()
        return api_response(message='Post deleted.')


class CategoryListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        return api_response(data=CategorySerializer(Category.objects.all(), many=True).data)

    def post(self, request):
        if not request.user.is_staff:
            return api_error('Permission denied.', status=403)
        serializer = CategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Category created.', status=201)
