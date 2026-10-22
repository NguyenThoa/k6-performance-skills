---
description: Thiết kế mô hình tải kiểm thử hiệu năng (Workload Model) khoa học — áp dụng Little's Law tính toán VUs, Throughput (RPS), Think Time, Pacing, phân bổ User Traffic Mix, thiết lập cấu hình k6 Scenarios & SLAs/Thresholds theo chuẩn ISO/IEC 25010.
skills:
  - skills-k6-workload-modeler
  - skills-requirements-analyzer
---

# Workflow: Thiết Kế Mô Hình Tải k6 (Workload Modeling)

> **BẮT BUỘC (MANDATORY SKILL):** Nạp **`skills-k6-workload-modeler`** (`.claude/skills/skills-k6-workload-modeler/SKILL.md`) và **`.claude/rules/performance_rules.md`**.

Workflow này giúp Performance Engineer / PM phân tích yêu cầu phi chức năng (NFR), traffic thực tế hoặc tài liệu API để xây dựng một **Bản Mô Hình Tải Khoa Học**, tính toán chính xác số Virtual Users (VUs), Arrival Rate (RPS), Think Time, và các kịch bản test trước khi bắt tay vào viết script k6.

---

## 1. Input Cần Thu Thập

| Input | Bắt buộc? | Nguồn cung cấp / Ghi chú |
|---|---|---|
| **Module / Nghiệp vụ cần test** | ⭐ | Tên module (VD: `checkout`, `authentication`, `search`) |
| **Tài liệu API / Endpoint Catalog** | ⭐ | Từ `docs/requirements/<module>/api/` hoặc OpenAPI/Swagger URL |
| **Số liệu kinh doanh / Traffic** | ⭕ | Số người dùng active/ngày, số đơn hàng/giờ, hoặc % giờ cao điểm |
| **Mục tiêu SLAs / SLOs** | ⭕ | Response time P95 mong muốn, error rate tối đa (nếu chưa có, dùng chuẩn default) |

---

## 2. Các Bước Thực Hiện

### Bước 1: Khảo sát NFR và API
- Đọc danh sách các API quan trọng cần đưa vào phạm vi kiểm thử hiệu năng.
- Xác định kiểu tương tác (Đọc dữ liệu - Read-heavy hay Ghi dữ liệu - Write-heavy).

### Bước 2: Tính toán thông số tải bằng công thức
- Tính Peak RPS dựa trên số liệu kinh doanh.
- Áp dụng Định luật Little ($N = X \times R$) để tính số VUs cần thiết.
- Thiết lập Think Time ngẫu nhiên (Uniform/Gaussian 1-4s) để mô phỏng hành vi người thật.

### Bước 3: Thiết kế 6 kịch bản tải chuẩn k6
- **Smoke Test:** 1-2 VUs, 1-2 phút (xác thực script).
- **Load Test:** Tải mục tiêu bình thường với 3 giai đoạn: Ramp-up, Steady, Ramp-down.
- **Stress Test:** Tải tăng dần theo bậc thang (step-up) lên 150% - 200% để tìm breaking point.
- **Spike Test:** Đột biến tức thời 300% - 500% trong thời gian cực ngắn.
- **Soak Test:** Duy trì tải 70-80% trong 2h - 8h để săn memory leak.
- **Breakpoint Test:** Tăng liên tục RPS không dừng cho đến khi hệ thống bắt đầu lỗi.

### Bước 4: Xuất tài liệu Workload Model
Lưu vào `docs/performance/<module>/WORKLOAD_MODEL_<MODULE>.md` gồm:
1. Bảng tóm tắt NFR & SLA
2. Bảng phân bổ tỷ lệ luồng người dùng (Traffic Distribution Mix)
3. Bảng thông số chi tiết từng Stage cho k6
4. Khung cấu hình `options.scenarios` và `thresholds` của k6 sẵn sàng chuyển sang code.
