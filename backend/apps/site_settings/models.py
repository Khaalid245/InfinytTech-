import hashlib
import base64
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from apps.core.models import UUIDModel, TimeStampedModel
from apps.media_library.models import MediaFile
from apps.site_settings.constants import PasswordPolicy
from cryptography.fernet import Fernet

def get_fernet():
    key = hashlib.sha256(settings.SECRET_KEY.encode()).digest()
    return Fernet(base64.urlsafe_b64encode(key))


def get_default_core_values():
    return [
        {
            'id': '01',
            'title': 'Excellence',
            'desc': 'We hold ourselves to the highest standards, ensuring every solution we deliver is durable, reliable, and crafted with meticulous attention to detail.',
            'icon': 'Award',
        },
        {
            'id': '02',
            'title': 'Ownership',
            'desc': 'We approach every project with the mindset of a founder, taking full responsibility for the outcomes and long-term success of the partners we serve.',
            'icon': 'ShieldCheck',
        },
        {
            'id': '03',
            'title': 'Transparency',
            'desc': 'We build trust through honest, open, and clear communication, keeping our partners fully aligned and informed at every stage.',
            'icon': 'Globe',
        },
        {
            'id': '04',
            'title': 'Innovation',
            'desc': 'We challenge conventional approaches and continuously seek better ways to solve meaningful problems.',
            'icon': 'Sparkles',
        },
        {
            'id': '05',
            'title': 'Collaboration',
            'desc': 'We work as an extension of your team, aligning our goals with yours to build strong, unified partnerships that amplify our collective impact.',
            'icon': 'Users',
        },
        {
            'id': '06',
            'title': 'Continuous Learning',
            'desc': 'We remain perpetually curious, constantly expanding our knowledge and adapting to new paradigms to deliver future-ready solutions.',
            'icon': 'BookOpen',
        },
    ]


def get_default_differentiators():
    return [
        {
            'icon': 'Target',
            'stat': 'Business-First',
            'title': 'Business-First Thinking',
            'description': 'Every technical decision is evaluated against business goals, helping organizations invest in technology that creates measurable value.',
        },
        {
            'icon': 'BadgeCheck',
            'stat': 'Product Ownership',
            'title': 'Product Ownership',
            'description': 'We go beyond implementation by identifying risks, uncovering opportunities, and helping shape stronger product decisions.',
        },
        {
            'icon': 'MessageSquare',
            'stat': 'Transparency',
            'title': 'Transparent Communication',
            'description': 'Clear milestones, regular updates, and open collaboration ensure complete visibility throughout the engagement.',
        },
        {
            'icon': 'ShieldCheck',
            'stat': 'Quality Engineering',
            'title': 'Quality Engineering',
            'description': 'Built with maintainability, performance, security, and scalability to support long-term business growth.',
        },
        {
            'icon': 'Handshake',
            'stat': 'Partnership',
            'title': 'Long-Term Partnership',
            'description': 'Our relationship continues after launch through optimization, support, and strategic guidance as products evolve.',
        },
        {
            'icon': 'Globe',
            'stat': 'Standards',
            'title': 'Global Standards',
            'description': 'We apply internationally recognized engineering practices and delivery standards to every project we undertake.',
        },
    ]


def get_default_about_hero_metrics():
    return [
        {'val': 'Top 1.5%', 'label': 'Elite Developer Select'},
        {'val': 'Silicon Valley', 'label': 'Standards Workflow'},
        {'val': 'Sovereign', 'label': 'Scale Infrastructure'},
    ]


def get_default_about_manifesto():
    return [
        {'title': 'Built in Africa', 'desc': "Powered by the continent's top technical minds."},
        {'title': 'Designed for the World', 'desc': 'Engineered to compete in Palo Alto, London, and Tokyo.'},
        {'title': 'Business First', 'desc': 'Delivering measurable commercial impact, not just lines of code.'},
        {'title': 'Engineering Excellence', 'desc': 'Strict compilation audits and zero technical debt guarantees.'},
        {'title': 'Long-Term Partnership', 'desc': 'Committed to active scaling, cloud support, and lasting SLAs.'},
    ]


