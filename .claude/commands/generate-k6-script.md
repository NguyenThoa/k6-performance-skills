---
description: Sinh mã kịch bản kiểm thử hiệu năng k6 từ OpenAPI/Swagger, file HAR, Postman Collection hoặc API test cases — tự động tạo Service class, Scenario flow, Dynamic Correlation (trích xuất token/ID động), gom nhóm URL tag tĩnh, parameterization (SharedArray) và checks.
skills:
  - skills-k6-script-generator
  - skills-k6-workload-modeler
---

# Workflow: Sinh Script Kiểm Thử Hiệu Năng k6

> **BẮT BUỘC (MANDATORY SKILL):** Nạp **`skills-k6-script-generator`** (`.claude/skills/skills-k6-script-generator/SKILL.md`) và **`.claude/rules/performance_rules.md`**.

Workflow này đọc tài liệu API, OpenAPI, HAR capture hoặc file test case API, tự động sinh ra mã kịch bản k6 hoàn chỉnh, tuân thủ nghiêm ngặt các nguyên tắc chống rò rỉ RAM, xử lý correlation động và gán tag gom nhóm metric.

---

## 1. Input Cần Thu Thập

| Input | Bắt buộc? | Ghi chú |
|---|---|---|
| **Nguồn API / Scenario** | ⭐ | OpenAPI / Swagger file / URL, file HAR capture, Postman Collection, hoặc file TC `docs/testcases/<module>/api/` |
| **Loại kịch bản muốn sinh** | ⭐ | `smoke` / `load` / `stress` / `spike` / `soak` |
| **Bản Workload Model (nếu có)** | ⭕ | `docs/performance/<module>/WORKLOAD_MODEL_<MODULE>.md` để lấy thông số Stages & Thresholds |

---

## 2. Các Bước Thực Hiện

### Bước 1: Đọc và phân tích luồng API
- Trích xuất endpoint, phương thức (GET, POST, PUT, DELETE), headers, request body schema.
- Xác định điểm liên kết dữ liệu giữa các API (**Data Dependency**):
  - API login trả về `token` → truyền vào header các API sau.
  - API tạo tài nguyên (POST) trả về `id` → truyền vào URL API chi tiết (GET) hoặc xóa (DELETE).

### Bước 2: Sinh Service Class (`k6/services/<module>.service.js`)
- Tách riêng các hàm gọi API vào file Service.
- Mỗi request **BẮT BUỘC** có:
  - Header chuẩn (`Content-Type`, `Authorization`).
  - `tags: { name: 'METHOD /path-pattern' }` để k6 gom nhóm URL, tránh bùng nổ cardinality.
  - `check()` kiểm tra HTTP Status và tính toàn vẹn của dữ liệu trả về.

### Bước 3: Sinh Scenario User Journey (`k6/scenarios/<scenario-name>.js`)
- Ghép nối các bước gọi API theo luồng nghiệp vụ.
- Sử dụng `SharedArray` để tải dữ liệu test (`data/users.json`).
- Phân bổ tài khoản cho từng VU: `users[(__VU - 1) % users.length]`.
- Thêm thời gian chờ ngẫu nhiên (**Random Think Time**) giữa các bước bằng `randomThinkTime(1, 3)`.
- Áp dụng `options` và `thresholds` từ Workload Model.
- Tích hợp `handleSummary` để xuất báo cáo HTML.

### Bước 4: Kiểm tra cú pháp và cấu trúc
- Đảm bảo không có lỗi hardcode token, không import thừa.
- Hướng dẫn lệnh chạy script vừa tạo cho người dùng.
