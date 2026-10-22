---
description: Phân tích số liệu kiểm thử hiệu năng k6 từ summary.json hoặc terminal log — đối soát SLA/SLOs, phát hiện điểm bão hòa (Saturation point), chẩn đoán điểm nghẽn (Bottlenecks) DB/Memory/Thread/Network, và xuất báo cáo Quality Gate GO/NO-GO kèm khuyến nghị tối ưu kỹ thuật.
skills:
  - skills-k6-analyzer-diagnoser
---

# Workflow: Phân Tích Báo Cáo Hiệu Năng k6 & Chẩn Đoán Điểm Nghẽn

> **BẮT BUỘC (MANDATORY SKILL):** Nạp **`skills-k6-analyzer-diagnoser`** (`.claude/skills/skills-k6-analyzer-diagnoser/SKILL.md`) và **`.claude/rules/performance_rules.md`**.

Workflow này đọc dữ liệu kết quả k6 vừa thực thi (`summary.json`, log màn hình, hoặc file CSV), đối chiếu với tiêu chuẩn SLA, phân tích nguyên nhân gốc rễ (RCA) nếu hệ thống bị chậm/lỗi, và xuất báo cáo thẩm định chất lượng để trình ban quản lý và đội ngũ kỹ thuật.

---

## 1. Input Cần Thu Thập

| Input | Bắt buộc? | Ghi chú |
|---|---|---|
| **File kết quả hoặc Log k6** | ⭐ | Đường dẫn file `summary.json`, `summary.html` hoặc paste trực tiếp output k6 |
| **Bản Workload Model (nếu có)** | ⭕ | `docs/performance/<module>/WORKLOAD_MODEL_<MODULE>.md` để đối chiếu SLA |
| **Tên module / Đợt test** | ⭕ | Để tạo thư mục lưu báo cáo |

---

## 2. Các Bước Thực Hiện

### Bước 1: Trích xuất và phân tích chỉ số thô
- **VUs & Throughput:** Peak VUs đạt được, tổng số requests, throughput trung bình (RPS).
- **Latency / Response Time:** Min, Med (P50), P90, P95, P99, Max.
- **Tỷ lệ lỗi (Error Rate):** Tỷ lệ request thất bại, thống kê mã lỗi HTTP (4xx, 5xx).
- **Data Transfer:** Tốc độ gửi/nhận dữ liệu qua mạng.

### Bước 2: Đối soát với Tiêu chí Quality Gate
- So sánh các chỉ số đạt được với Thresholds của k6 và SLA cam kết:
  - P95 có vượt ngưỡng cho phép không?
  - Error rate có dưới 1% không?
  - Hệ thống có bị rớt kết nối khi lên đỉnh tải không?
- Đưa ra quyết định:
  - 🟢 **PASS (RELEASE GO)**
  - 🟡 **WARN (CONDITIONAL GO)**
  - 🔴 **FAIL (RELEASE NO-GO)**

### Bước 3: Chẩn đoán nguyên nhân gốc rễ (Root Cause Analysis - RCA)
- Áp dụng **Ma trận chẩn đoán điểm nghẽn**:
  - Có hiện tượng đường cong gậy khúc côn cầu (Hockey-stick curve) không?
  - Có dấu hiệu rò rỉ bộ nhớ (Memory Leak) hoặc Full GC pause không?
  - Có bị nghẽn ở Connection Pool của Database không?
  - Có bị Ingress / API Gateway chặn rate limit (429) không?

### Bước 4: Xuất báo cáo hiệu năng chuyên nghiệp
Lưu báo cáo vào: `docs/performance/<module>/runs/run_<timestamp>_<loại-test>/performance_report.md`
Bao gồm:
1. Tóm tắt kết quả (Executive Summary)
2. Bảng chi tiết từng transaction / endpoint
3. Phân tích điểm nghẽn & RCA
4. Khuyến nghị hành động tối ưu cho Backend Dev và DevOps/SRE.
