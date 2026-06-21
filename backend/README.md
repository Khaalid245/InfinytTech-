# InfinytTech Backend

Django REST Framework API backend for InfinytTech digital services platform.

## Tech Stack

- Python 3.12
- Django 6.0.5
- Django REST Framework 3.17.1
- MySQL 8.0
- JWT Authentication (djangorestframework-simplejwt)
- CORS (django-cors-headers)
- Swagger Docs (drf-spectacular)
- PyMySQL (pure Python MySQL driver)
- python-decouple (environment variables)

---

## Project Structure

```
backend/
│
├── apps/                          # All Django business logic apps
│   │
│   ├── accounts/                  # User authentication & management
│   │   ├── migrations/
│   │   ├── admin.py               # Custom UserAdmin (email-based)
│   │   ├── apps.py
│   │   ├── models.py              # Custom User model (email login)
│   │   ├── serializers.py         # LoginSerializer, UserSerializer
│   │   ├── tests.py               # Auth unit tests
│   │   ├── urls.py                # /api/auth/ routes
│   │   └── views.py               # LoginView, MeView
│   │
│   ├── services/                  # Digital services listings
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py              # Service model
│   │   ├── serializers.py         # ServiceSerializer
│   │   ├── urls.py                # /api/services/ routes
│   │   └── views.py               # ServiceListView, ServiceDetailView
│   │
│   ├── portfolio/                 # Portfolio projects showcase
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py              # Project model (FK to Service)
│   │   ├── serializers.py         # ProjectSerializer (nested service)
│   │   ├── urls.py                # /api/portfolio/ routes
│   │   └── views.py               # ProjectListView, ProjectDetailView
│   │
│   ├── blog/                      # Blog posts & categories
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py              # Category, Post models
│   │   ├── serializers.py         # PostListSerializer, PostDetailSerializer
│   │   ├── urls.py                # /api/blog/ routes
│   │   └── views.py               # PostListView, PostDetailView, CategoryListView
│   │
│   ├── contacts/                  # Contact form & inquiry management
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py              # Inquiry model (new/read/replied)
│   │   ├── serializers.py         # InquiryCreateSerializer, InquiryAdminSerializer
│   │   ├── urls.py                # /api/contacts/ routes
│   │   └── views.py               # InquiryCreateView, InquiryAdminListView
│   │
│   └── common/                    # Shared utilities used across all apps
│       ├── apps.py
│       ├── exceptions.py          # Global custom exception handler
│       ├── pagination.py          # StandardPagination (page-based)
│       └── response.py            # api_response() & api_error() helpers
│
├── config/                        # Django project configuration
│   ├── settings.py                # All settings (DB, JWT, CORS, DRF, Swagger)
│   ├── urls.py                    # Root URL configuration
│   ├── wsgi.py                    # WSGI entry point (production)
│   └── asgi.py                    # ASGI entry point (async)
│
├── docs/                          # Project documentation
│   └── API.md                     # Full API endpoint reference
│
├── media/                         # User uploaded files (gitignored)
├── static/                        # Collected static files (gitignored)
│
├── requirements/                  # Split requirements by environment
│   ├── base.txt                   # Shared: Django, DRF, JWT, PyMySQL, etc.
│   ├── dev.txt                    # Dev only: drf-spectacular (Swagger)
│   └── prod.txt                   # Prod only: gunicorn
│
├── manage.py                      # Django management entry point
├── .env                           # Local environment variables (gitignored)
├── .env.example                   # Environment variables template
└── .gitignore                     # Git ignore rules
```

---

## API Endpoints

### Authentication
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | /api/auth/login/ | No | Login, returns JWT tokens |
| POST | /api/auth/refresh/ | No | Refresh access token |
| GET | /api/auth/me/ | Yes | Get current user profile |

### Services

#### Public Endpoints (Read-Only)
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | /api/services/categories/ | No | List active service categories |
| GET | /api/services/ | No | List active services (optional filter by `category` slug, or `search` query) |
| GET | /api/services/industries/ | No | List active industries served |
| GET | /api/services/process/ | No | List active process/methodology steps |
| GET | /api/services/faqs/ | No | List active FAQs |

