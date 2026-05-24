# InfinytTech Backend

Django REST Framework API backend for InfinytTech digital services platform.

## Structure

```
backend/
├── apps/               # All Django apps (accounts, services, portfolio, blog, contacts, common)
├── config/             # Project settings, urls, wsgi, asgi
├── media/              # User-uploaded files (gitignored)
├── static/             # Collected static files (gitignored)
├── requirements/       # Split requirements (base, dev, prod)
├── docs/               # API docs, ERD, notes
└── manage.py
```

## Quick Start

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements/dev.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```
