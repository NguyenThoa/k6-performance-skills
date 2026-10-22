import { group } from 'k6';
import { SharedArray } from 'k6/data';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

import { env } from '../config/environments.js';
import { smokeOptions } from '../config/options.js';
import { defaultThresholds } from '../config/thresholds.js';
import { AuthService } from '../services/auth.service.js';
import { randomThinkTime } from '../libs/think-time.js';

// Cấu hình kịch bản Smoke Test (1 VU, 1m)
export const options = {
  ...smokeOptions,
  thresholds: defaultThresholds,
};

// Đọc dữ liệu test qua SharedArray (không nhân bản RAM giữa các VUs)
const users = new SharedArray('smoke_users', function () {
  return JSON.parse(open('../data/users.json'));
});

export function setup() {
  console.log(`=======================================================`);
  console.log(`[SMOKE TEST] Khởi chạy kiểm tra kết nối hệ thống`);
  console.log(`[TARGET ENV] Base URL: ${env.BASE_URL}`);
  console.log(`=======================================================`);
  return { startedAt: new Date().toISOString() };
}

export default function () {
  const user = users[0];
  const authService = new AuthService();

  group('01_Authentication_Smoke', function () {
    const token = authService.login(user.username, user.password);
    if (token) {
      randomThinkTime(0.5, 1.5);
      authService.getProfile();
    }
  });
}

export function teardown(data) {
  console.log(`[SMOKE TEST] Hoàn tất lúc: ${new Date().toISOString()}`);
}

// Xuất báo cáo HTML và summary JSON
export function handleSummary(data) {
  return {
    'reports/smoke_test_summary.html': htmlReport(data),
    'reports/smoke_test_summary.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
