# API Documentation

## Swagger UI
Available at: `http://localhost:8000/api/docs/`
Schema JSON: `http://localhost:8000/api/schema/`

## Authentication
All protected endpoints require:
```
Authorization: Bearer <access_token>
```

## Standard Response Format
```json
{
  "success": true,
  "message": "",
  "data": {}
}
```

## Error Response Format
```json
{
  "success": false,
  "message": "Human-readable error",
  "errors": { "field": ["error detail"] }
}
```

## Endpoints

### Auth
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | /api/auth/login/ | No | Get JWT tokens |
| POST | /api/auth/refresh/ | No | Refresh access token |
| GET | /api/auth/me/ | Yes | Get current user |

### Services
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | /api/services/ | No | List all services |
| GET | /api/services/:slug/ | No | Service detail |

### Portfolio
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | /api/portfolio/ | No | List projects |
| GET | /api/portfolio/:slug/ | No | Project detail |

### Blog
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | /api/blog/posts/ | No | List published posts |
| GET | /api/blog/posts/:slug/ | No | Post detail |
| GET | /api/blog/categories/ | No | List categories |

### Contacts
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | /api/contacts/inquiries/ | No | Submit contact form |
| GET | /api/contacts/admin/inquiries/ | Admin | List all inquiries |
| GET | /api/contacts/admin/inquiries/:id/ | Admin | Inquiry detail |
| PUT | /api/contacts/admin/inquiries/:id/ | Admin | Update inquiry status |
