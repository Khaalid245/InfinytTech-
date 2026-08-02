from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.throttling import AnonRateThrottle
from drf_spectacular.utils import extend_schema
import logging

from django.conf import settings as django_settings
from django.utils import timezone
from django.db.models import Count, Q
from django.db.models.functions import TruncMonth

from apps.core.response import api_response
from apps.core.services import EmailService
from apps.accounts.permissions import IsAdminOrSuperAdmin
from apps.site_settings.services import get_active_site_settings
from .models import Lead, LeadTimeline
from .serializers import LeadCreateSerializer, LeadAdminSerializer
from apps.team.views import ApiResponseMixin
from apps.core.pagination import StandardPagination

logger = logging.getLogger(__name__)


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
        lead = serializer.save()
        
        LeadTimeline.objects.create(
            lead=lead,
            action='CREATED',
            description='Lead created from public contact form.',
            created_by=None
        )

        # ---------------------------------------------------------------
        # Dispatch emails — failures are logged but NEVER block lead creation
        # ---------------------------------------------------------------
        site = get_active_site_settings()
        submitted_at = timezone.now().strftime("%d %b %Y • %I:%M %p UTC")
        frontend_url = getattr(django_settings, 'FRONTEND_URL', 'http://localhost:5173')
        admin_lead_url = None
        if lead.pk:
            admin_lead_url = f"{getattr(django_settings, 'FRONTEND_URL', 'http://localhost:5173')}/admin/leads/{lead.pk}"

        # Email #1 — Customer Confirmation
        try:
            confirmation_result = EmailService.send_template_email(
                subject=f"Thank You for Contacting {site.company_name if site else 'Us'}!",
                template_name='emails/contact_confirmation.html',
                recipient_list=[lead.email],
                context={
                    'lead': lead,
                    'submitted_at': submitted_at,
                    'portfolio_url': f"{frontend_url}/portfolio",
                    'office_phone': site.phone if site else None,
                },
            )
            if not confirmation_result.success:
                logger.warning(
                    'Lead %s: customer confirmation email failed — %s',
                    lead.pk, confirmation_result.error
                )
        except Exception:
            logger.exception('Lead %s: unexpected error sending customer confirmation email.', lead.pk)

        # Email #2 — Internal Notification (sales_email → primary_email fallback)
        try:
            internal_recipient = None
            if site:
                internal_recipient = site.sales_email or site.primary_email
            if internal_recipient:
                notification_result = EmailService.send_template_email(
                    subject=f"New Contact Form Submission — {lead.first_name} {lead.last_name}",
                    template_name='emails/contact_notification.html',
                    recipient_list=[internal_recipient],
                    context={
                        'lead': lead,
                        'submitted_at': submitted_at,
                        'admin_lead_url': admin_lead_url,
                    },
                )
                if not notification_result.success:
                    logger.warning(
                        'Lead %s: internal notification email failed — %s',
                        lead.pk, notification_result.error
                    )
            else:
                logger.warning('Lead %s: no sales_email or primary_email configured — skipping internal notification.', lead.pk)
        except Exception:
            logger.exception('Lead %s: unexpected error sending internal notification email.', lead.pk)

        return api_response(
            data=serializer.data,
            message='Lead successfully submitted. Our team will contact you shortly.',
            status=status.HTTP_201_CREATED
        )


