import axios from 'axios';

const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:8000';

export interface LogoutResponse {
  /** True if the server responded with HTTP 205 (token confirmed blacklisted) */
  serverRevoked: boolean;
  /** HTTP status code returned by the server, if a response was received */
  statusCode?: number;
  /** Error detail or exception message, if the request failed or was rejected */
  error?: string;
}

/**
 * Dispatches an asynchronous request to invalidate a refresh token on the backend
 * via POST /api/auth/logout/ according to the Django SimpleJWT blacklist contract.
 *
 * @param refreshToken - The refresh token to be blacklisted
 * @param accessToken - The current user access token for Bearer authorization
 * @returns LogoutResponse indicating whether server-side revocation succeeded
 */
export async function invalidateRefreshTokenOnServer(
  refreshToken: string,
  accessToken?: string | null
): Promise<LogoutResponse> {
  if (!refreshToken || typeof refreshToken !== 'string') {
    return {
      serverRevoked: false,
      error: 'No refresh token provided',
    };
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await axios.post(
      `${BASE_URL}/api/auth/logout/`,
      { refresh: refreshToken },
      {
        headers,
        timeout: 5000, // 5s timeout to prevent hanging UI
      }
    );

    if (response.status === 205) {
      return { serverRevoked: true, statusCode: 205 };
    }

    return {
      serverRevoked: false,
      statusCode: response.status,
      error: `Unexpected server response status: ${response.status}`,
    };
  } catch (err: unknown) {
    const hasResponse = typeof err === 'object' && err !== null && 'response' in err;
    if (axios.isAxiosError(err) || hasResponse) {
      const axiosLike = err as { response?: { status?: number; data?: { detail?: string; error?: string } }; message?: string };
      const statusCode = axiosLike.response?.status;
      const responseData = axiosLike.response?.data;
      const detail =
        responseData?.detail ||
        responseData?.error ||
        axiosLike.message ||
        'Network failure during logout';

      return {
        serverRevoked: false,
        statusCode,
        error: detail,
      };
    }

    const genericError = err instanceof Error ? err.message : 'Logout request failed';
    return {
      serverRevoked: false,
      error: genericError,
    };
  }
}

/**
 * Executes full client logout lifecycle:
 * 1. Dispatches server-side token invalidation request via POST /api/auth/logout/
 * 2. Unconditionally purges sensitive local storage credentials ('token', 'role', 'refreshToken', 'user')
 *    in a finally block, ensuring clean state even upon network timeout or server errors.
 *
 * @param storage - Storage mechanism (defaults to global localStorage)
 * @returns LogoutResponse indicating whether server-side invalidation succeeded
 */
export async function performClientLogout(
  storage: Pick<Storage, 'getItem' | 'removeItem'> = typeof localStorage !== 'undefined'
    ? localStorage
    : ({} as Storage)
): Promise<LogoutResponse> {
  const currentRefreshToken = storage.getItem('refreshToken');
  const currentAccessToken = storage.getItem('token');

  let result: LogoutResponse = {
    serverRevoked: false,
    error: currentRefreshToken ? undefined : 'No active session or refresh token',
  };

  try {
    if (currentRefreshToken) {
      result = await invalidateRefreshTokenOnServer(
        currentRefreshToken,
        currentAccessToken
      );
    }
  } catch (err: unknown) {
    result = {
      serverRevoked: false,
      error: err instanceof Error ? err.message : 'Logout request error',
    };
  } finally {
    // ALWAYS clear local state and credentials, regardless of server outcome
    storage.removeItem('token');
    storage.removeItem('role');
    storage.removeItem('refreshToken');
    storage.removeItem('user');
  }

  return result;
}

