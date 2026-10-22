# PERFORMANCE TESTING RULES & STANDARDS

> **Scope:** Áp dụng cho mọi tác vụ thiết kế kịch bản, sinh script, thực thi và phân tích kiểm thử hiệu năng (Performance / Load / Stress Testing) trên Claude Code.
> **Mục tiêu:** Đảm bảo kịch bản tải mô phỏng hành vi thực tế, kiểm soát an toàn hạ tầng, đo lường chính xác các chỉ số SLAs/SLOs, phát hiện sớm điểm nghẽn (bottlenecks) và bảo vệ dữ liệu hệ thống.

---

## 1. 🚨 Nguyên Tắc An Toàn Hạ Tầng & Dữ Liệu (Safety First)

### 1.1. Cấm chạy tải cao lên Production khi chưa có phê duyệt
- **MẶC ĐỊNH:** Kiểm thử hiệu năng CHỈ được thực hiện trên môi trường chuyên dụng (**Staging / Perf-Lab / Pre-Prod**) có cấu hình phần cứng tương đương hoặc scale theo tỉ lệ đã biết so với Production.
- **TUYỆT ĐỐI CẤM:** Chạy Stress Test, Spike Test, hoặc Soak Test lên môi trường Production mà không có **Approved Maintenance Window** và văn bản xác nhận từ Ban Quản trị / DevOps / SRE.

### 1.2. Cách ly & Dọn dẹp dữ liệu (Data Isolation & Cleanup)
- **Tài khoản test riêng biệt:** Mọi Virtual User (VU) phải sử dụng tập tài khoản test độc lập (`perf_user_<vu_id>_...`), không dùng chung tài khoản với kiểm thử chức năng hay người dùng thật.
- **Dữ liệu có gắn nhãn (Tagged Data):** Dữ liệu do script sinh ra phải có prefix/tag nhận diện (ví dụ `PERF_TEST_<RUN_ID>_...`).
- **Teardown / Cleanup:** Kịch bản phải có cơ chế tự động dọn dẹp hoặc script purge dữ liệu sau mỗi đợt chạy để không làm tràn dung lượng ổ đĩa hay làm chậm database của môi trường test.
- **Tuân thủ luật API:** Không gọi các API xóa/sửa nhắm vào dữ liệu không do chính đợt test đó sinh ra (kế thừa triệt để quy tắc an toàn dữ liệu từ `skills-requirements-analyzer`).

---

## 2. 🎯 Chuẩn Đo Lường Hiệu Năng (SLA / SLO & Metrics)

### 2.1. Không dùng "Average Response Time" làm tiêu chí đánh giá chính
- ❌ **Average (Trung bình)** che giấu các spike và độ trễ cục bộ của người dùng (Outliers).
- ✅ **Bắt buộc dùng Percentiles (Bách phân vị):**
  - **P90 (90th percentile):** 90% số request phải hoàn thành trong thời gian này.
  - **P95 (95th percentile):** Tiêu chuẩn vàng đánh giá trải nghiệm người dùng SLA.
  - **P99 (99th percentile):** Đánh giá độ trễ ở trường hợp xấu nhất (worst-case scenario).
  - **Median (P50):** Đại diện cho thời gian phản hồi phổ biến nhất.

### 2.2. Ngưỡng chấp nhận tiêu chuẩn (Standard Quality Gates)
Nếu dự án chưa có SLA cụ thể, áp dụng bộ ngưỡng mặc định:
- **Web User Interaction API (Sync):** P95 < 1.5s, P99 < 3.0s.
- **Backend-to-Backend / Microservices:** P95 < 500ms, P99 < 1.0s.
- **Search / Heavy Reporting Query:** P95 < 3.0s, P99 < 5.0s.
- **Error Rate (Tỷ lệ lỗi):** `< 1%` cho Load Test thông thường; `< 5%` tại điểm cực hạn của Stress Test.
- **HTTP Status:** Chỉ các mã `2xx` (và `3xx` hợp lệ) mới được tính là Success. Mọi phản hồi `5xx`, `429 (Rate Limit)`, timeout đều tính vào Error Rate.

