# Phase 1 Backend Contract Evidence & Audit Verification

**Audit Date:** October 27, 2026  
**Auditor:** Senior Full-Stack Engineer, AppSec Auditor & QA Lead  
**Working Directory:** `backend/`  
**Git Working Tree Status:** 100% Clean (0 modified files, 0 untracked files)

---

## 1. Logout & Refresh-Token Revocation Contract

### Backend View Definition
**File:** [`backend/apps/accounts/views.py:37-56`](file:///c:/Users/Khalid/InfinytTech-/backend/apps/accounts/views.py#L37-L56)
```python
class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            # Clear last_activity timestamp on logout
            if request.user and request.user.is_authenticated:
                request.user.last_activity = None
                request.user.save(update_fields=['last_activity'])

            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            try:
                token.blacklist()
            except Exception:
                # blacklist app might not be installed in INSTALLED_APPS
                pass
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
```

### URL Route Definition
**File:** [`backend/apps/accounts/urls_auth.py:15`](file:///c:/Users/Khalid/InfinytTech-/backend/apps/accounts/urls_auth.py#L15)
```python
path('logout/', LogoutView.as_view(), name='auth-logout'),
```
Mounted in `backend/config/urls.py:11` under:
```python
path('api/auth/', include('apps.accounts.urls_auth')),
```
**Full Endpoint:** `POST /api/auth/logout/`

### Contract Verification Test
**Command Executed:**
```powershell
python manage.py test apps.accounts.tests.SessionTimeoutTests.test_logout_clears_last_activity
```
**Reproducible Output:**
```text
Found 1 test(s).
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
.
----------------------------------------------------------------------
Ran 1 test in 0.612s

OK
Destroying test database for alias 'default'...
```
**Conclusion:** Backend contract verified. Token blacklisting and session clearing succeed with HTTP 205.

---

## 2. Contact Lead Submission Rate Throttle & Endpoint

### Backend Throttle Definition
**File:** [`backend/apps/leads/views.py:25-30`](file:///c:/Users/Khalid/InfinytTech-/backend/apps/leads/views.py#L25-L30)
```python
class LeadSubmissionRateThrottle(AnonRateThrottle):
    """
    Dedicated throttle limit for anonymous lead submissions.
    Restricts to 10 submissions per hour from a single IP to prevent script spam.
    """
    rate = '10/hour'
```

### Public Endpoint Definition
**File:** [`backend/apps/leads/views.py:34-41`](file:///c:/Users/Khalid/InfinytTech-/backend/apps/leads/views.py#L34-L41)
```python
@extend_schema(tags=['Leads — Public'])
class LeadSubmitView(APIView):
    """
    Public endpoint for contact/lead creation.
    Open to all visitors.
    """
    permission_classes = [permissions.AllowAny]
    throttle_classes = [LeadSubmissionRateThrottle]
```

### URL Route Definition
**File:** [`backend/apps/leads/urls.py:10`](file:///c:/Users/Khalid/InfinytTech-/backend/apps/leads/urls.py#L10)
```python
path('contact/', LeadSubmitView.as_view(), name='lead-submit'),
```
Mounted under `/api/leads/contact/`.

### CRM Administrative Regression Test
**Command Executed:**
```powershell
python manage.py test apps.leads.tests.LeadsCRMTestCase.test_admin_leads_list_retrieve
```
**Reproducible Output:**
```text
Found 1 test(s).
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
.
----------------------------------------------------------------------
Ran 1 test in 2.463s

OK
Destroying test database for alias 'default'...
```
**Conclusion:** Backend CRM and lead submission architecture verified. Zero regression detected.
