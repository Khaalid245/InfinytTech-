import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '..');

describe('Sub-Phase 2D — Dialog Accessibility & Object URL Lifecycle Management', () => {
  describe('Finding A6 — Modal Dialog Accessibility & Keyboard Navigation', () => {
    it('ConfirmDialog implements role="dialog", aria-modal="true", and labeling semantics', () => {
      const confirmSource = fs.readFileSync(
        path.join(srcDir, 'components', 'admin', 'shared', 'ConfirmDialog.tsx'),
        'utf8'
      );

      assert.ok(
        confirmSource.includes('role="dialog"'),
        'ConfirmDialog must include role="dialog"'
      );
      assert.ok(
        confirmSource.includes('aria-modal="true"'),
        'ConfirmDialog must include aria-modal="true"'
      );
      assert.ok(
        confirmSource.includes('aria-labelledby="confirm-dialog-title"'),
        'ConfirmDialog must associate title with aria-labelledby'
      );
      assert.ok(
        confirmSource.includes('aria-describedby="confirm-dialog-description"'),
        'ConfirmDialog must associate description with aria-describedby'
      );
      assert.ok(
        confirmSource.includes('id="confirm-dialog-title"'),
        'ConfirmDialog must assign confirm-dialog-title ID to title heading'
      );
    });

    it('ConfirmDialog adds Escape key listener and body scroll lock on mount, restoring on cleanup', () => {
      const confirmSource = fs.readFileSync(
        path.join(srcDir, 'components', 'admin', 'shared', 'ConfirmDialog.tsx'),
        'utf8'
      );

      assert.ok(
        confirmSource.includes("e.key === 'Escape'"),
        'ConfirmDialog must handle Escape key press'
      );
      assert.ok(
        confirmSource.includes("document.body.style.overflow = 'hidden'"),
        'ConfirmDialog must lock body scroll when open'
      );
      assert.ok(
        confirmSource.includes("document.body.style.overflow = previousOverflow"),
        'ConfirmDialog must restore previous overflow on cleanup'
      );
      assert.ok(
        confirmSource.includes("window.removeEventListener('keydown', handleKeyDown)"),
        'ConfirmDialog must remove keydown listener on cleanup'
      );
    });

    it('ServiceFormModal implements role="dialog", aria-modal="true", and labeling semantics', () => {
      const serviceModalSource = fs.readFileSync(
        path.join(srcDir, 'components', 'admin', 'services', 'ServiceFormModal.tsx'),
        'utf8'
      );

      assert.ok(
        serviceModalSource.includes('role="dialog"'),
        'ServiceFormModal must include role="dialog"'
      );
      assert.ok(
        serviceModalSource.includes('aria-modal="true"'),
        'ServiceFormModal must include aria-modal="true"'
      );
      assert.ok(
        serviceModalSource.includes('aria-labelledby="service-form-modal-title"'),
        'ServiceFormModal must associate title with aria-labelledby'
      );
      assert.ok(
        serviceModalSource.includes('id="service-form-modal-title"'),
        'ServiceFormModal must assign service-form-modal-title ID to title heading'
      );
    });

    it('ServiceFormModal adds Escape key listener and body scroll lock', () => {
      const serviceModalSource = fs.readFileSync(
        path.join(srcDir, 'components', 'admin', 'services', 'ServiceFormModal.tsx'),
        'utf8'
      );

      assert.ok(
        serviceModalSource.includes("e.key === 'Escape'"),
        'ServiceFormModal must handle Escape key press'
      );
      assert.ok(
        serviceModalSource.includes("document.body.style.overflow = 'hidden'"),
        'ServiceFormModal must lock body scroll when open'
      );
      assert.ok(
        serviceModalSource.includes("document.body.style.overflow = previousOverflow"),
        'ServiceFormModal must restore previous overflow on cleanup'
      );
    });
  });

  describe('Finding A7 — Object URL Memory Cleanup & Media Modal Accessibility', () => {
    it('MediaUploadModal implements dialog role and accessibility labeling', () => {
      const mediaSource = fs.readFileSync(
        path.join(srcDir, 'components', 'admin', 'media', 'MediaUploadModal.tsx'),
        'utf8'
      );

      assert.ok(
        mediaSource.includes('role="dialog"'),
        'MediaUploadModal must declare role="dialog"'
      );
      assert.ok(
        mediaSource.includes('aria-modal="true"'),
        'MediaUploadModal must declare aria-modal="true"'
      );
      assert.ok(
        mediaSource.includes('aria-labelledby="media-upload-modal-title"'),
        'MediaUploadModal must declare aria-labelledby'
      );
      assert.ok(
        mediaSource.includes('id="media-upload-modal-title"'),
        'MediaUploadModal title must match aria-labelledby target'
      );
    });

    it('MediaUploadModal revokes preview URLs on job removal', () => {
      const mediaSource = fs.readFileSync(
        path.join(srcDir, 'components', 'admin', 'media', 'MediaUploadModal.tsx'),
        'utf8'
      );

      assert.ok(
        mediaSource.includes('URL.revokeObjectURL(target.previewUrl)'),
        'removeJob must revoke target object URL to prevent memory leaks'
      );
    });

    it('MediaUploadModal revokes preview URLs on modal close and component unmount', () => {
      const mediaSource = fs.readFileSync(
        path.join(srcDir, 'components', 'admin', 'media', 'MediaUploadModal.tsx'),
        'utf8'
      );

      assert.ok(
        mediaSource.includes('URL.revokeObjectURL(j.previewUrl)'),
        'MediaUploadModal must revoke active preview URLs on close and unmount'
      );
      assert.ok(
        mediaSource.includes('jobsRef.current.forEach'),
        'MediaUploadModal unmount cleanup must inspect all queued jobs via ref'
      );
    });

    it('MediaUploadModal supports Escape key closing and body scroll lock', () => {
      const mediaSource = fs.readFileSync(
        path.join(srcDir, 'components', 'admin', 'media', 'MediaUploadModal.tsx'),
        'utf8'
      );

      assert.ok(
        mediaSource.includes("e.key === 'Escape'"),
        'MediaUploadModal must handle Escape key press'
      );
      assert.ok(
        mediaSource.includes("document.body.style.overflow = 'hidden'"),
        'MediaUploadModal must lock body scroll when mounted'
      );
      assert.ok(
        mediaSource.includes("document.body.style.overflow = previousOverflow"),
        'MediaUploadModal must restore previous overflow on unmount'
      );
    });
  });
});
