import { group } from 'k6';
import { SharedArray } from 'k6/data';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

import { env } from '../config/environments.js';
import { loadOptions } from '../config/options.js';
import { defaultThresholds } from '../config/thresholds.js';
import { AuthService } from '../services/auth.service.js';
import { randomThinkTime } from '../libs/think-time.js';
import { BusinessJourneyDuration, BusinessSuccessRate } from '../libs/metrics.js';

// Cấu hình kịch bản Load Test: Ramp-up -> Steady -> Ramp-down
export const options = {
  ...loadOptions,
  thresholds: defaultThresholds,
};

// Đọc danh sách tài khoản test dùng chung
const users = new SharedArray('load_users', function () {
  return JSON.parse(open('../data/users.json'));
});

export function setup() {
  console.log(`=======================================================`);
  console.log(`[LOAD TEST] Bắt đầu phát tải lên môi trường: ${env.BASE_URL}`);
  console.log(`[STAGES] Ramp-up 2m (50 VUs) -> Plateau 5m -> Ramp-down 1m`);
  console.log(`=======================================================`);
  return { startedAt: new Date().toISOString() };
}

export default function () {
  // Mỗi VU lấy một user độc lập
  const user = users[(__VU - 1) % users.length];
  const authService = new AuthService();
  const startTime = Date.now();

  group('01_User_Login_Flow', function () {
    const token = authService.login(user.username, user.password);

    if (token) {
      BusinessSuccessRate.add(1);
      // Think Time: Người dùng dừng đọc màn hình từ 1.5 đến 3 giây
      randomThinkTime(1.5, 3.0);

      group('02_Fetch_Profile_Flow', function () {
        authService.getProfile();
      });
    } else {
      BusinessSuccessRate.add(0);
    }
  });

  // Đo tổng thời gian hoàn tất một User Journey
  BusinessJourneyDuration.add(Date.now() - startTime);

  // Pacing giữa các iterations
  randomThinkTime(1.0, 2.0);
}

export function teardown(data) {
  console.log(`[LOAD TEST] Kết thúc đợt chạy lúc: ${new Date().toISOString()}`);
}

// Báo cáo tự động lưu vào k6/reports/
export function handleSummary(data) {
  return {
    'reports/load_test_summary.html': htmlReport(data),
    'reports/load_test_summary.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
