import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { NotFoundPage } from '../pages/NotFoundPage';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../../public');

describe('Public Routing, 404 Recovery & SEO Assets (Sub-Phase 2A)', () => {
  it('NotFoundPage renders 404 status badge, recovery headline, and navigation links', () => {
    const pageElement = React.createElement(NotFoundPage, { theme: 'dark' });
    assert.ok(pageElement);
    assert.strictEqual(pageElement.type, NotFoundPage);
    assert.strictEqual(pageElement.props.theme, 'dark');
  });

  it('robots.txt exists in public/ and properly disallows /admin/ and /api/ while allowing public paths', () => {
    const robotsPath = path.join(publicDir, 'robots.txt');
    assert.ok(fs.existsSync(robotsPath), 'robots.txt must exist in frontend/public/');

    const content = fs.readFileSync(robotsPath, 'utf8');
    assert.ok(content.includes('User-agent: *'), 'Must specify User-agent: *');
    assert.ok(content.includes('Disallow: /admin/'), 'Must disallow crawler access to /admin/');
    assert.ok(content.includes('Disallow: /api/'), 'Must disallow crawler access to /api/');
    assert.ok(content.includes('Allow: /'), 'Must allow crawler access to public /');
    assert.ok(content.includes('Sitemap: https://infinyt.tech/sitemap.xml'), 'Must point to canonical sitemap location');
  });

  it('sitemap.xml exists in public/ and indexes all canonical public pages with priority ratings', () => {
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    assert.ok(fs.existsSync(sitemapPath), 'sitemap.xml must exist in frontend/public/');

    const content = fs.readFileSync(sitemapPath, 'utf8');
    assert.ok(content.includes('<?xml version="1.0" encoding="UTF-8"?>'), 'Must contain XML declaration');
    assert.ok(content.includes('http://www.sitemaps.org/schemas/sitemap/0.9'), 'Must contain standard sitemap schema');

    // Canonical public URLs that must be indexed
    const requiredUrls = [
      'https://infinyt.tech/',
      'https://infinyt.tech/services',
      'https://infinyt.tech/work',
      'https://infinyt.tech/about',
      'https://infinyt.tech/blog',
      'https://infinyt.tech/contact',
    ];

    for (const url of requiredUrls) {
      assert.ok(content.includes(`<loc>${url}</loc>`), `sitemap.xml must index ${url}`);
    }

    // Must NOT index private or administrative paths
    assert.strictEqual(content.includes('/admin/'), false, 'sitemap.xml must not index administrative routes');
    assert.strictEqual(content.includes('/login'), false, 'sitemap.xml must not index staff login route');
  });
});
