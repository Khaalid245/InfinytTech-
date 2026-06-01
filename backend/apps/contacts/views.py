from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.generics import get_object_or_404
from apps.common.response import api_response
from .models import Inquiry
from .serializers import InquiryCreateSerializer, InquiryAdminSerializer


class InquiryCreateView(APIView):
    """Public endpoint — anyone can submit a contact form."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = InquiryCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(message='Your message has been received. We will be in touch soon.', status=201)


class InquiryAdminListView(APIView):
    """Admin only — list and filter inquiries."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = Inquiry.objects.all()
        status_filter = request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return api_response(data=InquiryAdminSerializer(qs, many=True).data)


class InquiryAdminDetailView(APIView):
    """Admin only — view and update inquiry status."""
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        inquiry = get_object_or_404(Inquiry, pk=pk)
        return api_response(data=InquiryAdminSerializer(inquiry).data)

    def put(self, request, pk):
        inquiry = get_object_or_404(Inquiry, pk=pk)
        serializer = InquiryAdminSerializer(inquiry, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(data=serializer.data, message='Inquiry updated.')
