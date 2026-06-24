from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.throttling import AnonRateThrottle
from drf_spectacular.utils import extend_schema

from apps.core.response import api_response
from apps.accounts.permissions import IsAdminOrSuperAdmin
from .models import Lead
from .serializers import LeadCreateSerializer, LeadAdminSerializer


class LeadSubmissionRateThrottle(AnonRateThrottle):
    """
    Dedicated throttle limit for anonymous lead submissions.
    Restricts to 10 submissions per hour from a single IP to prevent script spam.
    """
    rate = '10/hour'


@extend_schema(tags=['Leads — Public'])
class LeadSubmitView(APIView):
    """
    Public endpoint for contact/lead creation.
    Open to all visitors.
    """
    permission_classes = [permissions.AllowAny]
    throttle_classes = [LeadSubmissionRateThrottle]

    @extend_schema(
        summary='Submit contact form / lead request',
        request=LeadCreateSerializer,
        responses={201: LeadCreateSerializer}
    )
    def post(self, request):
        serializer = LeadCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(
            data=serializer.data,
            message='Lead successfully submitted. Our team will contact you shortly.',
            status=status.HTTP_201_CREATED
        )


@extend_schema(tags=['Leads — Admin'])
class LeadAdminViewSet(viewsets.ModelViewSet):
    """
    Administrative ViewSet for Lead Management.
    Enforces super_admin and admin roles only.
    Excludes POST and PUT requests to restrict manual creation via admin REST API.
    """
    queryset = Lead.objects.all().select_related('assigned_to')
    serializer_class = LeadAdminSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]
    http_method_names = ['get', 'patch', 'delete', 'options', 'head']
