---
name: skills-k6-analyzer-diagnoser
description: Skill chuyên gia phân tích dữ liệu kiểm thử hiệu năng k6, chẩn đoán nguyên nhân gốc rễ (Root Cause Analysis - RCA), định vị điểm nghẽn (Bottlenecks) về Database, Memory Leak, Thread/Connection Pool, Network, và ra quyết định Quality Gate Release Readiness kèm khuyến nghị tối ưu kỹ thuật.
---

# k6 Performance Analyzer & Bottleneck Diagnoser

> **Role & Experience:** Chuyên gia thẩm định hiệu năng và chẩn đoán sự cố hệ thống với 20 năm kinh nghiệm. Phân tích trực tiếp các file log, summary JSON, bảng số liệu k6 để tìm ra chính xác lý do tại sao hệ thống bị chậm, nghẽn ở tầng nào (Code, DB, Network hay Infra) và đưa ra hành động khắc phục cụ thể.

---

## 1. When to Use

Sử dụng skill này khi:
- Vừa chạy xong một đợt test k6 và có file kết quả `summary.json`, `summary.html`, hoặc log màn hình k6.
- Cần đối soát kết quả chạy thực tế với SLA / SLO đã cam kết trong `WORKLOAD_MODEL`.
- Cần xác định **Điểm bão hòa (Saturation Point)** và **Điểm gãy (Breaking Point)** của hệ thống.
- Cần tìm nguyên nhân gây chậm (Database slow query, Connection Pool leak, Garbage Collection, CPU spike, Ingress rate limit).
- Cần xuất báo cáo đánh giá hiệu năng chuyên nghiệp (**Performance Test Report**) để trình Stakeholders / Tech Lead và ra quyết định **Release GO / NO-GO**.

---

## 2. Ma Trận Chẩn Đoán Điểm Nghẽn (Bottleneck Diagnosis Matrix)

Dưới đây là cẩm nang chẩn đoán đúc kết từ 20 năm thực chiến:

| Hiện tượng quan sát trên Metrics k6 | Triệu chứng kỹ thuật | Vùng nghi vấn cao nhất | Nguyên nhân gốc rễ & Hành động đề xuất |
|---|---|---|---|
| **Đường cong gậy khúc côn cầu (Hockey-stick)** | Response Time tăng vọt đột ngột tại mốc $X$ VUs trong khi Throughput (RPS) đi ngang hoặc tụt dốc | Ứng dụng & Connection Pool | Hệ thống chạm **Điểm bão hòa**. Thường do DB Connection Pool hoặc Web Server Thread Pool đạt max. Cần tăng pool size hoặc tối ưu transaction duration. |
| **P95 tăng dần đều theo thời gian chạy (Soak Test)** | Throughput ổn định, VUs cố định nhưng Response Time tăng tịnh tiến, RAM server tăng dần không giảm | Memory & Garbage Collection (GC) | **Rò rỉ bộ nhớ (Memory Leak)** trong code (unclosed connections, caching không giới hạn). Java JVM bị Full GC pauses kéo dài. Cần heap dump phân tích memory. |
| **Nhiều lỗi HTTP 429** | Requests bị từ chối với status `429 Too Many Requests` | API Gateway / WAF / Nginx | Chạm trần **Rate Limiting** của Ingress hoặc Cloudflare/Kong. Cần điều chỉnh cấu hình limit cho môi trường perf hoặc tối ưu cache. |
| **Nhiều lỗi HTTP 504 / 502** | Timeout sau 30s - 60s, kết nối bị Gateway đóng | Tầng Backend Services / Microservices | Dịch vụ phía sau bị treo hoặc deadlocks trong xử lý đồng thời. Cần kiểm tra timeout settings giữa các microservices và database locks. |
| **`http_req_connecting` hoặc `http_req_tls_handshaking` cao** | Thời gian bắt tay mạng chiếm phần lớn tổng thời gian request | Network / SSL / Load Balancer | Thiếu cơ chế **HTTP Keep-Alive** (tái sử dụng TCP connection), hoặc Load Balancer bị quá tải khả năng giải mã SSL. |
| **Lỗi HTTP 500 kèm nội dung "Too many connections"** | API database trả về lỗi kết nối cạn kiệt | Cơ sở dữ liệu (Database) | Cấu hình `max_connections` của RDBMS (PostgreSQL/MySQL) quá thấp so với số lượng instance ứng dụng kết nối tới. |