@extend_schema(tags=['Leads — Admin'])
class LeadAdminViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    """
    Administrative ViewSet for Lead Management.
    Enforces super_admin and admin roles only.
    Excludes POST and PUT requests to restrict manual creation via admin REST API.
    """
    queryset = Lead.objects.all().select_related('assigned_to').prefetch_related('services', 'timeline', 'timeline__created_by')
    serializer_class = LeadAdminSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]
    pagination_class = StandardPagination
    http_method_names = ['get', 'patch', 'delete', 'options', 'head', 'post']
    
    filterset_fields = ['status', 'priority', 'assigned_to', 'source']
    search_fields = ['first_name', 'last_name', 'company', 'email', 'phone']
    ordering_fields = ['created_at', 'updated_at', 'priority']

    def perform_update(self, serializer):
        original = self.get_object()
        instance = serializer.save()
        user = self.request.user
        
        # Track status change
        if original.status != instance.status:
            LeadTimeline.objects.create(
                lead=instance,
                action='STATUS_CHANGED',
                description=f"Status changed from '{original.get_status_display()}' to '{instance.get_status_display()}'.",
                created_by=user
            )
            
        # Track assignment change
        if original.assigned_to != instance.assigned_to:
            new_assignee = instance.assigned_to.email if instance.assigned_to else "Unassigned"
            LeadTimeline.objects.create(
                lead=instance,
                action='ASSIGNED',
                description=f"Assigned to {new_assignee}.",
                created_by=user
            )
            
        # Track notes added
        if instance.notes and original.notes != instance.notes:
            LeadTimeline.objects.create(
                lead=instance,
                action='NOTE_ADDED',
                description="Internal notes were updated.",
                created_by=user
            )

    @extend_schema(request=None)
    @action(detail=False, methods=['post'], url_path='bulk-update')
    def bulk_update_leads(self, request):
        """Bulk update status or assignment for multiple leads."""
        lead_ids = request.data.get('lead_ids', [])
        status_val = request.data.get('status')
        assigned_to = request.data.get('assigned_to')
        
        if not lead_ids:
            return api_response(status=status.HTTP_400_BAD_REQUEST, message="No lead IDs provided.")
            
        leads = Lead.objects.filter(id__in=lead_ids)
        updated_count = 0
        
        for lead in leads:
            changed = False
            if status_val and lead.status != status_val:
                old_status = lead.get_status_display()
                lead.status = status_val
                changed = True
                LeadTimeline.objects.create(
                    lead=lead, action='STATUS_CHANGED',
                    description=f"Bulk updated status from '{old_status}' to '{lead.get_status_display()}'.",
                    created_by=request.user
                )
            if assigned_to is not None and str(lead.assigned_to_id) != str(assigned_to):
                lead.assigned_to_id = assigned_to or None
                changed = True
                new_assignee = lead.assigned_to.email if lead.assigned_to else "Unassigned"
                LeadTimeline.objects.create(
                    lead=lead, action='ASSIGNED',
                    description=f"Bulk assigned to {new_assignee}.",
                    created_by=request.user
                )
            if changed:
                lead.save(update_fields=['status', 'assigned_to_id', 'updated_at'])
                updated_count += 1
                
        return api_response(message=f"Successfully updated {updated_count} leads.")

    @extend_schema(request=None)
    @action(detail=False, methods=['post'], url_path='bulk-delete')
    def bulk_delete_leads(self, request):
        """Bulk delete multiple leads."""
        lead_ids = request.data.get('lead_ids', [])
        if not lead_ids:
            return api_response(status=status.HTTP_400_BAD_REQUEST, message="No lead IDs provided.")
            
        count, _ = Lead.objects.filter(id__in=lead_ids).delete()
        return api_response(message=f"Successfully deleted {count} leads.")

    @extend_schema(request=None)
    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Dashboard KPI cards and chart data."""
        qs = Lead.objects.all()
        now = timezone.now()
        
        # KPIs
        total_leads = qs.count()
        new_leads = qs.filter(status=Lead.StatusChoices.NEW).count()
        contacted = qs.filter(status=Lead.StatusChoices.CONTACTED).count()
        qualified = qs.filter(status=Lead.StatusChoices.QUALIFIED).count()
        proposals = qs.filter(status=Lead.StatusChoices.PROPOSAL_SENT).count()
        won = qs.filter(status=Lead.StatusChoices.WON).count()
        lost = qs.filter(status=Lead.StatusChoices.LOST).count()
        
        conversion_rate = (won / total_leads * 100) if total_leads > 0 else 0
        
        # Source Distribution
        sources = qs.values('source').annotate(count=Count('id')).order_by('-count')
        
        # Monthly Trends (last 6 months)
        six_months_ago = now - timezone.timedelta(days=180)
        monthly = qs.filter(created_at__gte=six_months_ago).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(count=Count('id')).order_by('month')
        
        return api_response(data={
            'kpis': {
                'total': total_leads,
                'new': new_leads,
                'contacted': contacted,
                'qualified': qualified,
                'proposals': proposals,
                'won': won,
                'lost': lost,
                'conversion_rate': round(conversion_rate, 1)
            },
            'sources': list(sources),
            'monthly': [
                {'month': m['month'].strftime('%b %Y'), 'leads': m['count']} for m in monthly
            ],
            'funnel': [
                {'name': 'New Leads', 'value': total_leads},
                {'name': 'Contacted', 'value': contacted + qualified + proposals + won + lost},
                {'name': 'Qualified', 'value': qualified + proposals + won + lost},
                {'name': 'Proposals', 'value': proposals + won + lost},
                {'name': 'Won', 'value': won},
            ]
        })
