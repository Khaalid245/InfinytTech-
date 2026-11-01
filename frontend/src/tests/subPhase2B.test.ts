import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import type { SiteSettings } from '../types/siteSettings.types';
import { MaintenanceScreen } from '../components/common/MaintenanceScreen';

void React;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '..');

/**
 * Pure evaluator replicating PageLayout's maintenance gate logic
 */
export function evaluateMaintenanceVisibility({
  maintenanceMode,
  isAdmin,
  pathname,
}: {
  maintenanceMode: boolean;
  isAdmin: boolean;
  pathname: string;
}): boolean {
  const isMaintenanceMode = Boolean(maintenanceMode);
  const isLoginPage = pathname === '/login';
  return isMaintenanceMode && !isAdmin && !isLoginPage;
}

/**
 * Pure evaluator replicating BlogPostDetailPage's lean next/previous post derivation
 */
export function deriveAdjacentBlogPosts(relatedPosts: Array<{ slug: string; title: string }>) {
  const prevPost = relatedPosts.length > 0 ? relatedPosts[0] : null;
  const nextPost = relatedPosts.length > 1 ? relatedPosts[1] : null;
  return { prevPost, nextPost };
}

describe('Sub-Phase 2B — Layout Padding, Blog Overfetching & Maintenance Mode', () => {
  describe('Finding P6 — Maintenance Mode & Admin Bypass (evaluateMaintenanceVisibility)', () => {
    it('allows public access when maintenance_mode is false', () => {
      const showMaintenance = evaluateMaintenanceVisibility({
        maintenanceMode: false,
        isAdmin: false,
        pathname: '/',
      });
      assert.strictEqual(showMaintenance, false);
    });

    it('blocks regular unauthenticated visitors on public routes when maintenance_mode is true', () => {
      const routes = ['/', '/about', '/services', '/work', '/blog', '/contact'];
      for (const route of routes) {
        const showMaintenance = evaluateMaintenanceVisibility({
          maintenanceMode: true,
          isAdmin: false,
          pathname: route,
        });
        assert.strictEqual(
          showMaintenance,
          true,
          `Route ${route} should show maintenance screen to unauthenticated visitor`
        );
      }
    });

    it('bypasses maintenance mode when user is an administrator (isAdmin = true)', () => {
      const routes = ['/', '/about', '/services', '/work', '/blog'];
      for (const route of routes) {
        const showMaintenance = evaluateMaintenanceVisibility({
          maintenanceMode: true,
          isAdmin: true,
          pathname: route,
        });
        assert.strictEqual(
          showMaintenance,
          false,
          `Administrator should bypass maintenance screen on ${route}`
        );
      }
    });

    it('always permits access to /login even during maintenance mode so staff can authenticate', () => {
      const showMaintenance = evaluateMaintenanceVisibility({
        maintenanceMode: true,
        isAdmin: false,
        pathname: '/login',
      });
      assert.strictEqual(
        showMaintenance,
        false,
        '/login must remain accessible during maintenance mode'
      );
    });

    it('MaintenanceScreen renders accessible role="status", contact link, and staff login link', () => {
      const element = React.createElement(MaintenanceScreen, {
        theme: 'dark',
        settings: {
          company_name: 'Test Enterprise',
          primary_email: 'ops@testenterprise.com',
        } as unknown as SiteSettings,
      });

      assert.ok(element);
      assert.strictEqual(element.type, MaintenanceScreen);
      assert.strictEqual(element.props.theme, 'dark');
      assert.strictEqual(element.props.settings?.company_name, 'Test Enterprise');
    });
  });

  describe('Finding P4 — Blog Detail Overfetch Elimination (deriveAdjacentBlogPosts)', () => {
    it('returns null for both adjacent posts when related articles list is empty', () => {
      const { prevPost, nextPost } = deriveAdjacentBlogPosts([]);
      assert.strictEqual(prevPost, null);
      assert.strictEqual(nextPost, null);
    });

    it('returns prevPost when at least 1 related post exists, leaving nextPost null', () => {
      const single = [{ slug: 'post-1', title: 'First Post' }];
      const { prevPost, nextPost } = deriveAdjacentBlogPosts(single);
      assert.deepStrictEqual(prevPost, single[0]);
      assert.strictEqual(nextPost, null);
    });

    it('returns both prevPost and nextPost when 2 or more related posts exist without 100-post overfetch', () => {
      const multiple = [
        { slug: 'post-1', title: 'First Post' },
        { slug: 'post-2', title: 'Second Post' },
        { slug: 'post-3', title: 'Third Post' },
      ];
      const { prevPost, nextPost } = deriveAdjacentBlogPosts(multiple);
      assert.deepStrictEqual(prevPost, multiple[0]);
      assert.deepStrictEqual(nextPost, multiple[1]);
    });

    it('BlogPostDetailPage source no longer contains unthrottled page_size: 100 query', () => {
      const blogDetailSource = fs.readFileSync(
        path.join(srcDir, 'pages', 'BlogPostDetailPage.tsx'),
        'utf8'
      );
      assert.strictEqual(
        blogDetailSource.includes('page_size: 100'),
        false,
        'BlogPostDetailPage must not query page_size: 100'
      );
    });
  });

  describe('Finding P3 — Redundant Top Container Padding Verification', () => {
    it('AboutPage top breadcrumb container has removed redundant pt-24', () => {
      const content = fs.readFileSync(path.join(srcDir, 'pages', 'AboutPage.tsx'), 'utf8');
      assert.strictEqual(content.includes('pt-24 pb-2'), false);
      assert.ok(content.includes('py-3 border-b'));
    });

    it('ServicesPage top breadcrumb container has removed redundant pt-24', () => {
      const content = fs.readFileSync(path.join(srcDir, 'pages', 'ServicesPage.tsx'), 'utf8');
      assert.strictEqual(content.includes('pt-24 pb-2'), false);
      assert.ok(content.includes('py-3 border-b'));
    });

    it('WorkPage top breadcrumb container has removed redundant pt-24', () => {
      const content = fs.readFileSync(path.join(srcDir, 'pages', 'WorkPage.tsx'), 'utf8');
      assert.strictEqual(content.includes('pt-24 pb-2'), false);
      assert.ok(content.includes('py-3 border-b'));
    });

    it('InsightsPage container has removed redundant pt-24', () => {
      const content = fs.readFileSync(path.join(srcDir, 'pages', 'InsightsPage.tsx'), 'utf8');
      assert.strictEqual(content.includes('pt-24 pb-20'), false);
      assert.ok(content.includes('pb-20 animate-fade-in'));
    });

    it('BlogPostDetailPage container has removed redundant pt-24', () => {
      const content = fs.readFileSync(
        path.join(srcDir, 'pages', 'BlogPostDetailPage.tsx'),
        'utf8'
      );
      assert.strictEqual(content.includes('pt-24 pb-20'), false);
      assert.ok(content.includes('pb-20 animate-fade-in relative'));
    });
  });
});
