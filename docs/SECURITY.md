# Security Architecture & Implementation Guide

This document provides a technical deep-dive into the security architecture of the InfinytTech platform.

---

## Overview

The InfinytTech platform employs an enterprise-grade, dynamic security architecture. Security policies are non-hardcoded and can be adjusted dynamically at runtime via the Admin Dashboard under **Platform Settings → Security**. Changes take effect immediately without requiring code modifications or server restarts.

---

## Key Security Features

### 1. Dynamic Password Policy
- **Levels**:
  - `RELAXED`: Minimum 6 characters.
  - `STANDARD`: Minimum 8 characters, requiring uppercase, lowercase, and numeric characters.
  - `STRICT`: Minimum 12 characters, requiring uppercase, lowercase, numeric, and special characters.
- **Enforcement**: Validated at runtime by `SitePasswordValidator` (`apps.accounts.validators.SitePasswordValidator`) during registration, password resets, and user updates.

### 2. Account Lockout & Protection
- **Mechanism**: Tracks consecutive failed login attempts on the `User` model (`failed_login_attempts`, `lockout_until`).
- **Policy**: When failed attempts reach `max_login_attempts`, the account is locked for `lockout_duration` minutes.
- **Manual Unlock**: Superadmins/Admins can manually reset lockout counters and unlock users directly from the Admin Dashboard.

### 3. Session Timeout & Inactivity Enforcement
- **Enforcement**: Handles both JWT and Session-based authentication.
- **JWT**: `SessionTimeoutJWTAuthentication` (`apps.accounts.authentication`) verifies user activity timestamps on protected API requests.
- **Middleware**: `SessionTimeoutMiddleware` (`apps.accounts.middleware`) enforces idle session timeouts for Django Admin sessions.
- **Configurable**: Inactivity timeout (in minutes) is read dynamically from `SiteSettings`.

### 4. Dynamic API Rate Limiting
- **Throttling Scopes**:
  - `login`: Anonymous login endpoint (`LoginRateThrottle`) — defaults to 10 requests/min/IP.
  - `api_user`: Authenticated API requests (`ApiUserRateThrottle`) — defaults to 300 requests/min/user.
  - `api_anon`: Anonymous general API requests (`ApiAnonRateThrottle`) — fixed at 60 requests/min/IP.
- **Dynamic Calculation**: Limits are computed lazily per request from `SiteSettings` via cached lookups (`apps.site_settings.services.get_active_site_settings`).

### 5. Enterprise Security Headers
- **Middleware**: `SecurityHeadersMiddleware` (`apps.core.middleware.SecurityHeadersMiddleware`) injects additional security headers:
  - `Content-Security-Policy`: Restricts resource loading sources (`default-src 'self'`).
  - `Permissions-Policy`: Disables sensitive browser permissions (geolocation, camera, microphone).
- **Django Built-ins**:
  - `X-Frame-Options: DENY`
  - `SECURE_CONTENT_TYPE_NOSNIFF: True`
  - `SECURE_REFERRER_POLICY: same-origin`
  - `Strict-Transport-Security` (HSTS enabled in production: 1 year duration, include subdomains, preload).

### 6. Dynamic CORS Management
- **Implementation**: Utilizes `django-cors-headers` signal receiver `check_request_enabled` (`apps.site_settings.signals.dynamic_cors_origin_check`).
- **Allow-List Matching**: Matches incoming `Origin` headers against comma-separated domains configured in `SiteSettings.allowed_origins`.
- **Production Hardening**: `CORS_ALLOW_ALL_ORIGINS = False` is strictly enforced. Wildcard (`*`) origins are never returned in production.
- **Development Fallback**: Localhost development origins (`localhost:3000`, `localhost:5173`, `127.0.0.1:5173`) are supported locally.

### 7. Audit & Activity Logging
- **Model**: `UserActivity` (`apps.accounts.models.UserActivity`) captures audit logs for critical security events:
  - User Logins & Logouts
  - Failed Login Attempts
  - Password Updates & Resets
  - Account Lockouts & Unlocks
- **Admin Visibility**: Activity logs are queryable via the Admin API (`/api/site-settings/admin/audit_logs/`).

---

## Configuration & Management

All security configurations are accessible via the Frontend Admin interface under **Settings > Security Settings** or via the Django Admin.

| Setting Field | Model Field | Default Value | Description |
|---|---|---|---|
| Password Policy | `password_policy` | `STRICT` | Enforcement rules for user passwords |
| Session Timeout | `session_timeout` | `1440` (min) | Inactivity period before automatic session termination |
| Max Login Attempts | `max_login_attempts` | `5` | Maximum failed attempts allowed before lockout |
| Lockout Duration | `lockout_duration` | `15` (min) | Duration of account lockout after max failed attempts |
| API Rate Limit | `api_rate_limit` | `300` (req/min) | Rate limit per minute for authenticated users |
| Login Rate Limit | `login_rate_limit` | `10` (req/min) | Rate limit per minute for login attempts per IP |
| Allowed Origins | `allowed_origins` | `""` | Comma-separated list of CORS allowed origins |

---

## Verification & Testing Guide

To verify security implementations:
1. **Password Policy**: Attempt creating/updating a password with weak credentials and verify policy validation errors.
2. **Account Lockout**: Execute consecutive failed login attempts; verify `403 Forbidden` lockout response and check manual unlock in Admin.
3. **Session Timeout**: Simulate idle period exceeding `session_timeout` and verify token/session invalidation.
4. **Rate Limiting**: Exceed rate limit thresholds and verify `429 Too Many Requests` status with `Retry-After` header.
5. **CORS**: Send OPTIONS pre-flight request with configured vs unconfigured origins; confirm headers are added only for valid origins.