---

## 3. ⚙️ Quy Tắc Thiết Kế Kịch Bản Tải (Workload Realism)

### 3.1. Bắt buộc có giai đoạn Ramp-up & Ramp-down
- **TUYỆT ĐỐI KHÔNG** khởi động toàn bộ VUs ngay tức khắc tại giây thứ 0 (trừ trường hợp cố ý giả lập Spike Test).
- Phải chia kịch bản thành các Stages rõ ràng:
  1. **Ramp-up (Tăng tải từ từ):** Cho phép hệ thống làm nóng (warm-up connection pool, JIT compiler, cache).
  2. **Steady-state / Plateau (Duy trì tải ổn định):** Đo đạc các chỉ số hiệu năng ổn định.
  3. **Ramp-down (Hạ tải):** Cho phép các luồng xử lý dở dang hoàn tất, tránh drop connection đột ngột.

### 3.2. Mô phỏng hành vi người dùng thật (Pacing & Think Time)
- **Think Time:** Giữa các thao tác người dùng (ví dụ: xem trang sản phẩm -> thêm vào giỏ -> thanh toán), BẮT BUỘC có thời gian dừng ngẫu nhiên (`sleep(random(1, 4))`), không dội request liên tục vô tận (Hammering).
- **Session Correlation:** Token xác thực (Bearer token, Session Cookie), ID giỏ hàng, Order ID phải được trích xuất động (**Dynamic Correlation**) giữa các bước, KHÔNG dùng token tĩnh dán chết trong script.
- **Data Parameterization:** Sử dụng file dữ liệu (CSV/JSON feeder) phân bổ cho từng VU để tránh va chạm lock dữ liệu (Row-level locking trong Database).

---

## 4. 🛠️ Quy Chuẩn Công Nghệ & Code Script

### 4.1. Công nghệ ưu tiên
1. **k6 (Grafana k6 - JavaScript/TypeScript):** Công nghệ ưu tiên số 1 cho các ứng dụng hiện đại, CI/CD pipeline, API performance.
2. **Locust (Python):** Ưu tiên khi dự án dùng Python stack hoặc cần logic hành vi người dùng phức tạp theo luồng mã Python động.
3. **Apache JMeter:** Dành cho dự án truyền thống, enterprise protocols, hoặc hệ sinh thái Java.

### 4.2. Cấu trúc kịch bản k6 tiêu chuẩn
- Phải chia module:
  - `config/` (environment, options, thresholds)
  - `data/` (parameterized test data)
  - `services/` hoặc `endpoints/` (hàm gọi API độc lập)
  - `scenarios/` (kịch bản flow người dùng)
  - `main.js` hoặc `index.js` (entry point)
- Luôn định nghĩa `thresholds` rõ ràng trong `options` để tự động ngắt/báo lỗi CI/CD khi vi phạm SLA.

---

## 5. 📁 Quy Định Lưu Trữ Dữ Liệu Kiểm Thử Hiệu Năng

Tất cả tài liệu và kết quả chạy performance được lưu thống nhất trong thư mục `docs/performance/`:

```
docs/performance/
├── README.md                                  # Danh mục các module đã test performance, SLA tổng quan
└── <module>/
    ├── WORKLOAD_MODEL_<MODULE>.md             # Bản mô hình tải, tính toán VUs, Little's Law, Scenarios
    └── runs/
        └── run_<timestamp>_<loại-test>/       # Ví dụ: run_20261022_2130_load_test/
            ├── summary.json                   # Output kết quả thô từ k6/locust
            ├── metrics.csv                    # Dữ liệu metrics chi tiết
            └── performance_report.md          # Báo cáo đánh giá, đối soát SLA, phân tích bottleneck
```
