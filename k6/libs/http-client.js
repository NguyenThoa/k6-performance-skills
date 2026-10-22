import http from 'k6/http';
import { env } from '../config/environments.js';

/**
 * Base HTTP Client wrapper:
 * 1. Tự động gắn Base URL
 * 2. Tự động gắn header Content-Type & Authorization
 * 3. Bắt buộc gắn tag name để gom nhóm URL (tránh High Cardinality làm tràn RAM)
 * 4. Tự động log lỗi khi HTTP status >= 400
 */
export class HttpClient {
  constructor(authToken = null) {
    this.baseUrl = env.BASE_URL;
    this.authToken = authToken;
  }

  setToken(token) {
    this.authToken = token;
  }

  _buildHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  get(path, tagName, customHeaders = {}) {
    const url = `${this.baseUrl}${path}`;
    const params = {
      headers: this._buildHeaders(customHeaders),
      tags: { name: tagName || path },
    };
    const res = http.get(url, params);
    this._handleErrorLog(res, 'GET', tagName || path);
    return res;
  }

  post(path, body, tagName, customHeaders = {}) {
    const url = `${this.baseUrl}${path}`;
    const payload = typeof body === 'string' ? body : JSON.stringify(body);
    const params = {
      headers: this._buildHeaders(customHeaders),
      tags: { name: tagName || path },
    };
    const res = http.post(url, payload, params);
    this._handleErrorLog(res, 'POST', tagName || path);
    return res;
  }

  put(path, body, tagName, customHeaders = {}) {
    const url = `${this.baseUrl}${path}`;
    const payload = typeof body === 'string' ? body : JSON.stringify(body);
    const params = {
      headers: this._buildHeaders(customHeaders),
      tags: { name: tagName || path },
    };
    const res = http.put(url, payload, params);
    this._handleErrorLog(res, 'PUT', tagName || path);
    return res;
  }

  delete(path, tagName, customHeaders = {}) {
    const url = `${this.baseUrl}${path}`;
    const params = {
      headers: this._buildHeaders(customHeaders),
      tags: { name: tagName || path },
    };
    const res = http.del(url, null, params);
    this._handleErrorLog(res, 'DELETE', tagName || path);
    return res;
  }

  _handleErrorLog(res, method, tagName) {
    if (res.status >= 400) {
      console.warn(`[HTTP ERROR] ${method} ${tagName} -> Status: ${res.status} | Body: ${res.body ? res.body.substring(0, 150) : ''}`);
    }
  }
}
