---
name: skills-k6-script-generator
description: Skill chuyên gia sinh mã kịch bản kiểm thử hiệu năng k6 từ OpenAPI/Swagger, file HAR, Postman Collection hoặc API test cases — tự động xử lý Dynamic Correlation (trích xuất token, ID động), Parameterization (SharedArray feeder), Tagging gom nhóm URL, Check assertions và Realistic Think Time.
---

# k6 Performance Script Generator

> **Role & Experience:** Kỹ sư tự động hóa hiệu năng cao cấp kết hợp công nghệ AI. Tự động chuyển đổi tài liệu API, HAR recording hoặc manual API test cases thành kịch bản k6 chuẩn mực, loại bỏ lỗi hardcode token, phân mảnh URL động và chạy đúng ngay từ lần đầu.

---

## 1. When to Use

Sử dụng skill này khi:
- Cần viết script k6 cho một API đơn lẻ, một cụm microservices hoặc một kịch bản End-to-End User Journey.
- Cần chuyển đổi (Convert) từ:
  - File tài liệu OpenAPI / Swagger (`openapi.json`, Swagger UI URL).
  - File ghi log mạng HTTP Archive (`.har` từ Chrome/Edge DevTools).
  - Postman Collection (`collection.json`).
  - File test case API có sẵn (`docs/testcases/<module>/api/`).
- Cần xây dựng các Service classes trong `k6/services/` và scenarios trong `k6/scenarios/`.

---

## 2. Các Kỹ Thuật Lập Trình k6 Bắt Buộc (Best Practices)

### 2.1. Trích Xuất Dữ Liệu Động (Dynamic Correlation)
- **Quy tắc:** Tuyệt đối không hardcode ID, Token, hoặc Order Number giữa các bước trong kịch bản.
- **Cách xử lý:**
  ```javascript
  // Bước 1: Login và trích xuất token
  const loginRes = http.post(`${BASE_URL}/api/v1/auth/login`, JSON.stringify(credentials), {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'POST /auth/login' },
  });
  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'has token': (r) => r.json('token') !== undefined,
  });
  const authToken = loginRes.json('token');

  // Bước 2: Tạo đơn và trích xuất Order ID
  const createRes = http.post(`${BASE_URL}/api/v1/orders`, JSON.stringify(orderPayload), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    tags: { name: 'POST /orders' },
  });
  const orderId = createRes.json('data.id');

  // Bước 3: Xem chi tiết đơn vừa tạo
  http.get(`${BASE_URL}/api/v1/orders/${orderId}`, {
    headers: { 'Authorization': `Bearer ${authToken}` },
    tags: { name: 'GET /orders/:id' }, // Gom nhóm URL, tránh bùng nổ cardinality!
  });
  ```

### 2.2. Gom Nhóm Metric bằng Tags (Prevent High Cardinality)
- Khi gọi URL có biến động (Path Parameter như `/users/123`, `/orders/abc-xyz`), **BẮT BUỘC** khai báo `tags: { name: 'GET /orders/:id' }`.
- Nếu không gắn tag tĩnh, k6 sẽ tạo ra hàng chục nghìn metric riêng biệt cho từng ID, gây tràn bộ nhớ RAM của k6 process.

### 2.3. Phân Bổ Dữ Liệu Độc Lập cho Từng VU (Unique User Data)
- Mỗi VU lấy một bản ghi dữ liệu khác nhau theo công thức `__VU` và `__ITER`:
  ```javascript
  import { testUsers } from '../libs/data-loader.js';

  export default function () {
    // Phân bổ người dùng duy nhất cho từng VU
    const currentUser = testUsers[(__VU - 1) % testUsers.length];
    // ...
  }
  ```

### 2.4. Thời Gian Chờ Thực Tế (Think Time & Pacing)
- Không dùng thời gian chờ cố định `sleep(1)`. Phải dùng thời gian chờ ngẫu nhiên mô phỏng thói quen đọc và click chuột của người thật:
  ```javascript
  import { randomThinkTime } from '../libs/think-time.js';

  // Dừng ngẫu nhiên từ 1 đến 3 giây giữa các bước
  randomThinkTime(1, 3);
  ```

---

## 3. Template Scenario Chuẩn Doanh Nghiệp

Mọi script scenario sinh ra phải theo cấu trúc mẫu sau:

```javascript
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// 1. Tải cấu hình và dữ liệu
import { env } from '../config/environments.js';
import { defaultThresholds } from '../config/thresholds.js';
import { loadTestOptions } from '../config/options.js';

export const options = {
  ...loadTestOptions,
  thresholds: defaultThresholds,
};

const users = new SharedArray('users_data', function () {
  return JSON.parse(open('../data/users.json'));
});

// 2. Setup Phase (chạy 1 lần trước khi phát tải)
export function setup() {
  console.log(`[SETUP] Khởi động test trên môi trường: ${env.BASE_URL}`);
  // Khởi tạo trạng thái hoặc chuẩn bị dữ liệu nếu cần
  return { startTime: new Date().toISOString() };
}

// 3. VU Logic (thực thi theo kịch bản người dùng)
export default function (data) {
  const user = users[(__VU - 1) % users.length];

  group('01_User_Authentication', function () {
    const res = http.post(`${env.BASE_URL}/api/v1/auth/login`, JSON.stringify({
      username: user.username,
      password: user.password,
    }), {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'POST /api/v1/auth/login' },
    });

    check(res, {
      'login status 200': (r) => r.status === 200,
      'token exists': (r) => r.json('access_token') !== undefined,
    });
  });

  sleep(Math.random() * 2 + 1); // Think time 1 - 3 giây

  group('02_Get_Profile', function () {
    // ...
  });
}

// 4. Teardown Phase (chạy 1 lần sau khi kết thúc tải)
export function teardown(data) {
  console.log(`[TEARDOWN] Kết thúc test lúc: ${new Date().toISOString()}`);
}

// 5. Xuất báo cáo HTML & JSON
export function handleSummary(data) {
  return {
    'reports/load_test_summary.html': htmlReport(data),
    'reports/load_test_summary.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
```

---

## 4. Quy Trình 3 Bước Sinh Script

1. **Phân tích Input:** Đọc schema, parameter, header, logic nghiệp vụ từ OpenAPI/HAR/TC file.
2. **Scaffold Service & Payload:** Tạo file client tương ứng trong `k6/services/` với các hàm có đầy đủ `tags`, `headers`, và `checks`.
3. **Lắp ghép Scenario:** Tạo file kịch bản trong `k6/scenarios/` kết hợp các Service theo đúng luồng User Journey và gắn `options` từ Workload Model.
