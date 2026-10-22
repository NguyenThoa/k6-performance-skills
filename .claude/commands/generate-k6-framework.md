---
description: Khởi tạo và scaffold framework kiểm thử hiệu năng k6 chuẩn Enterprise trong thư mục riêng `k6/` — cấu trúc modular gồm config/ (options, thresholds, envs), data/ (SharedArray feeder), libs/ (BaseHttpClient, AuthProvider, CustomMetrics, ThinkTime), services/, scenarios/, reports/ và package.json với k6-reporter HTML.
skills:
  - skills-k6-framework-architect
---

# Workflow: Khởi Tạo Framework k6 (Scaffold Enterprise Framework)

> **BẮT BUỘC (MANDATORY SKILL):** Nạp **`skills-k6-framework-architect`** (`.claude/skills/skills-k6-framework-architect/SKILL.md`) và **`.claude/rules/performance_rules.md`**.

Workflow này khởi tạo toàn bộ thư mục `k6/` chuẩn chỉnh từ đầu, sẵn sàng cho việc mở rộng quy mô từ kiểm thử đơn lẻ đến hàng trăm kịch bản tích hợp CI/CD.

---

## 1. Input Cần Thu Thập

| Input | Bắt buộc? | Ghi chú |
|---|---|---|
| **Môi trường Base URL** | ⭐ | URL endpoint môi trường test (Dev/Staging) |
| **Cơ chế xác thực (Auth Type)** | ⭕ | Bearer Token, OAuth2, API Key, hoặc Cookie Session |
| **Tên dự án / module** | ⭕ | Để tạo package.json và cấu trúc service ban đầu |

---

## 2. Các Bước Thực Hiện

### Bước 1: Tạo cấu trúc thư mục `k6/`
Scaffold cây thư mục chuẩn:
```
k6/
├── config/
├── data/
│   └── payloads/
├── libs/
├── services/
├── scenarios/
└── reports/
```

### Bước 2: Tạo các file lõi (Core Libraries & Config)
- `k6/config/environments.js`: Quản lý Base URL và secrets.
- `k6/config/thresholds.js`: Ngưỡng SLA mặc định (P95, P99, error rate).
- `k6/config/options.js`: Các mẫu stages cho Smoke, Load, Stress, Spike, Soak.
- `k6/libs/http-client.js`: Base HTTP wrapper tự động gắn tags URL, headers, error logger.
- `k6/libs/auth-provider.js`: Cơ chế cấp phát và cache token cho VUs.
- `k6/libs/think-time.js`: Hàm random sleep mô phỏng người dùng thật.
- `k6/libs/metrics.js`: Định nghĩa các custom metrics (Trend, Rate, Counter).

### Bước 3: Tạo kịch bản mẫu & Reporter
- `k6/scenarios/smoke-test.js`: Kịch bản smoke mẫu để kiểm tra kết nối hệ thống.
- Cấu hình `handleSummary` xuất báo cáo HTML trực quan (`reports/summary.html`) sử dụng `k6-reporter`.
- `k6/package.json`: Cấu hình các lệnh chạy nhanh qua npm.
- `k6/README.md`: Hướng dẫn cài đặt k6 CLI, chạy test cục bộ hoặc qua Docker.

### Bước 4: Kiểm tra và bàn giao
- Chạy thử `k6 run k6/scenarios/smoke-test.js` nếu k6 đã cài đặt trên máy.
- Bàn giao framework cho người dùng với hướng dẫn chi tiết.