#### Admin CRUD Endpoints (JWT Bearer Auth Required)
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET / POST | /api/services/admin/categories/ | Admin | List / Create service categories |
| GET / PUT / PATCH / DELETE | /api/services/admin/categories/:slug/ | Admin | Retrieve / Update / Delete service category |
| GET / POST | /api/services/admin/services/ | Admin | List / Create services |
| GET / PUT / PATCH / DELETE | /api/services/admin/services/:slug/ | Admin | Retrieve / Update / Delete service |
| GET / POST | /api/services/admin/features/ | Admin | List / Create service features |
| GET / PUT / PATCH / DELETE | /api/services/admin/features/:id/ | Admin | Retrieve / Update / Delete service feature |
| GET / POST | /api/services/admin/industries/ | Admin | List / Create industries |
| GET / PUT / PATCH / DELETE | /api/services/admin/industries/:slug/ | Admin | Retrieve / Update / Delete industry |
| GET / POST | /api/services/admin/process/ | Admin | List / Create process steps |
| GET / PUT / PATCH / DELETE | /api/services/admin/process/:id/ | Admin | Retrieve / Update / Delete process step |
| GET / POST | /api/services/admin/faqs/ | Admin | List / Create FAQs |
| GET / PUT / PATCH / DELETE | /api/services/admin/faqs/:id/ | Admin | Retrieve / Update / Delete FAQ |

### Portfolio
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | /api/portfolio/ | No | List all projects |
| GET | /api/portfolio/?featured=true | No | Featured projects only |
| GET | /api/portfolio/:slug/ | No | Project detail |
| POST | /api/portfolio/ | Admin | Create project |
| PUT | /api/portfolio/:slug/ | Admin | Update project |
| DELETE | /api/portfolio/:slug/ | Admin | Delete project |

### Blog
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | /api/blog/posts/ | No | List published posts |
| GET | /api/blog/posts/?category=slug | No | Filter by category |
| GET | /api/blog/posts/:slug/ | No | Post detail |
| POST | /api/blog/posts/ | Admin | Create post |
| PUT | /api/blog/posts/:slug/ | Admin | Update post |
| DELETE | /api/blog/posts/:slug/ | Admin | Delete post |
| GET | /api/blog/categories/ | No | List categories |
| POST | /api/blog/categories/ | Admin | Create category |

### Contacts
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | /api/contacts/inquiries/ | No | Submit contact form |
| GET | /api/contacts/admin/inquiries/ | Admin | List all inquiries |
| GET | /api/contacts/admin/inquiries/?status=new | Admin | Filter by status |
| GET | /api/contacts/admin/inquiries/:id/ | Admin | Inquiry detail |
| PUT | /api/contacts/admin/inquiries/:id/ | Admin | Update inquiry status |

---

## Standard Response Format

All endpoints return a consistent response shape:

```json
{
  "success": true,
  "message": "",
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Human readable error",
  "errors": { "field": ["error detail"] }
}
```

---

## Quick Start

```bash
# 1. Clone and navigate
cd backend

# 2. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# 3. Install dependencies
pip install -r requirements/dev.txt

# 4. Setup environment variables
cp .env.example .env
# Edit .env with your MySQL credentials

# 5. Create MySQL database
mysql -u root -p
CREATE DATABASE infinyttech_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# 6. Run migrations
python manage.py migrate

# 7. Create superuser
python manage.py createsuperuser

# 8. Start server
python manage.py runserver
```

---

## Important URLs

| URL | Description |
|-----|-------------|
| http://localhost:8000/api/docs/ | Swagger UI — test all endpoints |
| http://localhost:8000/admin/ | Django Admin panel |
| http://localhost:8000/api/schema/ | OpenAPI schema (JSON) |

---

## Environment Variables

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=infinyttech_db
DB_USER=root
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=3306

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

JWT_ACCESS_TOKEN_LIFETIME_MINUTES=60
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7
```

---

## Database Tables

| Table | App | Description |
|-------|-----|-------------|
| accounts_users | accounts | Custom user model |
| service_categories | services | Service Category listings |
| services | services | Service listings |
| service_features | services | Features included under services |
| industries | services | Industries served listings |
| process_steps | services | Delivery methodology process steps |
| faqs | services | Service FAQs list |
| portfolio_projects | portfolio | Portfolio projects |
| blog_categories | blog | Blog categories |
| blog_posts | blog | Blog posts |
| contact_inquiries | contacts | Contact form submissions |
