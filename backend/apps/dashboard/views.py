from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.accounts.permissions import IsAdminOrSuperAdmin
from .services import DashboardService

class DashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]

    def get(self, request, *args, **kwargs):
        data = DashboardService.get_full_dashboard()
        return Response(data)
