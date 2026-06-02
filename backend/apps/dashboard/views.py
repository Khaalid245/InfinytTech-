from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from apps.common.response import api_response
from apps.contacts.models import Inquiry
from apps.portfolio.models import Project
from apps.blog.models import Post
from apps.testimonials.models import Testimonial


class DashboardOverviewView(APIView):
    """
    Single aggregation endpoint for the executive overview dashboard.
    Uses .count() queries — no full dataset loading.
    Returns recent slices (5 items) for activity panels.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        # ── Counts (cheap DB queries) ──────────────────────────────────────────
        inquiry_total = Inquiry.objects.count()
        inquiry_new   = Inquiry.objects.filter(status=Inquiry.Status.NEW).count()

        project_total    = Project.objects.count()
        project_featured = Project.objects.filter(is_featured=True).count()

        post_published = Post.objects.filter(status=Post.Status.PUBLISHED).count()
        post_drafts    = Post.objects.filter(status=Post.Status.DRAFT).count()

        testimonial_total = Testimonial.objects.count()

        # ── Recent inquiries (latest 5) ────────────────────────────────────────
        recent_inquiries = list(
            Inquiry.objects.order_by('-created_at').values(
                'id', 'full_name', 'email', 'company',
                'service_interest', 'status', 'created_at',
            )[:5]
        )
        # Serialize datetime to ISO string
        for item in recent_inquiries:
            item['created_at'] = item['created_at'].isoformat()

        # ── Recent posts (latest 5 by created_at) ─────────────────────────────
        recent_posts = list(
            Post.objects.select_related('category')
            .order_by('-created_at')
            .values(
                'id', 'title', 'slug', 'status',
                'category__name', 'category__slug',
                'published_at', 'created_at',
            )[:5]
        )
        for item in recent_posts:
            if item['created_at']:
                item['created_at'] = item['created_at'].isoformat()
            if item['published_at']:
                item['published_at'] = item['published_at'].isoformat()
            # Reshape category into nested object
            item['category'] = (
                {'name': item.pop('category__name'), 'slug': item.pop('category__slug')}
                if item.get('category__name') else None
            )
            if 'category__name' in item: item.pop('category__name', None)
            if 'category__slug' in item: item.pop('category__slug', None)

        return api_response(data={
            'inquiries': {
                'total': inquiry_total,
                'new':   inquiry_new,
            },
            'projects': {
                'total':    project_total,
                'featured': project_featured,
            },
            'posts': {
                'published': post_published,
                'drafts':    post_drafts,
            },
            'testimonials': {
                'total': testimonial_total,
            },
            'recent_inquiries': recent_inquiries,
            'recent_posts':     recent_posts,
        })
