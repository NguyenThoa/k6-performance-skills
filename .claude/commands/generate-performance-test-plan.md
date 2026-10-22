---
description: Sinh Kế Hoạch Kiểm Thử Hiệu Năng (Performance Test Plan) cấp quản lý và kỹ thuật chuẩn quốc tế ISO/IEC/IEEE 29119-3, IEEE 829 và ISTQB — bao gồm bối cảnh kinh doanh, phạm vi giao dịch, mô hình tải & SLAs (P90/P95/P99), chiến lược 6 kịch bản tải k6, môi trường & scale ratio, dữ liệu tải, giám sát APM/DB, tiêu chí Entry/Exit/Suspension, ma trận RACI và lịch trình.
skills:
  - skills-performance-test-planner
  - skills-k6-workload-modeler
---

# Workflow: Kế Hoạch Kiểm Thử Hiệu Năng (Performance Test Plan)

> **BẮT BUỘC (MANDATORY SKILL):** Nạp **`skills-performance-test-planner`** (`.claude/skills/skills-performance-test-planner/SKILL.md`) và **`.claude/rules/performance_rules.md`**.

Tài liệu quản lý và chiến lược kỹ thuật: **mục tiêu kiểm thử tải là gì, đo lường trên những giao dịch nào, tải bao nhiêu VUs/RPS theo công thức nào, môi trường test tương đương bao nhiêu % Production, theo dõi bằng công cụ gì và khi nào đủ điều kiện nghiệm thu release.**

---

## 1. Input Cần Thu Thập

| Input | Bắt buộc? | Nguồn cung cấp / Ghi chú |
|---|---|---|
| **Tên hệ thống / Module cần test** | ⭐ | VD: `E-Commerce Core System`, `Payment & Checkout Module` |
| **Bối cảnh kinh doanh (Business Drivers)** | ⭐ | Đợt mở bán Flash Sale, Black Friday, Migration Cloud, hay ra mắt tính năng mới |
| **Danh mục API / User Flows chính** | ⭐ | Danh sách các API/Flow quan trọng nhất cần đưa vào phạm vi |
| **Dữ liệu traffic mục tiêu & NFRs** | ⭕ | Số người dùng active/ngày, Peak RPS mong muốn, P95 SLA (nếu chưa có, dùng chuẩn khuyến nghị) |
| **Thông tin môi trường test & Production** | ⭕ | Cấu hình máy chủ test (CPU/RAM), scale ratio (1:1 hay 1:2) |
| **Nhân sự tham gia dự án** | ⭕ | Tên hoặc role (Performance Lead, Dev On-call, DBA, DevOps) |

---

## 2. Các Bước Thực Hiện

### Bước 1: Thu thập bối cảnh & Phân tích rủi ro
- Xác định mục tiêu kinh doanh và những rủi ro hiệu năng nghiêm trọng nhất cần ngăn chặn.
- Chọn lọc các giao dịch theo nguyên lý Pareto (80/20) đưa vào In-Scope; xác định rõ những phần Out-of-Scope (3rd-party, static assets).

### Bước 2: Thiết lập mô hình tải & SLAs
- Áp dụng Định luật Little ($N = X \times R$) để tính toán số VUs và Peak Throughput.
- Thiết lập bảng SLAs chuẩn đo theo Percentile (P90, P95, P99, Max Error Rate < 1%).
- Phác thảo chiến lược thực thi 6 kịch bản tải chuẩn k6 (Smoke, Load, Stress, Spike, Soak, Breakpoint).

### Bước 3: Hoạch định môi trường, dữ liệu & Giám sát
- Quy định tỷ lệ scale phần cứng so với Production và quy tắc suy diễn (Extrapolation).
- Quy định độ lớn dữ liệu cơ sở dữ liệu (Database volume) và phương án seed test data.
- Kế hoạch cách ly dịch vụ bên ngoài (Mocking 3rd-party).
- Kế hoạch cấu hình công cụ giám sát Client-side (k6) và Server-side (APM, Prometheus, DB Slow log).

### Bước 4: Thiết lập cơ chế kiểm soát & Nghiệm thu
- Tiêu chí bắt đầu (Entry Criteria), Tạm dừng (Suspension Criteria), và Nghiệm thu (Exit Criteria).
- Ma trận phân công trách nhiệm RACI và Timeline dự kiến.

### Bước 5: Xuất tài liệu hoàn chỉnh
Lưu vào: `docs/performance/PERFORMANCE_TEST_PLAN_<TÊN_HE_THONG_HOAC_MODULE>.md` theo cấu trúc 12 phần chuẩn quốc tế.
