# API Contract — InfinytTech Backend

> Version: 1.0.0
> Base URL: `http://localhost:8000` (dev) | `https://api.infinyttech.com` (prod)
> All dates: ISO 8601 — `2025-05-24T10:30:00Z`
> All media: Full absolute URLs — `https://domain.com/media/...`

---

## Global Response Structure

### Success
```json
{
  "success": true,
  "message": "",
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": {
    "field_name": ["error detail"]
  }
}
```

### Paginated Success
```json
{
  "success": true,
  "message": "",
  "data": {
    "count": 12,
    "next": "http://localhost:8000/api/blog/posts/?page=2",
    "previous": null,
    "results": []
  }
}
```

---

## Authentication

### POST /api/auth/login/
Login and receive JWT tokens.

- Auth required: No
- Request:
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```
- Response `200`:
```json
{
  "success": true,
  "message": "",
  "data": {
    "access": "<jwt_access_token>",
    "refresh": "<jwt_refresh_token>",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "Khalid Abdillahi",
      "is_staff": true,
      "created_at": "2025-05-24T10:30:00Z"
    }
  }
}
```
- Error `400`:
```json
{
  "success": false,
  "message": "Invalid credentials.",
  "errors": {}
}
```

---

### POST /api/auth/refresh/
Refresh access token.

- Auth required: No
- Request:
```json
{ "refresh": "<jwt_refresh_token>" }
```
- Response `200`:
```json
{
  "success": true,
  "message": "",
  "data": {
    "access": "<new_jwt_access_token>"
  }
}
```

---

### GET /api/auth/me/
Get current authenticated user.

- Auth required: Yes — `Authorization: Bearer <access_token>`
- Response `200`:
```json
{
  "success": true,
  "message": "",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "Khalid Abdillahi",
    "is_staff": true,
    "created_at": "2025-05-24T10:30:00Z"
  }
}
```
- Error `401`:
```json
{
  "success": false,
  "message": "Authentication credentials were not provided.",
  "errors": {}
}
```

---

## Services

### GET /api/services/
List all active services.

- Auth required: No
- Query params: none
- Response `200`:
```json
{
  "success": true,
  "message": "",
  "data": [
    {
      "id": 1,
      "title": "Software Development",
      "slug": "software-development",
      "description": "Custom backends and platforms...",
      "icon": "Code2",
      "is_active": true,
      "order": 1,
      "created_at": "2025-05-24T10:30:00Z"
    }
  ]
}
```
- Nullable fields: `icon` (empty string if not set)
- Icon strategy: Frontend maps `icon` string to Lucide React component locally

---

### GET /api/services/:slug/
Single service detail.

- Auth required: No
- Response `200`: Same shape as list item above
- Error `404`:
```json
{ "success": false, "message": "Not found.", "errors": {} }
```

---

## Portfolio

### GET /api/portfolio/
List all projects.

- Auth required: No
- Query params:
  - `?featured=true` — featured projects only
  - `?tag=Healthcare` — filter by industry tag
- Response `200`:
```json
{
  "success": true,
  "message": "",
  "data": [
    {
      "id": 1,
      "title": "MediCare Plus",
      "slug": "medicare-plus",
      "tag": "Healthcare",
      "description": "Hospital management system...",
      "key_metric": "40% faster intake",
      "thumbnail": "https://domain.com/media/portfolio/medicare.jpg",
      "service": {
        "id": 1,
        "title": "Software Development",
        "slug": "software-development",
        "description": "...",
        "icon": "Code2",
        "is_active": true,
        "order": 1,
        "created_at": "2025-05-24T10:30:00Z"
      },
      "client_name": "MediCare Group",
      "project_url": "https://medicare.example.com",
      "is_featured": true,
      "order": 1,
      "created_at": "2025-05-24T10:30:00Z"
    }
  ]
}
```
- Nullable fields: `thumbnail` (null if no image), `service` (null if unlinked), `client_name` (empty string), `project_url` (empty string), `tag` (empty string), `key_metric` (empty string)

---

### GET /api/portfolio/:slug/
Single project detail.

- Auth required: No
- Response `200`: Same shape as list item above
- Error `404`: Standard error response

---

## Blog

### GET /api/blog/posts/
List published posts (lightweight — no content field).

- Auth required: No
- Query params:
  - `?category=engineering` — filter by category slug
  - `?page=1` — pagination
  - `?page_size=10` — items per page (max 100)
- Response `200` (paginated):
```json
{
  "success": true,
  "message": "",
  "data": {
    "count": 12,
    "next": "http://localhost:8000/api/blog/posts/?page=2",
    "previous": null,
    "results": [
      {
        "id": 1,
        "title": "Building Scalable APIs",
        "slug": "building-scalable-apis",
        "excerpt": "A practical guide to...",
        "author_name": "Khalid Abdillahi",
        "category": {
          "id": 1,
          "name": "Engineering",
          "slug": "engineering"
        },
        "thumbnail": "https://domain.com/media/blog/post1.jpg",
        "read_time": 6,
        "published_at": "2025-05-24T10:30:00Z"
      }
    ]
  }
}
```
- Nullable fields: `thumbnail` (null), `category` (null), `excerpt` (empty string), `author_name` (null if author deleted)

---

### GET /api/blog/posts/:slug/
Full post detail including content.

- Auth required: No
- Response `200`:
```json
{
  "success": true,
  "message": "",
  "data": {
    "id": 1,
    "title": "Building Scalable APIs",
    "slug": "building-scalable-apis",
    "excerpt": "A practical guide to...",
    "author_name": "Khalid Abdillahi",
    "category": { "id": 1, "name": "Engineering", "slug": "engineering" },
    "content": "Full markdown/HTML content here...",
    "thumbnail": "https://domain.com/media/blog/post1.jpg",
    "read_time": 6,
    "status": "published",
    "published_at": "2025-05-24T10:30:00Z",
    "created_at": "2025-05-24T09:00:00Z"
  }
}
```

---

### GET /api/blog/categories/
List all blog categories.

- Auth required: No
- Response `200`:
```json
{
  "success": true,
  "message": "",
  "data": [
    { "id": 1, "name": "Engineering", "slug": "engineering" },
    { "id": 2, "name": "Product Design", "slug": "product-design" }
  ]
}
```

---

## Contacts

### POST /api/contacts/inquiries/
Submit a contact form inquiry.

- Auth required: No
- Request (frontend field names):
```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "company": "Acme Inc.",
  "service": "Software Development",
  "message": "We are looking to build a platform..."
}
```
- Required fields: `name`, `email`, `message`
- Optional fields: `company`, `service`
- Response `201`:
```json
{
  "success": true,
  "message": "Your message has been received. We will be in touch soon.",
  "data": null
}
```
- Error `400`:
```json
{
  "success": false,
  "message": "An error occurred.",
  "errors": {
    "email": ["Enter a valid email address."],
    "message": ["This field may not be blank."]
  }
}
```

---

## Testimonials

### GET /api/testimonials/
List all active testimonials.

- Auth required: No
- Response `200`:
```json
{
  "success": true,
  "message": "",
  "data": [
    {
      "id": 1,
      "name": "Khalid Sh. Xareed",
      "role": "VP Engineering",
      "company": "Northwind",
      "quote": "The team moved faster than any vendor we have worked with...",
      "avatar": "https://domain.com/media/testimonials/khalid.jpg",
      "order": 1
    }
  ]
}
```
- Nullable fields: `avatar` (null if no image uploaded), `company` (empty string)

---

## Field Mapping Reference (Frontend → Backend)

### ContactForm
| Frontend field | Backend field | Notes |
|---|---|---|
| `name` | `full_name` | Mapped via serializer `source` |
| `email` | `email` | Direct match |
| `company` | `company` | Direct match |
| `service` | `service_interest` | Mapped via serializer `source` |
| `message` | `message` | Direct match |

### BlogGrid Article
| Frontend field | Backend field | Notes |
|---|---|---|
| `title` | `title` | Direct match |
| `body` | `excerpt` | Use excerpt for list, content for detail |
| `date` | `published_at` | Format: `May 28, 2025` from ISO string |
| `readTime` | `read_time` | Integer minutes — format as `"6 min"` on frontend |
| `author` | `author_name` | Direct match |
| `image` | `thumbnail` | Full absolute URL |
| `category` | `category.name` | Nested object |

### Projects / Case Studies
| Frontend field | Backend field | Notes |
|---|---|---|
| `tag` | `tag` | Direct match |
| `title` | `title` | Direct match |
| `body` | `description` | Direct match |
| `metric` | `key_metric` | Direct match |
| `Icon` | `service.icon` or hardcoded | Map string → Lucide component on frontend |

---

## Icon Strategy

Backend stores icon name as a string. Frontend maps to Lucide component.

Backend returns:
```json
{ "icon": "Code2" }
```

Frontend mapping example (TypeScript):
```ts
import { Code2, Layout, Brain, Box } from 'lucide-react'
const ICON_MAP = { Code2, Layout, Brain, Box }
const Icon = ICON_MAP[service.icon] ?? Code2
```

---

## HTTP Status Codes Used

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Not authorized (not staff) |
| 404 | Not found |
| 500 | Server error |
