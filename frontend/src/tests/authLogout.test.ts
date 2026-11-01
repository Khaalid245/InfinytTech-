import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import axios from 'axios';
import {
  invalidateRefreshTokenOnServer,
  performClientLogout,
} from '../services/auth.service';

/**
 * In-memory Mock Storage implementing the Storage interface
 * to test state cleanup guarantees.
 */
class MockStorage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

describe('Auth Logout and Refresh-Token Invalidation (Actual Implementation)', () => {
  it('confirms server-side invalidation when backend returns HTTP 205', async () => {
    const originalPost = axios.post;
    try {
      (axios as any).post = async (url: string, data: any) => {
        assert.ok(url.endsWith('/api/auth/logout/'));
        assert.strictEqual(data.refresh, 'valid_refresh_token_123');
        return { status: 205, data: {} };
      };

      const result = await invalidateRefreshTokenOnServer(
        'valid_refresh_token_123',
        'bearer_access_token_456'
      );

      assert.strictEqual(result.serverRevoked, true);
      assert.strictEqual(result.statusCode, 205);
      assert.strictEqual(result.error, undefined);
    } finally {
      axios.post = originalPost;
    }
  });

  it('identifies unrevoked token when backend returns HTTP 400 (expired or invalid token)', async () => {
    const originalPost = axios.post;
    try {
      (axios as any).post = async () => {
        const error: any = new Error('Request failed with status code 400');
        error.response = {
          status: 400,
          data: { detail: 'Token is invalid or expired' },
        };
        throw error;
      };

      const result = await invalidateRefreshTokenOnServer(
        'expired_refresh_token',
        'access_token'
      );

      assert.strictEqual(result.serverRevoked, false);
      assert.strictEqual(result.statusCode, 400);
      assert.strictEqual(result.error, 'Token is invalid or expired');
    } finally {
      axios.post = originalPost;
    }
  });

  it('safely handles network failure / server offline without throwing unhandled exceptions', async () => {
    const originalPost = axios.post;
    try {
      (axios as any).post = async () => {
        const networkError: any = new Error('Network Error: Connection Refused');
        throw networkError;
      };

      const result = await invalidateRefreshTokenOnServer(
        'any_token',
        'access_token'
      );

      assert.strictEqual(result.serverRevoked, false);
      assert.strictEqual(result.statusCode, undefined);
      assert.ok(result.error?.includes('Network Error'));
    } finally {
      axios.post = originalPost;
    }
  });

  it('handles missing or empty refresh token gracefully without making HTTP calls', async () => {
    let callCount = 0;
    const originalPost = axios.post;
    try {
      (axios as any).post = async () => {
        callCount++;
        return { status: 205 };
      };

      const result1 = await invalidateRefreshTokenOnServer('');
      const result2 = await invalidateRefreshTokenOnServer(null as any);

      assert.strictEqual(result1.serverRevoked, false);
      assert.strictEqual(result2.serverRevoked, false);
      assert.strictEqual(callCount, 0, 'Should not dispatch network request when refresh token is missing');
    } finally {
      axios.post = originalPost;
    }
  });

  it('actual performClientLogout guarantees local credential purge on successful server logout (HTTP 205)', async () => {
    const originalPost = axios.post;
    try {
      (axios as any).post = async () => ({ status: 205 });

      const storage = new MockStorage();
      storage.setItem('token', 'active_access');
      storage.setItem('refreshToken', 'active_refresh');
      storage.setItem('role', 'admin');
      storage.setItem('user', JSON.stringify({ email: 'admin@infinyt.tech' }));

      const res = await performClientLogout(storage);

      assert.strictEqual(res.serverRevoked, true);
      assert.strictEqual(storage.getItem('token'), null);
      assert.strictEqual(storage.getItem('refreshToken'), null);
      assert.strictEqual(storage.getItem('role'), null);
      assert.strictEqual(storage.getItem('user'), null);
    } finally {
      axios.post = originalPost;
    }
  });

  it('actual performClientLogout guarantees local credential purge even when server invalidation fails (HTTP 400 / 500)', async () => {
    const originalPost = axios.post;
    try {
      (axios as any).post = async () => {
        const err: any = new Error('Backend error');
        err.response = { status: 400, data: { detail: 'Token blacklisted or expired' } };
        throw err;
      };

      const storage = new MockStorage();
      storage.setItem('token', 'stale_access');
      storage.setItem('refreshToken', 'stale_refresh');
      storage.setItem('role', 'admin');

      const res = await performClientLogout(storage);

      assert.strictEqual(res.serverRevoked, false);
      assert.strictEqual(storage.getItem('token'), null);
      assert.strictEqual(storage.getItem('refreshToken'), null);
      assert.strictEqual(storage.getItem('role'), null);
    } finally {
      axios.post = originalPost;
    }
  });

  it('actual performClientLogout guarantees local credential purge on network timeout / server unreachable', async () => {
    const originalPost = axios.post;
    try {
      (axios as any).post = async () => {
        throw new Error('ETIMEDOUT: Connection timed out');
      };

      const storage = new MockStorage();
      storage.setItem('token', 'active_access');
      storage.setItem('refreshToken', 'active_refresh');

      const res = await performClientLogout(storage);

      assert.strictEqual(res.serverRevoked, false);
      assert.strictEqual(storage.getItem('token'), null);
      assert.strictEqual(storage.getItem('refreshToken'), null);
    } finally {
      axios.post = originalPost;
    }
  });

  it('deduplicates concurrent / repeated logout requests without duplicate HTTP dispatches', async () => {
    let networkCalls = 0;
    const originalPost = axios.post;
    try {
      (axios as any).post = async () => {
        networkCalls++;
        await new Promise((r) => setTimeout(r, 50));
        return { status: 205 };
      };

      const storage = new MockStorage();
      storage.setItem('token', 'active_access');
      storage.setItem('refreshToken', 'active_refresh');

      const activeRef: { current: Promise<any> | null } = { current: null };

      // Helper reproducing AuthContext's activeLogoutRef mechanism with actual performClientLogout
      const triggerLogout = () => {
        if (activeRef.current) return activeRef.current;
        const p = (async () => {
          try {
            return await performClientLogout(storage);
          } finally {
            activeRef.current = null;
          }
        })();
        activeRef.current = p;
        return p;
      };

      // Rapid concurrent clicks
      const [res1, res2, res3] = await Promise.all([
        triggerLogout(),
        triggerLogout(),
        triggerLogout(),
      ]);

      assert.strictEqual(networkCalls, 1, 'Exactly one network call should occur for concurrent logout clicks');
      assert.strictEqual(res1.serverRevoked, true);
      assert.strictEqual(res2.serverRevoked, true);
      assert.strictEqual(res3.serverRevoked, true);
      assert.strictEqual(storage.getItem('token'), null);
    } finally {
      axios.post = originalPost;
    }
  });
});
