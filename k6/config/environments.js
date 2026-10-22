/**
 * Cấu hình đa môi trường (Environments Management)
 * Chuyển đổi môi trường linh hoạt qua CLI: k6 run -e TARGET_ENV=staging ...
 */

const environments = {
  local: {
    BASE_URL: 'http://localhost:3000',
    API_PREFIX: '/api/v1',
    TIMEOUT: '30s',
  },
  dev: {
    BASE_URL: 'https://dev-api.example.com',
    API_PREFIX: '/api/v1',
    TIMEOUT: '30s',
  },
  staging: {
    BASE_URL: 'https://staging-api.example.com',
    API_PREFIX: '/api/v1',
    TIMEOUT: '30s',
  },
};

const currentEnv = __ENV.TARGET_ENV || 'local';

export const env = environments[currentEnv] || environments.local;
