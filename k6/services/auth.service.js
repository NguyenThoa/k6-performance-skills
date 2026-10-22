import { check } from 'k6';
import { HttpClient } from '../libs/http-client.js';

export class AuthService {
  constructor(client = null) {
    this.client = client || new HttpClient();
  }

  login(username, password) {
    const payload = { username, password };
    const res = this.client.post('/api/v1/auth/login', payload, 'POST /api/v1/auth/login');

    const pass = check(res, {
      'login status is 200': (r) => r.status === 200,
      'access token received': (r) => {
        try {
          return r.json('token') !== undefined || r.json('access_token') !== undefined;
        } catch (e) {
          return false;
        }
      },
    });

    if (pass) {
      const token = res.json('token') || res.json('access_token');
      this.client.setToken(token);
      return token;
    }
    return null;
  }

  getProfile() {
    const res = this.client.get('/api/v1/users/me', 'GET /api/v1/users/me');
    check(res, {
      'profile status is 200': (r) => r.status === 200,
      'profile has user info': (r) => {
        try {
          return r.json('id') !== undefined || r.json('email') !== undefined;
        } catch (e) {
          return false;
        }
      },
    });
    return res;
  }
}