def get_default_cta_timeline_steps():
    return [
        {'num': '1', 'title': 'Discovery Call', 'desc': 'We learn about your goals, requirements, and timeline.'},
        {'num': '2', 'title': 'Product Assessment', 'desc': 'Our team evaluates scope, technical requirements, and opportunities.'},
        {'num': '3', 'title': 'Roadmap & Proposal', 'desc': 'Receive a clear plan, timeline, and project estimate.'},
        {'num': '4', 'title': 'Build & Scale', 'desc': 'Engineering scalable systems with continuous optimization and growth.'},
    ]


def get_default_cta_trust_points():
    return [
        'Secure cloud deployments',
        'Clear project roadmap',
        'Dedicated product team',
        'Long-term support available',
    ]


def get_default_portfolio_hero_trust_items():
    return [
        'Enterprise Engineering',
        'Scalable Architecture',
        'Modern Technology Stack',
        'Long-Term Partnership',
    ]


class SiteSettings(UUIDModel, TimeStampedModel):
    """
    Singleton model containing global settings for the InfinytTech platform.
    """
    is_active = models.BooleanField(default=True, help_text="Designates this configuration as the active one.")
    
    # General Settings
    company_name = models.CharField(max_length=255, default="InfinytTech")
    company_tagline = models.CharField(max_length=255, blank=True)
    company_description = models.TextField(blank=True)
    company_timezone = models.CharField(max_length=100, default='UTC')
    default_language = models.CharField(max_length=10, default='en')
    default_currency = models.CharField(max_length=10, default='USD')
    founded_year = models.PositiveIntegerField(null=True, blank=True)

    # Branding (Foreign Keys to MediaLibrary)
    primary_logo = models.ForeignKey(MediaFile, on_delete=models.SET_NULL, null=True, blank=True, related_name='primary_logo_settings')
    secondary_logo = models.ForeignKey(MediaFile, on_delete=models.SET_NULL, null=True, blank=True, related_name='secondary_logo_settings')
    dark_logo = models.ForeignKey(MediaFile, on_delete=models.SET_NULL, null=True, blank=True, related_name='dark_logo_settings')
    light_logo = models.ForeignKey(MediaFile, on_delete=models.SET_NULL, null=True, blank=True, related_name='light_logo_settings')
    favicon = models.ForeignKey(MediaFile, on_delete=models.SET_NULL, null=True, blank=True, related_name='favicon_settings')
    open_graph_image = models.ForeignKey(MediaFile, on_delete=models.SET_NULL, null=True, blank=True, related_name='og_image_settings')
    apple_touch_icon = models.ForeignKey(MediaFile, on_delete=models.SET_NULL, null=True, blank=True, related_name='apple_icon_settings')
    loading_logo = models.ForeignKey(MediaFile, on_delete=models.SET_NULL, null=True, blank=True, related_name='loading_logo_settings')
    brand_colors = models.JSONField(default=dict, blank=True, help_text="e.g. {'primary': '#ff0000', 'secondary': '#00ff00'}")

    # Contact
    primary_email = models.EmailField(blank=True)
    support_email = models.EmailField(blank=True)
    sales_email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    whatsapp = models.CharField(max_length=50, blank=True)
    office_address = models.TextField(blank=True)
    google_maps_url = models.URLField(max_length=500, blank=True)
    business_hours = models.TextField(blank=True)

    # SEO
    default_meta_title = models.CharField(max_length=255, blank=True)
    default_meta_description = models.TextField(blank=True)
    default_keywords = models.TextField(blank=True, help_text="Comma-separated keywords")
    canonical_url = models.URLField(max_length=500, blank=True)
    robots_index = models.BooleanField(default=True)
    robots_follow = models.BooleanField(default=True)
    open_graph_title = models.CharField(max_length=255, blank=True)
    open_graph_description = models.TextField(blank=True)
    twitter_card_type = models.CharField(max_length=50, default='summary_large_image', choices=[('summary', 'Summary'), ('summary_large_image', 'Summary Large Image')])

    # Email / SMTP
    smtp_provider = models.CharField(max_length=100, blank=True, default='Custom')
    smtp_host = models.CharField(max_length=255, blank=True)
    smtp_port = models.PositiveIntegerField(null=True, blank=True)
    smtp_username = models.CharField(max_length=255, blank=True)
    _smtp_password = models.CharField(max_length=500, blank=True, db_column='smtp_password')
    smtp_encryption = models.CharField(max_length=20, default='tls', choices=[('none', 'None'), ('ssl', 'SSL'), ('tls', 'TLS')])
    smtp_sender_name = models.CharField(max_length=255, blank=True)
    smtp_sender_email = models.EmailField(blank=True)

    # Email Test Status (lightweight monitoring – Phase 21.5E)
    # Full email log table belongs to Phase 21.6.
    EMAIL_TEST_STATUS_CHOICES = [
        ('not_tested', 'Not Tested'),
        ('success', 'Operational'),
        ('error', 'Error'),
    ]
    email_last_test_status = models.CharField(
        max_length=20, choices=EMAIL_TEST_STATUS_CHOICES,
        default='not_tested', blank=True,
    )
    email_last_test_at = models.DateTimeField(null=True, blank=True)
    email_last_test_recipient = models.EmailField(blank=True)
    email_last_failure_at = models.DateTimeField(null=True, blank=True)
    email_last_failure_reason = models.CharField(max_length=500, blank=True)


    # Security
    password_policy = models.CharField(max_length=255, choices=PasswordPolicy.choices, default=PasswordPolicy.STRICT)
    session_timeout = models.PositiveIntegerField(
        default=1440,
        help_text='In minutes. Minimum 1 minute.',
        validators=[MinValueValidator(1)]
    )
    max_login_attempts = models.PositiveIntegerField(
        default=5,
        validators=[MinValueValidator(1)]
    )
    lockout_duration = models.PositiveIntegerField(
        default=15,
        help_text='In minutes',
        validators=[MinValueValidator(1)]
    )
    two_factor_auth_enabled = models.BooleanField(default=False)
    allowed_origins = models.TextField(blank=True, help_text="Comma-separated domains for CORS")
    api_token_expiration = models.PositiveIntegerField(default=30, help_text='In days')

    # Rate Limiting
    rate_limiting_enabled = models.BooleanField(
        default=True,
        help_text='Enable API rate limiting globally. Disable only for debugging.'
    )
    login_rate_limit = models.PositiveIntegerField(
        default=10,
        help_text='Maximum login attempts per minute per IP address.',
        validators=[MinValueValidator(1)]
    )
    api_rate_limit = models.PositiveIntegerField(
        default=300,
        help_text='Maximum API requests per minute per authenticated user.',
        validators=[MinValueValidator(1)]
    )


    # Hero Section
    hero_title = models.CharField(max_length=255, blank=True)
    hero_subtitle = models.TextField(blank=True)
    hero_primary_button_text = models.CharField(max_length=50, blank=True)
    hero_primary_button_url = models.CharField(max_length=255, blank=True)
    hero_secondary_button_text = models.CharField(max_length=50, blank=True)
    hero_secondary_button_url = models.CharField(max_length=255, blank=True)

    # Business Statistics
    completed_projects = models.PositiveIntegerField(default=0)
    happy_clients = models.PositiveIntegerField(default=0)
    countries_served = models.PositiveIntegerField(default=0)
    years_experience = models.PositiveIntegerField(default=0)

    # Mission, Vision & Core Values
    mission_title = models.CharField(max_length=255, default="Our Mission", blank=True)
    mission_statement = models.TextField(
        default="To help startups, businesses, and organizations build scalable digital products through modern engineering, AI innovation, and world-class technology solutions.",
        blank=True
    )
    vision_title = models.CharField(max_length=255, default="Our Vision", blank=True)
    vision_statement = models.TextField(
        default="To become Africa's most trusted technology partner, connecting world-class engineering talent with organizations building the future.",
        blank=True
    )
    core_values = models.JSONField(
        default=get_default_core_values,
        blank=True,
        help_text="List of core values [{id: '01', title: '...', desc: '...', icon: 'Award'}]"
    )

    # Why Choose Us / What Makes Us Different
    why_choose_us_title = models.CharField(max_length=255, default="What Makes Us Different", blank=True)
    why_choose_us_subtitle = models.CharField(max_length=255, blank=True)
    differentiators = models.JSONField(
        default=get_default_differentiators,
        blank=True,
        help_text="List of differentiator cards [{stat: '...', title: '...', description: '...', icon: 'Target'}]"
    )

    # About Page Hero & Manifesto
    about_hero_badge = models.CharField(max_length=100, default="LET'S BUILD TOGETHER", blank=True)
    about_hero_title = models.CharField(max_length=255, default="Building the Future of Digital Innovation from Africa.", blank=True)
    about_hero_description = models.TextField(
        default="We partner with ambitious startups, enterprises, and organizations to design, engineer, and scale world-class digital products.",
        blank=True
    )
    about_hero_metrics = models.JSONField(
        default=get_default_about_hero_metrics,
        blank=True,
        help_text="List of metrics [{val: 'Top 1.5%', label: 'Elite Developer Select'}]"
    )
    about_manifesto = models.JSONField(
        default=get_default_about_manifesto,
        blank=True,
        help_text="List of manifesto items [{title: '...', desc: '...'}]"
    )

    # About Page Story ("Bridging Tech Corridors")
    about_story_badge = models.CharField(max_length=100, default="Our Story", blank=True)
    about_story_title = models.CharField(max_length=255, default="Bridging Tech Corridors", blank=True)
    about_story_lead = models.TextField(
        default="We believe world-class technology talent exists everywhere. Yet too many organizations struggle to access reliable engineering partners capable of turning ambitious ideas into scalable digital products.",
        blank=True
    )
    about_story_paragraph_1 = models.TextField(
        default="InfinytTech was founded to bridge that gap. We unite highly disciplined, self-starting developers with international networks, breaking down traditional Silicon Valley corridors to unlock global engineering capacity.",
        blank=True
    )
    about_story_paragraph_2 = models.TextField(
        default="By combining strict quality standards, modern development workflows, and a philosophy of long-term partnership, we deliver production-ready SaaS platforms, machine learning systems, and complex product architectures directly to enterprises worldwide on time.",
        blank=True
    )
    about_story_symbol = models.CharField(max_length=20, default="∞", blank=True)

    # Interactive CTA & Partnership Section ("Ready to Work With a Long-Term Technology Partner?")
    cta_badge = models.CharField(max_length=100, default="LET'S BUILD TOGETHER", blank=True)
    cta_title = models.CharField(max_length=255, default="Ready to Work With a Long-Term Technology Partner?", blank=True)
    cta_description = models.TextField(
        default="We partner with ambitious startups, businesses, and organizations to transform ideas into scalable digital products through strategy, engineering, and long-term collaboration.",
        blank=True
    )
    cta_primary_btn_text = models.CharField(max_length=100, default="Book a Free Discovery Call", blank=True)
    cta_primary_btn_note = models.CharField(max_length=255, default="No commitment required — we'll discuss your goals and recommend a path forward.", blank=True)
    cta_secondary_btn_text = models.CharField(max_length=100, default="or send us a project brief →", blank=True)
    cta_secondary_btn_url = models.CharField(max_length=255, default="/contact", blank=True)
    cta_timeline_title = models.CharField(max_length=255, default="How We Start Every Partnership", blank=True)
    cta_timeline_subtitle = models.CharField(max_length=255, default="Our structured path from initial outreach to product scale.", blank=True)
    cta_timeline_steps = models.JSONField(
        default=get_default_cta_timeline_steps,
        blank=True,
        help_text="List of timeline steps [{num: '1', title: '...', desc: '...'}]"
    )
    cta_trust_points = models.JSONField(
        default=get_default_cta_trust_points,
        blank=True,
        help_text="List of trust points/checklist items ['...', '...']"
    )

    # Portfolio Page Hero Section
    portfolio_hero_badge = models.CharField(max_length=100, default="OUR WORK", blank=True)
    portfolio_hero_title = models.CharField(max_length=255, default="Products Built For Real Business Growth.", blank=True)
    portfolio_hero_subtitle = models.TextField(
        default="Explore selected digital products, platforms, and technology solutions designed to help startups, businesses, and organizations scale with confidence.",
        blank=True
    )
    portfolio_hero_primary_btn_text = models.CharField(max_length=100, default="View Projects", blank=True)
    portfolio_hero_secondary_btn_text = models.CharField(max_length=100, default="Start Your Project", blank=True)
    portfolio_hero_secondary_btn_url = models.CharField(max_length=255, default="/contact", blank=True)
    portfolio_hero_trust_items = models.JSONField(
        default=get_default_portfolio_hero_trust_items,
        blank=True,
        help_text="List of trust items displayed below the hero buttons ['...', '...']"
    )

    # Portfolio Featured Projects Section Header
    portfolio_featured_badge = models.CharField(max_length=100, default="FEATURED PROJECTS", blank=True)
    portfolio_featured_title = models.CharField(max_length=255, default="Solutions Designed To Solve Real Problems.", blank=True)
    portfolio_featured_subtitle = models.TextField(
        default="A selection of products and platforms built to improve operations, customer experiences, and business growth.",
        blank=True
    )

    # Services / Capabilities Explorer Section Header
    services_badge = models.CharField(max_length=100, default="OUR SERVICE OFFERINGS", blank=True)
    services_title = models.CharField(max_length=255, default="How We Help Businesses Build, Scale, and Innovate", blank=True)
    services_subtitle = models.TextField(
        default="Choose a capability below to see what we build, the business impact we deliver, and how a typical engagement works.",
        blank=True
    )

    # Technology Stack Section Header
    tech_stack_badge = models.CharField(max_length=100, default="Technology Stack", blank=True)
    tech_stack_title = models.CharField(max_length=255, default="Tools We Trust to Build and Scale", blank=True)
    tech_stack_subtitle = models.TextField(
        default="We use proven technologies, modern frameworks, and scalable infrastructure to build reliable digital products for startups, businesses, and growing organizations.",
        blank=True
    )

    # Industries We Serve Section Header & Banner
    industries_badge = models.CharField(max_length=100, default="OUR INDUSTRIES", blank=True)
    industries_title = models.CharField(max_length=255, default="Technology Solutions Across Every Industry", blank=True)
    industries_subtitle = models.TextField(
        default="We partner with startups, enterprises, and organizations to design, build, and scale digital products that solve real business challenges across diverse industries.",
        blank=True
    )
    industries_quote = models.TextField(
        default="From a healthcare startup to an enterprise logistics platform — our process adapts, our standards don't.",
        blank=True
    )
    industries_cta_title = models.CharField(max_length=255, default="Don't see your industry?", blank=True)
    industries_cta_subtitle = models.TextField(
        default="Our team builds custom digital solutions for organizations of all sizes.",
        blank=True
    )
    industries_cta_btn_text = models.CharField(max_length=100, default="Explore Our Services", blank=True)

    # Delivery Process Section Header
    process_badge = models.CharField(max_length=100, default="Our Delivery Process", blank=True)
    process_title = models.CharField(max_length=255, default="From Idea to Product. A Transparent Process.", blank=True)
    process_subtitle = models.TextField(
        default="Every successful product follows a structured process designed for clarity, quality, speed, and long-term business success.",
        blank=True
    )

    # Footer
    footer_description = models.TextField(blank=True)
    copyright_text = models.CharField(max_length=255, blank=True)
    newsletter_title = models.CharField(max_length=255, blank=True)
    newsletter_description = models.TextField(blank=True)

    # System
    maintenance_mode = models.BooleanField(default=False)
    analytics_enabled = models.BooleanField(default=True)

    class Meta:
        db_table = 'site_settings'
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return f"{self.company_name} Settings ({'Active' if self.is_active else 'Inactive'})"

    @property
    def smtp_password(self):
        if not self._smtp_password:
            return ""
        try:
            return get_fernet().decrypt(self._smtp_password.encode()).decode()
        except Exception:
            return ""

    @smtp_password.setter
    def smtp_password(self, value):
        if value:
            self._smtp_password = get_fernet().encrypt(value.encode()).decode()
        else:
            self._smtp_password = ""

    def clean(self):
        super().clean()
        if self.is_active:
            # Check if there is already another active SiteSettings
            qs = SiteSettings.objects.filter(is_active=True)
            if self.pk:
                qs = qs.exclude(pk=self.pk)
            if qs.exists():
                raise ValidationError("Only one active SiteSettings is allowed. Deactivate the current one first.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class OfficeLocation(UUIDModel, TimeStampedModel):
    site_settings = models.ForeignKey(SiteSettings, on_delete=models.CASCADE, related_name='office_locations')
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    address = models.TextField()
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    map_url = models.URLField(max_length=500, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'site_office_locations'
        ordering = ['order', 'city']
        verbose_name = 'Office Location'
        verbose_name_plural = 'Office Locations'

    def __str__(self):
        return f"{self.city}, {self.country}"


class SocialLink(UUIDModel, TimeStampedModel):
    PLATFORM_CHOICES = [
        ('linkedin', 'LinkedIn'),
        ('github', 'GitHub'),
        ('twitter', 'X (Twitter)'),
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
        ('tiktok', 'TikTok'),
        ('youtube', 'YouTube'),
        ('behance', 'Behance'),
        ('dribbble', 'Dribbble'),
        ('medium', 'Medium'),
    ]

    site_settings = models.ForeignKey(SiteSettings, on_delete=models.CASCADE, related_name='social_links')
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES)
    url = models.URLField(max_length=500)
    icon = models.CharField(max_length=50, blank=True, help_text="Optional icon identifier (e.g. lucide icon name)")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'site_social_links'
        ordering = ['order', 'platform']
        verbose_name = 'Social Link'
        verbose_name_plural = 'Social Links'

    def __str__(self):
        return self.get_platform_display()


class SystemBackup(UUIDModel, TimeStampedModel):
    file_name = models.CharField(max_length=255)
    file_size = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=50, default='pending', choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')])
    
    class Meta:
        db_table = 'site_system_backups'
        ordering = ['-created_at']
        verbose_name = 'System Backup'
        verbose_name_plural = 'System Backups'
        
    def __str__(self):
        return f"{self.file_name} ({self.status})"


class Notification(UUIDModel, TimeStampedModel):
    TYPE_CHOICES = [
        ('system', 'System Alert'),
        ('security', 'Security Alert'),
        ('storage', 'Storage Warning'),
        ('backup', 'Backup Notification'),
        ('crm', 'CRM Notification'),
    ]
    
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='system')
    is_read = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'site_notifications'
        ordering = ['-created_at']
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        
    def __str__(self):
        return f"{self.type}: {self.title}"

