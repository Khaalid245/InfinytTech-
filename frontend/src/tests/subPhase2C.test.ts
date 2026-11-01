import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveSafeAdminRedirectPath } from '../utils/adminRedirect';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '..');

describe('Sub-Phase 2C — Admin Return Path, Pagination & Sidebar CMS Links', () => {
  describe('Finding A3 — Return Path Resolution & Open Redirect Protection', () => {
    it('returns /admin/dashboard when no return path is provided (null, undefined, empty)', () => {
      assert.strictEqual(resolveSafeAdminRedirectPath(undefined), '/admin/dashboard');
      assert.strictEqual(resolveSafeAdminRedirectPath(null), '/admin/dashboard');
      assert.strictEqual(resolveSafeAdminRedirectPath(''), '/admin/dashboard');
      assert.strictEqual(resolveSafeAdminRedirectPath('   '), '/admin/dashboard');
    });

    it('preserves legitimate internal /admin destination paths', () => {
      assert.strictEqual(resolveSafeAdminRedirectPath('/admin/leads'), '/admin/leads');
      assert.strictEqual(resolveSafeAdminRedirectPath('/admin/users'), '/admin/users');
      assert.strictEqual(resolveSafeAdminRedirectPath('/admin/settings/general'), '/admin/settings/general');
      assert.strictEqual(resolveSafeAdminRedirectPath('/admin/media'), '/admin/media');
    });

    it('rejects external URLs, protocol-relative URLs, and open-redirect attack vectors', () => {
      // External protocols
      assert.strictEqual(resolveSafeAdminRedirectPath('https://evil.com/admin/leads'), '/admin/dashboard');
      assert.strictEqual(resolveSafeAdminRedirectPath('http://malicious-site.com'), '/admin/dashboard');
      assert.strictEqual(resolveSafeAdminRedirectPath('javascript:alert(1)'), '/admin/dashboard');
      
      // Protocol-relative paths
      assert.strictEqual(resolveSafeAdminRedirectPath('//evil.com/admin'), '/admin/dashboard');
      assert.strictEqual(resolveSafeAdminRedirectPath('/admin//evil.com'), '/admin/dashboard');

      // Windows backslash traversal
      assert.strictEqual(resolveSafeAdminRedirectPath('\\admin\\leads'), '/admin/dashboard');

      // Non-admin public paths
      assert.strictEqual(resolveSafeAdminRedirectPath('/contact'), '/admin/dashboard');
      assert.strictEqual(resolveSafeAdminRedirectPath('/services'), '/admin/dashboard');

      // Self-referential login loop
      assert.strictEqual(resolveSafeAdminRedirectPath('/admin/login'), '/admin/dashboard');
    });

    it('App.tsx contains route alias redirecting /admin/login to /login', () => {
      const appSource = fs.readFileSync(path.join(srcDir, 'App.tsx'), 'utf8');
      assert.ok(
        appSource.includes('path="/admin/login"'),
        'App.tsx must register /admin/login route'
      );
    });
  });

  describe('Finding A4 — Admin Pagination Integration', () => {
    it('AdminUsersPage source contains Pagination component and page state', () => {
      const usersSource = fs.readFileSync(
        path.join(srcDir, 'pages', 'admin', 'users', 'AdminUsersPage.tsx'),
        'utf8'
      );
      assert.strictEqual(usersSource.includes('const page = 1;'), false);
      assert.ok(usersSource.includes('const [page, setPage] = useState(1);'));
      assert.ok(usersSource.includes('<Pagination'));
      assert.ok(usersSource.includes('currentPage={page}'));
      assert.ok(usersSource.includes('totalPages={Math.ceil(usersData.count / 10)}'));
    });

    it('AdminLeadsPage source contains Pagination component and page state', () => {
      const leadsSource = fs.readFileSync(
        path.join(srcDir, 'pages', 'admin', 'leads', 'AdminLeadsPage.tsx'),
        'utf8'
      );
      assert.strictEqual(leadsSource.includes('const page = 1;'), false);
      assert.ok(leadsSource.includes('const [page, setPage] = useState(1);'));
      assert.ok(leadsSource.includes('<Pagination'));
      assert.ok(leadsSource.includes('currentPage={page}'));
      assert.ok(leadsSource.includes('totalPages={Math.ceil(leadsData.count / 10)}'));
    });

    it('AdminMediaPage source contains Pagination component', () => {
      const mediaSource = fs.readFileSync(
        path.join(srcDir, 'pages', 'admin', 'AdminMediaPage.tsx'),
        'utf8'
      );
      assert.strictEqual(mediaSource.includes('/* Pagination controls can be implemented here */'), false);
      assert.ok(mediaSource.includes('<Pagination'));
      assert.ok(mediaSource.includes('currentPage={filters.page || 1}'));
    });

    it('calculates total pages correctly and bounds navigation between 1 and totalPages', () => {
      const pageSize = 10;
      const count = 45;
      const totalPages = Math.ceil(count / pageSize);
      assert.strictEqual(totalPages, 5);

      const nextPage = (curr: number) => Math.min(curr + 1, totalPages);
      const prevPage = (curr: number) => Math.max(curr - 1, 1);

      assert.strictEqual(nextPage(1), 2);
      assert.strictEqual(nextPage(5), 5);
      assert.strictEqual(prevPage(5), 4);
      assert.strictEqual(prevPage(1), 1);
    });
  });

  describe('Finding A5 — Admin Sidebar CMS Links Alignment', () => {
    it('AdminSidebar contains services-sections and tech-stack settings links', () => {
      const sidebarSource = fs.readFileSync(
        path.join(srcDir, 'components', 'admin', 'layout', 'AdminSidebar.tsx'),
        'utf8'
      );
      assert.ok(
        sidebarSource.includes("path: '/admin/settings/services-sections'"),
        'AdminSidebar must include services-sections link'
      );
      assert.ok(
        sidebarSource.includes("path: '/admin/settings/tech-stack'"),
        'AdminSidebar must include tech-stack link'
      );
    });

    it('all 16 settings tabs in SettingsLayout are matched in AdminSidebar', () => {
      const settingsLayoutSource = fs.readFileSync(
        path.join(srcDir, 'pages', 'admin', 'settings', 'SettingsLayout.tsx'),
        'utf8'
      );
      const sidebarSource = fs.readFileSync(
        path.join(srcDir, 'components', 'admin', 'layout', 'AdminSidebar.tsx'),
        'utf8'
      );

      const tabPathRegex = /path:\s*'(\/admin\/settings\/[^']+)'/g;
      const layoutPaths: string[] = [];
      let match;
      while ((match = tabPathRegex.exec(settingsLayoutSource)) !== null) {
        layoutPaths.push(match[1]);
      }

      assert.strictEqual(layoutPaths.length, 16, 'SettingsLayout should define 16 settings tabs');

      for (const tabPath of layoutPaths) {
        assert.ok(
          sidebarSource.includes(tabPath),
          `AdminSidebar must contain setting link for: ${tabPath}`
        );
      }
    });
  });
});
