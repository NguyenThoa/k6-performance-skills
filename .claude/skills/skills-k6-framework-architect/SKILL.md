---
name: skills-k6-framework-architect
description: Skill chuyên gia thiết kế và scaffold kiến trúc dự án k6 Performance Testing chuẩn Enterprise — cấu trúc modular, quản lý đa môi trường (.env, environments), Base HTTP Client, Auth Provider với token caching, Custom Metrics, SharedArray Data Feeder, và HTML Reporter tích hợp.
---

# k6 Enterprise Framework Architect

> **Role & Experience:** Thiết kế kiến trúc framework k6 chuẩn hóa dựa trên 20 năm kinh nghiệm triển khai performance testing ở quy mô lớn, đảm bảo code sạch, tái sử dụng cao, không rò rỉ RAM trên agent k6, dễ dàng tích hợp CI/CD (GitHub Actions / GitLab CI / Jenkins).

---

## 1. When to Use

Sử dụng skill này khi:
- Khởi tạo thư mục kiểm thử hiệu năng `k6/` mới trong dự án.
- Chuẩn hóa framework k6 hiện có sang mô hình kiến trúc phân tầng (Layered Architecture).
- Cần tạo các Base module: Base HTTP Client, Authentication Provider, Custom Metrics, Random Think-Time generator.
- Tích hợp HTML Report dashboard (`handleSummary` với `k6-reporter`).
- Cấu hình CI/CD chạy k6 tự động với ngưỡng Quality Gate (Pass/Fail criteria).

---

## 2. Chuẩn Cấu Trúc Thư Mục k6 (Enterprise Folder Structure)

Toàn bộ code k6 được đặt trong thư mục `k6/` ở root project:

```
k6/
├── config/                      # Cấu hình môi trường, options, SLAs
│   ├── environments.js          # Base URL, API Keys theo dev/staging/prod
│   ├── thresholds.js            # Định nghĩa SLAs & Quality Gates (P95, P99, error rate)
│   └── options.js               # Các profile chạy (smoke, load, stress, spike, soak)
├── data/                        # Test data tham số hóa (CSV, JSON)
│   ├── users.json               # Danh sách user test
│   └── payloads/                # Request body templates
├── libs/                        # Thư viện dùng chung & core utilities
│   ├── http-client.js           # Base HTTP wrapper (auto tags, logging, headers)
│   ├── auth-provider.js         # Token retrieval, refresh & caching cho VUs
│   ├── metrics.js               # Custom Metrics (Trend, Rate, Counter)
│   └── think-time.js            # Gaussian/Uniform random pacing helpers
├── services/                    # API Service layer theo từng domain/module
│   ├── auth.service.js          # login, refresh token, logout
│   ├── user.service.js          # profile, update, list
│   └── <module>.service.js      # business APIs
├── scenarios/                   # Kịch bản End-to-End User Journey
│   ├── user-browse-flow.js      # Luồng duyệt
│   ├── user-checkout-flow.js    # Luồng thanh toán
│   └── main-load-test.js        # Entry point gộp nhiều scenarios với traffic mix
├── reports/                     # Chứa HTML report & raw summary JSON
├── package.json                 # k6 scripts helper & dependencies
└── README.md                    # Hướng dẫn chạy k6 CLI & Docker
```

---

## 3. Các Thành Phần Cốt Lõi Bắt Buộc

### 3.1. Base HTTP Client (`libs/http-client.js`)
- Tự động gắn header chung (`Content-Type`, `Accept`, `Authorization`).
- Tự động gắn tag `{ name: 'API_NAME' }` để k6 gom nhóm metrics chính xác, **không bị bùng nổ cardinality** do URL chứa dynamic IDs (dùng URL template thay vì URL thô).
- Log lỗi chi tiết khi response khác kỳ vọng (`status >= 400`).

### 3.2. Data Feeder với `SharedArray` (`libs/data-loader.js`)
- ⚠️ **Nguyên tắc PM 20 năm:** Tuyệt đối **KHÔNG dùng `JSON.parse(open('...'))`** trong default function của k6 vì mỗi VU sẽ tạo 1 bản copy trên RAM → làm cạn kiệt bộ nhớ máy chạy test.
- **BẮT BUỘC dùng `k6/data` `SharedArray`**: Tải dữ liệu 1 lần vào bộ nhớ dùng chung cho tất cả VUs.

```javascript
import { SharedArray } from 'k6/data';

export const testUsers = new SharedArray('users', function () {
  return JSON.parse(open('../data/users.json'));
});
```

### 3.3. Auth Provider với Caching (`libs/auth-provider.js`)
- Cơ chế lấy trước tokens trong hàm `setup()` hoặc cấp phát token theo pool của VUs (`__VU`).
- Tránh dội nghẽn API Đăng nhập khi hàng nghìn VUs cùng khởi chạy một lúc (trừ kịch bản chuyên biệt Stress Test Auth).

### 3.4. Custom Metrics & Grouping (`libs/metrics.js`)
- Tách riêng chỉ số thời gian xử lý nghiệp vụ quan trọng:
  ```javascript
  import { Trend, Rate, Counter } from 'k6/metrics';
  
  export const CheckoutDuration = new Trend('checkout_duration', true);
  export const SuccessfulOrders = new Counter('successful_orders');
  export const BusinessFailureRate = new Rate('business_failure_rate');
  ```

### 3.5. HTML Reporter Tự Động (`main-load-test.js`)
- Tự động xuất báo cáo HTML trực quan và JSON summary vào `reports/`:

```javascript
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export function handleSummary(data) {
  return {
    "reports/summary.html": htmlReport(data),
    "reports/summary.json": JSON.stringify(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
```

---

## 4. Scaffold Workflow

Khi người dùng yêu cầu khởi tạo hoặc thiết kế k6 framework:
1. Tạo đầy đủ cây thư mục `k6/` với các subfolder chuẩn.
2. Sinh các file base: `config/`, `libs/`, `package.json`, `README.md`.
3. Cung cấp file mẫu `scenarios/smoke-test.js` và `scenarios/load-test.js` đã nối sẵn với Base Client và Auth Provider.
4. Cấu hình script npm trong `package.json`:
   - `npm run test:smoke` → `k6 run scenarios/smoke-test.js`
   - `npm run test:load` → `k6 run scenarios/main-load-test.js`
   - `npm run test:stress` → `k6 run --config config/options.js scenarios/main-load-test.js`
