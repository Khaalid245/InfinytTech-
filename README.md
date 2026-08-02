# InfinytTech

> **Premium, modern, enterprise‑grade web platform with a fully implemented Security Layer**

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Security Features](#security-features)
- [Security Architecture](#security-architecture)
- [Implemented Modules](#implemented-modules)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Development Server](#running-the-development-server)
- [Build & Deploy](#build--deploy)
- [Deployment Notes](#deployment-notes)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Design System](#design-system)
- [Documentation](#documentation)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

InfinytTech is a technology consultancy that designs, builds, and scales digital products for startups, businesses, and enterprises. The platform showcases a **premium, enterprise‑ready design system** inspired by leading SaaS brands such as Linear, Vercel, Stripe, and Ramp — and is backed by a **full-stack Django REST Framework + React/TypeScript architecture** with an enterprise-grade security layer.

The platform includes:
- A **hero section** that instantly conveys value, trust, and a clear call‑to‑action.
- An **evolved dark‑mode palette** with a sophisticated gold/amber accent.
- **Accessibility‑friendly** colour tokens and contrast ratios.
- **Featured case‑study carousel** with a CSS‑driven progress bar and deep‑linking to project pages.
- **Full Django CMS Integration** for Portfolio, Services, Industry Taxonomy, Process Steps, Blog, and FAQ data.
- An **enterprise-grade Security Module** that allows administrators to configure all security policies at runtime via the Admin Dashboard.

---

## Features

- **Responsive layout** built with React + TypeScript.
- **Premium design system** (dark & light themes, CSS variables, micro‑animations).
- **Hero section** with trust indicators, dual CTA buttons, and auto‑rotating case‑study showcase.
- **Portfolio & Services CMS Integration**: All case studies, capabilities, industries, process timeline steps, and FAQs are loaded dynamically from Django REST Framework APIs.
- **Axios & TanStack Query (React Query) Caching**: Optimised data fetching layer in frontend.
- **Dynamic Icon Resolver**: Maps CMS-configured icon strings directly to premium Lucide React SVG components.
- **Portfolio deep‑linking** (`/work?project={id}`).
- **Accessibility**: proper ARIA labels, focus‑trapping for modals, sufficient colour contrast.
- **Performance optimisations**: lazy‑loaded images, CSS‑only animations, minimal external dependencies.
- **Enterprise Security**: Password policies, account lockout, session timeout, rate limiting, dynamic CORS, and security headers — all driven by the Admin Settings.

---

## Security Features

The platform implements an enterprise-grade security layer managed entirely through the Admin Dashboard. No code changes are required to update security policies.

| Feature | Description |
|---|---|
| **Dynamic Password Policy** | Relaxed / Standard / Strict — configurable per environment |
| **Runtime Password Validation** | Password rules enforced at signup, password reset, and change |
| **Account Lockout** | Configurable failed login attempt threshold with auto-lockout |
| **Manual Account Unlock** | Admins can unlock accounts from the Dashboard |
| **Session Timeout** | Inactivity-based session expiry enforced at API level |
| **API Rate Limiting** | Per-user and per-IP rate limits, configurable at runtime |
| **Enterprise Security Headers** | CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy |
| **Dynamic CORS Management** | Allowed origins stored in database; no restart required to update |
| **Activity Logging** | Security events logged per user for audit purposes |

For full technical detail, see [docs/SECURITY.md](docs/SECURITY.md).

---

## Security Architecture

All security settings are managed centrally through **Platform Settings → Security** in the Admin Dashboard. Administrators can configure the following without modifying application code or restarting the server:

| Setting | Description |
|---|---|
| **Password Policy** | Choose Relaxed, Standard, or Strict enforcement |
| **Session Timeout** | Inactivity duration in minutes before forced logout |
| **Max Login Attempts** | Failed attempts before account is locked |
| **Lockout Duration** | Auto-unlock delay in minutes after lockout |
| **API Rate Limit** | Max requests per minute per authenticated user |
| **Allowed CORS Origins** | Comma-separated list of frontend origins allowed to access the API |

### How it works

- Settings are stored in the `SiteSettings` model and cached in memory.
- Every request reads the current cached policy — **changes take effect immediately** after saving.
- CORS origins are evaluated per-request via a `django-cors-headers` signal handler (`check_request_enabled`), which reads directly from `SiteSettings.allowed_origins`.
- In production, `CORS_ALLOW_ALL_ORIGINS = False` is enforced; the wildcard `*` is never returned.
- In development, localhost origins (`localhost:3000`, `localhost:5173`) are pre-approved via `development.py`.

---

## Implemented Modules

| Module | Status |
|---|---|
| ✅ Authentication (JWT + Refresh) | Complete |
| ✅ User Management | Complete |
| ✅ Platform Settings — General | Complete |
| ✅ Platform Settings — Branding | Complete |
| ✅ Platform Settings — SEO | Complete |
| ✅ Platform Settings — Security | **Complete** |
| ✅ Media Library | Complete |
| ✅ Portfolio | Complete |
| ✅ Services | Complete |
| ✅ Blog | Complete |
| ✅ Leads / CRM | Complete |
| ✅ Team | Complete |
| ✅ Testimonials | Complete |
| ✅ Dashboard | Complete |

---

## Project Structure

```
InfinytTech/
├── backend/                         # Django REST Framework API
│   ├── apps/
│   │   ├── accounts/                # Auth, users, session, lockout, rate limiting
│   │   │   ├── authentication.py    # SessionTimeout JWT authentication
│   │   │   ├── backends.py          # Security-aware auth backend
│   │   │   ├── middleware.py        # Session timeout enforcement middleware
│   │   │   ├── throttling.py        # Dynamic rate limiting (reads SiteSettings)
│   │   │   └── validators.py        # Runtime password policy validator
│   │   ├── site_settings/           # Platform Settings CMS
│   │   │   ├── models.py            # SiteSettings singleton (incl. allowed_origins)
│   │   │   ├── services.py          # Cached settings accessor
│   │   │   ├── signals.py           # Dynamic CORS origin check signal
│   │   │   └── views.py             # Admin + public settings API
│   │   ├── core/
│   │   │   ├── middleware.py        # SecurityHeadersMiddleware (CSP, Permissions-Policy)
│   │   │   └── exceptions.py        # Custom exception handler (429 with Retry-After)
│   │   ├── blog/
│   │   ├── leads/
│   │   ├── media_library/
│   │   ├── portfolio/
│   │   ├── services/
│   │   ├── team/
│   │   └── testimonials/
│   ├── config/
│   │   ├── settings/
│   │   │   ├── base.py              # Shared settings (CORS headers, credentials)
│   │   │   ├── development.py       # Dev overrides (localhost CORS origins)
│   │   │   └── production.py        # Production (HSTS, SSL, strict CORS)
│   │   └── urls.py
│   └── requirements/
│       └── base.txt
│
├── frontend/                        # React + TypeScript SPA
│   ├── src/
│   │   ├── components/
│   │   ├── sections/
│   │   ├── pages/
│   │   ├── services/                # Axios API clients
│   │   ├── hooks/
│   │   └── index.css                # Design system tokens
│   └── package.json
│
└── README.md
```

---

## Installation

### Backend

```bash
# Clone the repository
git clone https://github.com/your-org/infinyttech.git
cd infinyttech/backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate    # macOS/Linux

# Install dependencies
pip install -r requirements/base.txt

# Configure environment variables (copy and edit)
cp .env.example .env

# Apply migrations
python manage.py migrate

# Create a superuser
python manage.py createsuperuser
```

### Frontend

```bash
cd infinyttech/frontend

# Install dependencies (Node.js 20+)
npm install
```

### Environment Variables

Create `backend/.env` with the following values:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=infinyttech_db
DB_USER=root
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=3306

JWT_ACCESS_TOKEN_LIFETIME_MINUTES=60
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7
```

> **Note**: `CORS_ALLOWED_ORIGINS` is no longer required in the `.env` for production — CORS origins are managed via the Admin Dashboard → Platform Settings → Security.

---

## Running the Development Server

### Backend

```bash
cd backend
python manage.py runserver
```

API available at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm run dev
```

App available at `http://localhost:5173`

---

## Build & Deploy

```bash
# Frontend production build
cd frontend
npm run build
```

Deploy the `dist/` folder to any static‑hosting provider (Vercel, Netlify, AWS S3, etc.).

For the backend, use Gunicorn + Nginx in production:

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

Set `DJANGO_ENV=production` to activate production settings (HSTS, SSL redirect, strict CORS).

---

## Deployment Notes

> [!IMPORTANT]
> Review all items below before going live.

- **HTTPS is required.** The platform enforces `Strict-Transport-Security` headers in production. Never serve over plain HTTP in production.
- **HSTS is enabled in production only.** `SECURE_HSTS_SECONDS = 31536000` (1 year) with subdomains and preload. Do not enable in development.
- **Dynamic CORS** must be configured via Admin → Platform Settings → Security → Allowed CORS Origins before launch. Add your production frontend domain (e.g. `https://app.infinyt.tech`).
- **Security headers** (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy) are active in all environments.
- **Environment variables** must be fully configured before deployment. Refer to `.env.example`.
- **Set `DJANGO_ENV=production`** in your deployment environment to activate production security settings.
- **Database** should use a production MySQL server. Never use SQLite in production.
- **Media files** should be served from an object store (e.g. AWS S3) behind a CDN in production.

---

## Post-Deployment Checklist

Run through this checklist after every production deployment:

- ☐ **Password Policy** — Verify correct policy (Relaxed/Standard/Strict) is active in Platform Settings
- ☐ **Account Lockout** — Test that accounts lock after the configured number of failed attempts
- ☐ **Session Timeout** — Verify idle sessions are logged out after the configured duration
- ☐ **API Rate Limiting** — Verify that API throttling is active and returns `429` with `Retry-After`
- ☐ **Security Headers** — Inspect response headers: `X-Frame-Options`, `CSP`, `HSTS`, `Referrer-Policy`
- ☐ **Dynamic CORS** — Confirm only allowed frontend origins receive `Access-Control-Allow-Origin`
- ☐ **SMTP** — Send a test email from Platform Settings → Email to confirm SMTP is operational
- ☐ **Backups** — Trigger a manual backup from Platform Settings → System and verify it completes
- ☐ **HTTPS** — Confirm all traffic redirects to HTTPS and the certificate is valid

---

## Design System

The design system lives in `frontend/src/index.css` (CSS variables) and `frontend/src/constants/theme.ts` (color & shadow tokens). It embraces:

- **Gold/amber accent** (`#D4A017` / `#B8860B`).
- **Deep slate dark background** (`#0B0D0F`).
- **Micro‑animations** (`fade-in-up`, `hero-progress`).
- **Responsive typography** using `clamp()` for fluid scaling.

---

## Documentation

| Document | Description |
|---|---|
| [docs/SECURITY.md](docs/SECURITY.md) | Full security architecture, middleware, signal handlers, and configuration guide |
| [API Docs](http://localhost:8000/api/docs/) | Interactive Swagger UI (available when running the dev server) |
| [API Schema](http://localhost:8000/api/schema/) | Raw OpenAPI 3.0 schema |

---

## Changelog

### v1.5.0 — Security Module Complete ✅

- **Dynamic Password Policy** — Relaxed / Standard / Strict, configurable per environment and enforced at runtime via `SitePasswordValidator`.
- **Account Lockout** — Configurable failed-attempt threshold with auto-lockout and manual unlock from the Admin Dashboard.
- **Session Timeout** — Inactivity enforcement at the JWT authentication layer via `SessionTimeoutJWTAuthentication`.
- **API Rate Limiting** — Per-user and per-IP throttle classes that read limits from `SiteSettings` at request time.
- **Enterprise Security Headers** — `SecurityHeadersMiddleware` adds CSP, Permissions-Policy; Django adds HSTS, X-Frame-Options, Referrer-Policy.
- **Dynamic CORS Management** — Origin allow-list stored in `SiteSettings.allowed_origins`; evaluated per-request via `check_request_enabled` signal. No wildcard (`*`) ever returned in production.
- **Activity Logging** — Security events (login, logout, failed attempts) logged to `UserActivity` for audit.

All features manually tested and verified across development and production configurations.

### v1.4.0 — Media Library, Blog & Leads

- Implemented Media Library with folder organisation and tag support.
- Implemented Blog CMS with admin and public endpoints.
- Implemented Lead / CRM intake with pipeline management.

### v1.3.0 — Portfolio & Services CMS Integration

- Connected Portfolio, Services, Industries, and Process Steps to Django REST Framework.
- Added TanStack Query caching layer in the frontend.
- Implemented Dynamic Icon Resolver for CMS-configured icons.

### v1.2.0 — Platform Settings & Admin Dashboard

- Implemented `SiteSettings` singleton model with cache layer.
- Added Admin Dashboard with health monitoring and audit logs.
- Implemented SMTP configuration and test-email endpoint.

### v1.1.0 — Authentication & User Management

- JWT authentication with refresh token rotation.
- User roles: Viewer, Editor, Admin, Super Admin.
- Admin user management CRUD.

### v1.0.0 — Initial Release

- React + TypeScript frontend with premium design system.
- Django REST Framework backend with MySQL.
- Initial project structure and CI setup.

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Ensure linting and TypeScript checks pass: `npx tsc --noEmit`.
4. Open a Pull Request with a clear description of changes.

> **Note**: All new UI components should follow the existing design system and include appropriate ARIA attributes. Security-sensitive changes must be reviewed against [docs/SECURITY.md](docs/SECURITY.md).

---

## License

This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

*Updated by Antigravity – AI coding assistant. Last updated: August 2026.*
