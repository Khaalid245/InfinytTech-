import sys
import django
from django.db import connection
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta

# Import all models needed for aggregation
from apps.portfolio.models import Project, ProjectCategory
from apps.services.models import Service, ServiceCategory
from apps.blog.models import BlogPost, BlogCategory, BlogTag
from apps.team.models import TeamMember, Department
from apps.testimonials.models import Testimonial
from apps.media_library.models import MediaFile
from apps.leads.models import Lead
from apps.site_settings.models import SiteSettings, OfficeLocation, SocialLink
from apps.accounts.models import User

class DashboardService:
    @staticmethod
    def get_overview_metrics():
        return {
            'portfolio': {
                'total_projects': Project.objects.count(),
                'published': Project.objects.filter(status=Project.Status.PUBLISHED).count(),
                'drafts': Project.objects.filter(status=Project.Status.DRAFT).count(),
                'featured': Project.objects.filter(is_featured=True).count(),
            },
            'services': {
                'total_services': Service.objects.count(),
                'categories': ServiceCategory.objects.count(),
            },
            'blog': {
                'total_posts': BlogPost.objects.count(),
                'published': BlogPost.objects.filter(status=BlogPost.StatusChoices.PUBLISHED).count(),
                'drafts': BlogPost.objects.filter(status=BlogPost.StatusChoices.DRAFT).count(),
                'categories': BlogCategory.objects.count(),
                'tags': BlogTag.objects.count(),
            },
            'team': {
                'total_members': TeamMember.objects.count(),
                'departments': Department.objects.count(),
            },
            'testimonials': {
                'total_testimonials': Testimonial.objects.count(),
                'featured': Testimonial.objects.filter(featured=True).count(),
            },
            'media': {
                'total_files': MediaFile.objects.count(),
                'images': MediaFile.objects.filter(mime_type__startswith='image/').exclude(mime_type='image/svg+xml').count(),
                'svgs': MediaFile.objects.filter(mime_type='image/svg+xml').count(),
                'storage_used': MediaFile.objects.aggregate(total=Sum('file_size'))['total'] or 0,
            },
            'leads': {
                'total_leads': Lead.objects.count(),
                'new': Lead.objects.filter(status=Lead.StatusChoices.NEW).count(),
                'contacted': Lead.objects.filter(status=Lead.StatusChoices.CONTACTED).count(),
                'qualified': Lead.objects.filter(status=Lead.StatusChoices.QUALIFIED).count(),
                'proposal_sent': Lead.objects.filter(status=Lead.StatusChoices.PROPOSAL_SENT).count(),
                'negotiation': Lead.objects.filter(status=Lead.StatusChoices.NEGOTIATION).count(),
                'won': Lead.objects.filter(status=Lead.StatusChoices.WON).count(),
                'lost': Lead.objects.filter(status=Lead.StatusChoices.LOST).count(),
            },
            'site_settings': {
                'active_config': SiteSettings.objects.filter(is_active=True).count(),
                'office_locations': OfficeLocation.objects.count(),
                'social_links': SocialLink.objects.count(),
            }
        }

    @staticmethod
    def get_recent_activity():
        return {
            'recent_leads': list(Lead.objects.order_by('-created_at')[:5].values('id', 'first_name', 'last_name', 'email', 'status', 'created_at')),
            'recent_posts': list(BlogPost.objects.order_by('-created_at')[:5].values('id', 'title', 'status', 'created_at')),
            'recent_projects': list(Project.objects.order_by('-created_at')[:5].values('id', 'title', 'status', 'created_at')),
            'recent_media': list(MediaFile.objects.order_by('-created_at')[:5].values('id', 'title', 'mime_type', 'created_at')),
            'recent_team': list(TeamMember.objects.order_by('-created_at')[:5].values('id', 'first_name', 'last_name', 'created_at')),
        }

    @staticmethod
    def get_lead_analytics():
        today = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = today - timedelta(days=today.weekday())
        month_start = today.replace(day=1)

        # Status distribution
        status_distribution = list(Lead.objects.values('status').annotate(count=Count('id')))
        
        # Source distribution
        source_distribution = list(Lead.objects.values('source').annotate(count=Count('id')))

        return {
            'leads_today': Lead.objects.filter(created_at__gte=today).count(),
            'leads_this_week': Lead.objects.filter(created_at__gte=week_start).count(),
            'leads_this_month': Lead.objects.filter(created_at__gte=month_start).count(),
            'status_distribution': {item['status']: item['count'] for item in status_distribution},
            'source_distribution': {item['source'] or 'Unknown': item['count'] for item in source_distribution},
        }

    @staticmethod
    def get_content_health():
        return {
            'projects_without_image': Project.objects.filter(Q(featured_image__isnull=True) | Q(featured_image='')).count(),
            'blog_posts_missing_seo': BlogPost.objects.filter(Q(seo_title='') | Q(seo_description='') | Q(seo_title__isnull=True) | Q(seo_description__isnull=True)).count(),
            'services_without_features': Service.objects.annotate(feature_count=Count('features')).filter(feature_count=0).count(),
            'testimonials_without_logo': Testimonial.objects.filter(client__company_logo__isnull=True).count(),
            'inactive_social_links': SocialLink.objects.filter(is_active=False).count(),
            'missing_office_locations': 1 if OfficeLocation.objects.count() == 0 else 0,
        }

    @staticmethod
    def get_media_health():
        # Check unused media using related objects
        unused_count = 0
        all_media = MediaFile.objects.all()
        # To avoid N+1 and complexity, we can do a comprehensive exclusion
        # but dynamically checking is robust for a dashboard overview.
        # A more optimal way:
        for media in all_media:
            has_usage = False
            for related_object in media._meta.related_objects:
                accessor = related_object.get_accessor_name()
                if hasattr(media, accessor):
                    manager = getattr(media, accessor)
                    if hasattr(manager, 'exists') and manager.exists():
                        has_usage = True
                        break
                    elif hasattr(manager, 'pk') and manager.pk: # OneToOne fields
                        has_usage = True
                        break
            if not has_usage:
                unused_count += 1

        largest_files = list(MediaFile.objects.order_by('-file_size')[:5].values('id', 'title', 'file_size', 'mime_type'))
        
        return {
            'unused_media_count': unused_count,
            'largest_files': largest_files,
            'missing_alt_text': MediaFile.objects.filter(Q(alt_text='') | Q(alt_text__isnull=True)).count(),
            'public_assets': MediaFile.objects.filter(is_public=True).count(),
            'private_assets': MediaFile.objects.filter(is_public=False).count(),
        }

    @staticmethod
    def get_system_health():
        db_status = 'Healthy'
        try:
            connection.ensure_connection()
        except Exception:
            db_status = 'Unreachable'

        from django.db.migrations.executor import MigrationExecutor
        try:
            executor = MigrationExecutor(connection)
            pending_migrations = len(executor.migration_plan(executor.loader.graph.leaf_nodes()))
            migration_status = 'Up to date' if pending_migrations == 0 else f'{pending_migrations} pending'
        except Exception:
            migration_status = 'Unknown'

        return {
            'database_connection': db_status,
            'migration_status': migration_status,
            'application_version': '1.0.0', # Hardcoded as per standard setup if env isn't used
            'python_version': sys.version.split(' ')[0],
            'django_version': django.get_version(),
        }

    @classmethod
    def get_full_dashboard(cls):
        return {
            'overview': cls.get_overview_metrics(),
            'recent_activity': cls.get_recent_activity(),
            'lead_analytics': cls.get_lead_analytics(),
            'content_health': cls.get_content_health(),
            'media_health': cls.get_media_health(),
            'system_health': cls.get_system_health(),
        }
