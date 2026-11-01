"""
seed_baseline_content.py
Idempotent seeding script for Group 1 Baseline Content:
- 22 Technologies Stack (matching TechStackSection.tsx)
- 6 Portfolio Project Categories (matching portfolioData.ts)
- 12 Portfolio Projects (4 Featured Case Studies with metrics + 8 Library Projects)
- 5 Service FAQs (matching services specification)
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.portfolio.models import ProjectCategory, Technology, Project, ProjectMetric
from apps.services.models import FAQ, Service

def seed_technologies():
    print("--> Seeding 22 Technologies...")
    tech_data = [
        # Languages & Runtimes
        ('Next.js', 'nextjs', 'runtime', 'Modern React framework for fast, SEO-friendly, server-rendered web platforms.', 'globe', 1),
        ('React', 'react', 'runtime', 'Component-driven UI library for building interactive, high-performance web applications.', 'code-2', 2),
        ('TypeScript', 'typescript', 'runtime', 'Strictly typed JavaScript superset for reliable, enterprise-scale software engineering.', 'braces', 3),
        ('Go (Golang)', 'go', 'runtime', 'High-performance backend language for scalable APIs, microservices, and distributed systems.', 'server', 4),
        ('Django', 'django', 'runtime', 'Enterprise Python framework for secure, scalable backends and robust APIs.', 'server', 5),
        ('Flutter', 'flutter', 'runtime', 'Cross-platform mobile UI framework for native iOS and Android experiences.', 'smartphone', 6),
        ('Node.js', 'nodejs', 'runtime', 'Asynchronous event-driven JavaScript runtime for fast, scalable network applications.', 'code-2', 7),
        ('Tailwind CSS', 'tailwindcss', 'runtime', 'Utility-first CSS framework for rapid and consistent design system implementation.', 'palette', 8),

        # AI & Machine Learning
        ('Python', 'python', 'ai', 'Powering automated workflows, high-throughput data processing, and AI integrations.', 'cpu', 9),
        ('PyTorch', 'pytorch', 'ai', 'Open-source machine learning framework for training and deploying deep learning models.', 'sparkles', 10),
        ('TensorFlow', 'tensorflow', 'ai', 'End-to-end open source platform for machine learning and neural networks.', 'sparkles', 11),
        ('OpenAI API', 'openai', 'ai', 'Large language models and AI embeddings for intelligent conversational workflows.', 'sparkles', 12),

        # Cloud & Scaling
        ('AWS Cloud', 'aws', 'cloud', 'Cloud infrastructure delivering elastic scalability, enterprise security, and global reach.', 'cloud', 13),
        ('Kubernetes', 'kubernetes', 'cloud', 'Container orchestration platform that scales applications reliably across cloud clusters.', 'layers', 14),
        ('Terraform', 'terraform', 'cloud', 'Infrastructure-as-Code automating multi-cloud provisioning and reproducible deployments.', 'cloud', 15),
        ('Docker', 'docker', 'cloud', 'Containerization engine standardizing build, test, and release pipelines.', 'boxes', 16),

        # Databases & APIs
        ('PostgreSQL', 'postgresql', 'db', 'Advanced open-source relational database with ACID compliance and high query concurrency.', 'database', 17),
        ('MySQL', 'mysql', 'db', 'Proven enterprise relational database engine powering modern transactional systems.', 'database', 18),
        ('Redis', 'redis', 'db', 'In-memory data structure store used as a distributed cache and real-time message broker.', 'database', 19),
        ('MongoDB', 'mongodb', 'db', 'Document-based distributed database designed for flexible, high-volume unstructured data.', 'database', 20),
        ('GraphQL', 'graphql', 'db', 'Flexible query language for APIs enabling declarative, efficient client data fetching.', 'braces', 21),
        ('gRPC', 'grpc', 'db', 'High-performance, open source universal RPC framework powered by protocol buffers.', 'server', 22),
    ]

    created_techs = {}
    for name, slug, cat, desc, icon, order in tech_data:
        obj, created = Technology.objects.update_or_create(
            slug=slug,
            defaults={
                'name': name,
                'category': cat,
                'description': desc,
                'icon_name': icon,
                'display_order': order,
                'is_active': True,
            }
        )
        created_techs[slug] = obj
    print(f"    Total active Technologies in DB: {Technology.objects.count()}")
    return created_techs


def seed_categories():
    print("--> Seeding Project Categories...")
    cat_data = [
        ('Web Applications', 'web', 'Modern web applications, high-throughput portals, and scalable SaaS platforms.'),
        ('Mobile Applications', 'mobile', 'Cross-platform and native iOS & Android applications with offline synchronization.'),
        ('AI & Machine Learning', 'ai', 'Bespoke artificial intelligence systems, computer vision, and NLP models.'),
        ('Enterprise Systems', 'enterprise', 'Distributed microservices architectures, transactional gateways, and institutional software.'),
        ('Cloud & Infrastructure', 'cloud', 'Cloud-native infrastructure, DevOps pipelines, container clusters, and telemetry systems.'),
        ('UI/UX Design Systems', 'uiux', 'Enterprise design systems, accessible UI components, and conversion-focused ergonomics.'),
    ]

    created_cats = {}
    for name, slug, desc in cat_data:
        obj, created = ProjectCategory.objects.update_or_create(
            slug=slug,
            defaults={
                'name': name,
                'description': desc,
                'is_active': True,
            }
        )
        created_cats[slug] = obj
    print(f"    Total Project Categories in DB: {ProjectCategory.objects.count()}")
    return created_cats


def seed_projects(categories, technologies):
    print("--> Seeding Portfolio Projects & Case Studies...")

    case_studies = [
        {
            'title': 'Healthcare Management Platform',
            'slug': 'healthcare-management-platform',
            'category_slug': 'mobile',
            'short_description': 'HIPAA-compliant mobile client with offline-first CRDT synchronization, securing 32,000+ patient identities across 14 clinics.',
            'full_description': 'Manual paper logging delayed emergency intake processes, while unstable power grids caused data loss at clinics serving 50k+ patients annually. Designed a secure mobile client using Flutter and SQLite local sync nodes, employing conflict-free replicated data types (CRDT) for offline database coordination. Eliminated intake bottlenecks and data losses by synchronizing clinic databases automatically.',
            'client_name': 'Healthcare Regional Network',
            'is_featured': True,
            'tech_slugs': ['flutter', 'docker', 'aws', 'postgresql'],
            'metrics': [('Intake Speedup', '92%'), ('Patient Records', '32,000+')]
        },
        {
            'title': 'Real Estate Management System',
            'slug': 'real-estate-management-system',
            'category_slug': 'web',
            'short_description': 'Spatial property indexing platform executing sub-50ms regional proximity queries and managing $4M+ in commercial sales.',
            'full_description': 'Lack of centralized spatial data led to boundary verification disputes and slow, manual property listing checks for municipal corridors. Built a spatial indexing engine using Next.js and PostgreSQL PostGIS coordinates cache, executing sub-50ms regional proximity queries. Automated boundary verification checks and accelerated deal closures, facilitating over $4M in commercial real estate sales within 8 months.',
            'client_name': 'PropTech Corridor Group',
            'is_featured': True,
            'tech_slugs': ['nextjs', 'postgresql', 'nodejs', 'tailwindcss'],
            'metrics': [('Volume Managed', '$4M+'), ('Query Latency', '<50ms')]
        },
        {
            'title': 'AI Customer Support Assistant',
            'slug': 'ai-customer-support-assistant',
            'category_slug': 'ai',
            'short_description': 'WebAssembly-compiled ONNX neural network running client-side with local dialect translation and 350% retention growth.',
            'full_description': 'High support ticket volume and slow connectivity caused delayed user replies, leading to cart abandonments and customer churn. Developed a WebAssembly-compiled ONNX neural network running natively inside client browsers, providing local dialect-aware voice translation. Automated instant responses to dialect queries locally on the user device, scaling active session capacity and improving user retention by 350%.',
            'client_name': 'Retail AI Ventures',
            'is_featured': True,
            'tech_slugs': ['python', 'pytorch', 'react', 'mongodb', 'openai'],
            'metrics': [('Retention Growth', '350%'), ('Response Time', 'Instant')]
        },
        {
            'title': 'Enterprise SaaS Financial Gateway',
            'slug': 'enterprise-saas-financial-gateway',
            'category_slug': 'enterprise',
            'short_description': 'Distributed Go microservices architecture settling over $14M in cross-border remittance with <0.02% failure rate.',
            'full_description': 'Slow manual compliance audits and high network latency delayed cross-border payments, causing transaction drops during peak settlement hours. Constructed a Go microservices architecture using gRPC schemas and a distributed Saga pattern to manage multi-step cross-border transfers. Secured compliance validations in sub-second timelines and reduced transaction failure rates to <0.02%, settling over $14M in remittance volume.',
            'client_name': 'FinTech Global Settlements',
            'is_featured': True,
            'tech_slugs': ['go', 'kubernetes', 'grpc', 'postgresql', 'aws', 'redis'],
            'metrics': [('Volume Settled', '$14M+'), ('Failure Rate', '<0.02%')]
        },
    ]

    library_projects = [
        {
            'title': 'Telehealth Consultation App',
            'slug': 'telehealth-consultation-app',
            'category_slug': 'mobile',
            'short_description': 'HIPAA-compliant video consult portal with real-time patient queue metrics and automatic prescription routing.',
            'full_description': 'Engineered an offline-first patient record database synchronization module using local encryption protocols to solve high latency in remote rural locations.',
            'client_name': 'TeleMed Health',
            'is_featured': False,
            'tech_slugs': ['react', 'postgresql', 'nodejs'],
        },
        {
            'title': 'Asset Allocation & Trading Engine',
            'slug': 'asset-allocation-trading-engine',
            'category_slug': 'enterprise',
            'short_description': 'High-frequency portfolio rebalancing platform serving institutional asset managers with real-time risk gauges.',
            'full_description': 'Designed an event-driven messaging topology using Kafka and distributed state machines in Go to handle peak transaction loads during market volatility.',
            'client_name': 'Institutional Capital',
            'is_featured': False,
            'tech_slugs': ['go', 'redis', 'react', 'kubernetes'],
        },
        {
            'title': 'Smart Logistics Routing Portal',
            'slug': 'smart-logistics-routing-portal',
            'category_slug': 'web',
            'short_description': 'Real-time fleet optimization dashboard utilizing genetic algorithms to reduce transit delays and fuel expenditure.',
            'full_description': 'Implemented genetic optimization pathfinders run asynchronously in Python FastAPI microservices to solve multi-variable dispatch routes dynamically.',
            'client_name': 'Fleet Logistics Group',
            'is_featured': False,
            'tech_slugs': ['nextjs', 'python', 'docker', 'aws'],
        },
        {
            'title': 'Interactive Learning Management Portal',
            'slug': 'interactive-learning-portal',
            'category_slug': 'web',
            'short_description': 'Collaborative virtual classroom environment with interactive whiteboards and offline course progress synchronization.',
            'full_description': 'Engineered low-bandwidth web socket broadcast lines paired with local progress state storage to prevent student drop-offs.',
            'client_name': 'EdTech Global',
            'is_featured': False,
            'tech_slugs': ['react', 'nodejs', 'mongodb'],
        },
        {
            'title': 'AI Automated Document Classifier',
            'slug': 'ai-automated-document-classifier',
            'category_slug': 'ai',
            'short_description': 'Transformer-based OCR processing engine designed to classify and extract metadata from structured legal agreements.',
            'full_description': 'Structured a bespoke NLP extraction model deployed on edge-optimized inference servers to eliminate manual extraction errors.',
            'client_name': 'LegalTech Systems',
            'is_featured': False,
            'tech_slugs': ['python', 'pytorch', 'tailwindcss'],
        },
        {
            'title': 'Cloud-Native Logging System',
            'slug': 'cloud-native-logging-system',
            'category_slug': 'cloud',
            'short_description': 'Distributed log aggregator handling 50k+ logs per second with customizable anomaly alarms.',
            'full_description': 'Built a custom buffer streaming architecture that batches queries before flushing to disk, eliminating database lock contention.',
            'client_name': 'Infrastructure Tech',
            'is_featured': False,
            'tech_slugs': ['go', 'docker', 'kubernetes', 'aws'],
        },
        {
            'title': 'B2B SaaS Procurement Portal',
            'slug': 'b2b-saas-procurement-portal',
            'category_slug': 'enterprise',
            'short_description': 'Multi-tenant vendor bidding interface with automatic invoice parsing and enterprise single sign-on (SSO) support.',
            'full_description': 'Programmed automatic vendor validation checks and automated invoice parsing via OCR workflows to secure enterprise bidding.',
            'client_name': 'Global Procurement Network',
            'is_featured': False,
            'tech_slugs': ['nextjs', 'postgresql', 'graphql', 'nodejs'],
        },
        {
            'title': 'E-Commerce Visual Design System',
            'slug': 'ecommerce-visual-design-system',
            'category_slug': 'uiux',
            'short_description': 'Framework atomic design library and component repository customized for high-conversion fashion checkouts.',
            'full_description': 'Designed and prototyped responsive, high-performance checkout patterns focusing on mobile thumb reach zones to reduce cart abandonment.',
            'client_name': 'Retail Brand Co.',
            'is_featured': False,
            'tech_slugs': ['react', 'tailwindcss', 'typescript'],
        },
    ]

    all_specs = case_studies + library_projects

    for p in all_specs:
        cat = categories.get(p['category_slug'])
        proj, created = Project.objects.update_or_create(
            slug=p['slug'],
            defaults={
                'title': p['title'],
                'short_description': p['short_description'],
                'full_description': p['full_description'],
                'client_name': p['client_name'],
                'status': Project.Status.PUBLISHED,
                'is_featured': p['is_featured'],
                'category': cat,
                'meta_title': f"{p['title']} | InfinytTech Portfolio Case Study",
                'meta_description': p['short_description'],
            }
        )
        # Link technologies
        matched_techs = [technologies[s] for s in p['tech_slugs'] if s in technologies]
        proj.technologies.set(matched_techs)

        # Seed metrics if present
        if 'metrics' in p:
            for idx, (label, val) in enumerate(p['metrics']):
                ProjectMetric.objects.update_or_create(
                    project=proj,
                    metric_label=label,
                    defaults={
                        'metric_value': val,
                        'display_order': idx + 1,
                    }
                )

    print(f"    Total Portfolio Projects in DB: {Project.objects.count()} (Featured: {Project.objects.filter(is_featured=True).count()})")
    print(f"    Total Project Metrics in DB: {ProjectMetric.objects.count()}")


def seed_faqs():
    print("--> Seeding Service FAQs...")
    faqs_data = [
        (
            "How do typical engagements work?",
            "We tailor our engagement models to your product phase, technical requirements, and strategic goals.",
            [
                "Dedicated Squad: An integrated cross-functional team of senior engineers, product strategists, and designers working as an extension of your company.",
                "Fixed-Scope Delivery: Milestone-driven sprints for well-defined MVPs, architectural migrations, or technical audits.",
                "Advisory & Technical Retainer: Ongoing cloud scaling, high-level system architecture, and SLA-backed maintenance."
            ],
            "Every engagement begins with an intensive technical discovery phase to define milestones, deliverables, and timelines.",
            1
        ),
        (
            "How long does it take to design and launch an MVP or enterprise system?",
            "Project timelines depend on system complexity, integration scope, and existing infrastructure.",
            [
                "Discovery & System Architecture: 1 to 2 weeks for roadmaps, data models, and technical specifications.",
                "Production-Ready MVP: 6 to 12 weeks for end-to-end development, testing, and cloud deployment.",
                "Enterprise Platform Modernization: 3 to 6 months for phased migrations with zero downtime guarantees."
            ],
            "We deliver working, demo-ready software in bi-weekly sprint cycles so you maintain full visibility into progress.",
            2
        ),
        (
            "Who owns the intellectual property (IP) and source code?",
            "You retain 100% full legal ownership of all intellectual property, source code, and design assets developed during our engagement.",
            [
                "Direct Git Repository Transfer: All repositories, CI/CD pipelines, and infrastructure-as-code scripts are transferred to your organization.",
                "No Proprietary Lock-In: We build exclusively on standard, modern open-source technologies (TypeScript, Python, Go, Docker, PostgreSQL).",
                "Full Documentation: Comprehensive architecture diagrams, API specifications, and runbooks are delivered upon completion."
            ],
            "We believe in complete freedom and ownership for the founders and teams we partner with.",
            3
        ),
        (
            "How do you ensure enterprise-grade security and code quality?",
            "Security and reliability are engineered into every layer of our systems from day one.",
            [
                "Strict Compilation & Type Safety: End-to-end type validation using TypeScript, Python type hints, and Go interfaces.",
                "Automated Testing & Security Scanning: Continuous integration testing covering unit, integration, and security regression checks.",
                "Hardened Infrastructure: Enforced HTTPS/HSTS, Content Security Policies, rate limiting, and encrypted secrets storage."
            ],
            "All deliverables undergo rigorous QA and penetration vulnerability reviews before production deployment.",
            4
        ),
        (
            "What happens after launch? Do you provide post-launch support and SLA maintenance?",
            "We provide comprehensive post-launch warranty and long-term scaling support to ensure continuous stability.",
            [
                "Standard 90-Day Warranty: Complimentary bug fixing, patch releases, and operational stabilization following launch.",
                "Proactive Monitoring: Real-time telemetry, automated error alerting, and uptime monitoring across your cloud infrastructure.",
                "Continuous Evolution: Flexible retained hours for continuous feature iteration, database optimization, and user scaling."
            ],
            "Our team remains available to support your technical growth as your user base and traffic expand.",
            5
        ),
    ]

    for q, intro, bullets, outro, order in faqs_data:
        FAQ.objects.update_or_create(
            question=q,
            defaults={
                'answer_intro': intro,
                'answer_bullets': bullets,
                'answer_outro': outro,
                'is_active': True,
                'order': order,
            }
        )
    print(f"    Total Service FAQs in DB: {FAQ.objects.count()}")


if __name__ == '__main__':
    print("=================================================================")
    print("BEGINNING IDEMPOTENT BASELINE CMS CONTENT SEEDING (GROUP 1)")
    print("=================================================================")
    techs = seed_technologies()
    cats = seed_categories()
    seed_projects(cats, techs)
    seed_faqs()
    print("=================================================================")
    print("SEEDING COMPLETED SUCCESSFULLY")
    print("=================================================================")