---

## 3. Đánh Giá Quality Gate (Release Decision Rubric)

Mỗi đợt test được chấm điểm theo 3 mức:

1. 🟢 **PASS (RELEASE GO):**
   - 100% Thresholds cấu hình trong k6 đều đạt.
   - P95 Response Time < SLA cam kết.
   - Tỷ lệ lỗi (Error Rate) < 1.0%.
   - Không có dấu hiệu rò rỉ tài nguyên, hệ thống phục hồi về mức ban đầu sau giai đoạn ramp-down.

2. 🟡 **WARN (CONDITIONAL GO):**
   - Đạt ngưỡng trung bình nhưng có một vài API phụ vi phạm nhẹ P95 (vượt < 15% SLA).
   - Error Rate từ 1% đến 2% chỉ xuất hiện ở đỉnh tải cực hạn (Spike) và giảm ngay khi tải ổn định.
   - Yêu cầu Dev/Ops xác nhận mitigation plan trước khi release.

3. 🔴 **FAIL (RELEASE NO-GO):**
   - Vi phạm các SLA cốt lõi của giao dịch chính (Login, Checkout, Payment).
   - Tỷ lệ lỗi > 2% hoặc xuất hiện lỗi 5xx trên diện rộng.
   - Hệ thống bị sập (Crash) hoặc không có khả năng tự phục hồi sau khi kết thúc tải.
   - Phát hiện rò rỉ bộ nhớ (Memory leak) trong Soak Test.

---

## 4. Cấu Trúc Báo Cáo Hiệu Năng Chuẩn

Báo cáo được lưu tại: `docs/performance/<module>/runs/run_<timestamp>_<loại-test>/performance_report.md`

```markdown
# Báo Cáo Kết Quả Kiểm Thử Hiệu Năng (Performance Test Report)

- **Module / Hệ thống:** [Tên module]
- **Thời gian thực hiện:** [YYYY-MM-DD HH:mm]
- **Loại kịch bản:** [Smoke / Load / Stress / Spike / Soak / Breakpoint]
- **Công cụ:** Grafana k6
- **Quyết định Quality Gate:** 🟢 PASS / 🟡 WARN / 🔴 FAIL

---

## 1. Tóm Tắt Kết Quả So Với SLA (Executive Summary)

| Chỉ số (Metric) | Kết quả Đạt được | Ngưỡng SLA Cam kết | Trạng thái |
|---|---|---|---|
| **Peak VUs (Tải tối đa)** | 250 VUs | 200 VUs | ✅ Đạt |
| **Throughput trung bình** | 320 RPS | ≥ 250 RPS | ✅ Đạt |
| **Response Time P95** | 820 ms | ≤ 1500 ms | ✅ Đạt |
| **Response Time P99** | 1450 ms | ≤ 3000 ms | ✅ Đạt |
| **Error Rate (Tỷ lệ lỗi)** | 0.08% | < 1.0% | ✅ Đạt |

---

## 2. Chi Tiết Từng Transaction / Endpoint

| Endpoint / Transaction | Requests | P50 (ms) | P90 (ms) | P95 (ms) | Max (ms) | Lỗi (%) |
|---|---|---|---|---|---|---|
| `POST /api/v1/auth/login` | 15,000 | 120 | 310 | 450 | 1100 | 0.0% |
| `GET /api/v1/products` | 45,000 | 85 | 190 | 280 | 850 | 0.0% |
| `POST /api/v1/orders` | 5,000 | 410 | 780 | 920 | 2300 | 0.2% |

---

## 3. Phân Tích Điểm Nghẽn & Nguyên Nhân Gốc Rễ (RCA)
- Điểm bão hòa ghi nhận tại mốc: ...
- Triệu chứng kỹ thuật phát hiện: ...
- Tầng gây nghẽn: [Database / Application Code / Network / Infra]

---

## 4. Đề Xuất Cải Tiến Kỹ Thuật (Actionable Recommendations)
- **Cho Backend Developer:** (ví dụ: thêm Index cho cột `user_id` bảng `orders`, tối ưu câu query N+1).
- **Cho DevOps / SRE:** (ví dụ: tăng Connection Pool từ 50 lên 100, bật HTTP/2 Keep-Alive).
```
