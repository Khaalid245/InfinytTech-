"""
Live End-to-End Workflow Verification Script
Tests against running Django dev server (http://127.0.0.1:8000).
"""
import urllib.request
import urllib.error
import json
import sys

BASE_URL = 'http://127.0.0.1:8000'

def request(url, method='GET', data=None, token=None):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    encoded_data = json.dumps(data).encode('utf-8') if data else None
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode('utf-8')
            return resp.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        return e.code, json.loads(body) if body else {}

def run_e2e():
    print("=" * 60)
    print("PHASE 22.6: LIVE END-TO-END WORKFLOW INTEGRATION VERIFICATION")
    print("=" * 60)

    # 1. Public Lead Submission
    print("\n[Step 1] Visitor submits contact inquiry via POST /api/leads/contact/ ...")
    lead_payload = {
        'first_name': 'Enterprise',
        'last_name': 'Prospect',
        'email': 'prospect@enterprise-ai.com',
        'phone': '+1-555-901-2345',
        'company': 'Enterprise AI Corp',
        'project_type': 'Systems & App Engineering',
        'message': 'We are looking to migrate our legacy architecture to high-performance microservices.',
        'source': 'Live E2E Verification'
    }
    status, body = request(f'{BASE_URL}/api/leads/contact/', method='POST', data=lead_payload)
    print(f"  -> HTTP Status: {status}")
    assert status == 201, f"Expected 201, got {status}: {body}"
    lead_data = body.get('data', body)
    lead_id = lead_data.get('id')
    print(f"  -> Lead Created Successfully: ID={lead_id}, Name={lead_data.get('first_name')} {lead_data.get('last_name')}")

    # 2. Admin Authentication
    print("\n[Step 2] Administrator logs in via POST /api/auth/login/ ...")
    login_payload = {
        'email': 'admin@infinyttech.com',
        'password': 'Admin123!'
    }
    status, body = request(f'{BASE_URL}/api/auth/login/', method='POST', data=login_payload)
    print(f"  -> HTTP Status: {status}")
    assert status == 200, f"Expected 200, got {status}: {body}"
    access_token = body.get('access')
    refresh_token = body.get('refresh')
    user_info = body.get('user', {})
    print(f"  -> Authenticated: email={user_info.get('email')}, role={user_info.get('role')}")
    assert access_token, "No access token returned"

    # 3. Verify Current User Profile
    print("\n[Step 3] Fetch authenticated user profile via GET /api/auth/me/ ...")
    status, body = request(f'{BASE_URL}/api/auth/me/', method='GET', token=access_token)
    print(f"  -> HTTP Status: {status}, Email: {body.get('email')}, Role: {body.get('role')}")
    assert status == 200, f"Expected 200, got {status}"

    # 4. Admin Retrieves Leads List
    print("\n[Step 4] Admin retrieves inquiries via GET /api/leads/ ...")
    status, body = request(f'{BASE_URL}/api/leads/', method='GET', token=access_token)
    print(f"  -> HTTP Status: {status}")
    assert status == 200, f"Expected 200, got {status}"
    leads = body.get('data', {}).get('results', [])
    matching_lead = next((l for l in leads if l.get('id') == lead_id), None)
    assert matching_lead is not None, f"Lead {lead_id} not found in admin response"
    print(f"  -> Verified Lead Present in Admin List: {matching_lead.get('email')}, Status={matching_lead.get('status')}")

    # 5. Admin Updates Inquiry Status
    print("\n[Step 5] Admin updates lead status via PATCH /api/leads/<id>/ ...")
    patch_payload = {
        'status': 'contacted',
        'priority': 'high',
        'notes': 'Initial consultation scheduled for next Tuesday.'
    }
    status, body = request(f'{BASE_URL}/api/leads/{lead_id}/', method='PATCH', data=patch_payload, token=access_token)
    print(f"  -> HTTP Status: {status}")
    assert status == 200, f"Expected 200, got {status}: {body}"
    updated_lead = body.get('data', body)
    print(f"  -> Updated Lead Status: {updated_lead.get('status')}, Priority={updated_lead.get('priority')}")
    assert updated_lead.get('status') == 'contacted'

    # 6. Admin Verifies Email Diagnostics
    print("\n[Step 6] Admin verifies SMTP status via GET /api/site-settings/admin/email_status/ ...")
    status, body = request(f'{BASE_URL}/api/site-settings/admin/email_status/', method='GET', token=access_token)
    print(f"  -> HTTP Status: {status}")
    assert status == 200, f"Expected 200, got {status}: {body}"
    print(f"  -> SMTP Diagnostics: configured={body.get('configured')}, provider={body.get('provider')}, sender={body.get('sender_email')}")

    # 7. Admin Logout
    print("\n[Step 7] Admin logs out via POST /api/auth/logout/ ...")
    status, body = request(f'{BASE_URL}/api/auth/logout/', method='POST', data={'refresh': refresh_token}, token=access_token)
    print(f"  -> HTTP Status: {status}")
    assert status == 205, f"Expected 205, got {status}: {body}"
    print("  -> Session successfully cleared and refreshed token blacklisted.")

    print("\n" + "=" * 60)
    print("ALL 7 LIVE BACKEND E2E CHECKS SUCCEEDED WITH ZERO ERRORS!")
    print("=" * 60)

if __name__ == '__main__':
    run_e2e()
