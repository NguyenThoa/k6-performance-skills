import http from 'k6/http';
import { check } from 'k6';
import { env } from '../config/environments.js';

/**
 * Authentication Provider:
 * Quản lý việc cấp phát và cache Token cho VUs để tránh dội nghẽn API login
 */
const tokenCache = {};

export function getAuthToken(username, password) {
  const cacheKey = `${username}:${password}`;
  if (tokenCache[cacheKey]) {
    return tokenCache[cacheKey];
  }

  const url = `${env.BASE_URL}/api/v1/auth/login`;
  const payload = JSON.stringify({ username, password });
  const params = {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'POST /api/v1/auth/login' },
  };

  const res = http.post(url, payload, params);

  const isSuccess = check(res, {
    'auth response is 200': (r) => r.status === 200,
    'token is present': (r) => {
      try {
        const body = r.json();
        return body.token !== undefined || body.access_token !== undefined;
      } catch (e) {
        return false;
      }
    },
  });

  if (!isSuccess) {
    console.error(`[AUTH FAILED] Không thể lấy token cho user: ${username} (Status: ${res.status})`);
    return null;
  }

  const token = res.json('token') || res.json('access_token');
  tokenCache[cacheKey] = token;
  return token;
}
