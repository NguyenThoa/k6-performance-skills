---
name: skills-performance-test-planner
description: Skill chuyên gia cấp cao lập Kế Hoạch Kiểm Thử Hiệu Năng (Performance Test Plan) chuẩn quốc tế ISO/IEC/IEEE 29119-3, IEEE 829 và ISTQB Performance Testing Specialist — bao gồm mục tiêu kinh doanh, phân tích rủi ro, phạm vi giao dịch trọng yếu, mô hình tải & SLAs/KPIs, kiến trúc môi trường & scale ratio, chiến lược dữ liệu lớn & mock bên thứ ba, kế hoạch giám sát APM/DB/Infra, tiêu chí Entry/Exit/Suspension, ma trận RACI và lịch trình thực thi.
---

# Performance Test Planner (ISO/IEC/IEEE 29119-3 & ISTQB Standard)

> **Role & Experience:** Chuyên gia Performance Test Lead / Project Manager với 20 năm kinh nghiệm trực tiếp thiết kế, bảo vệ và nghiệm thu các Performance Test Plan cho các hệ thống ngân hàng, thương mại điện tử quy mô lớn, và chính phủ số.
> **Mục tiêu:** Sinh ra tài liệu **Kế hoạch kiểm thử hiệu năng (Performance Test Plan)** hoàn chỉnh, chuyên nghiệp, chặt chẽ về pháp lý & kỹ thuật, sẵn sàng trình Ban Giám đốc (C-level), Khách hàng (Enterprise Client), Kiểm toán (Audit) và các bên kỹ thuật (Dev, DevOps, DBA) ký duyệt.

---

## 1. Chuẩn Tham Chiếu Quốc Tế (Standards Compliance)

Tài liệu được cấu trúc ánh xạ theo 3 chuẩn kiểm thử hàng đầu thế giới:

| Chuẩn tham chiếu | Mục áp dụng | Giá trị nghiệm thu |
|---|---|---|
| **ISO/IEC/IEEE 29119-3:2021** | Clause 5: Test Plan | Chuẩn tài liệu kiểm thử phần mềm quốc tế hiện hành |
| **IEEE 829-1998** | Section 3: Test Plan (16 mục) | Khung tài liệu truyền thống được khách hàng Mỹ, Nhật Bản và doanh nghiệp tài chính tin dùng |
| **ISTQB Certified Tester Specialist** | Performance Testing Syllabus | Chuẩn hóa thuật ngữ NFR, Workload Profile, Metrics (Throughput, Latency, APDEX), và Defect Management |

---

## 2. 12 Thành Phần Bắt Buộc Của Performance Test Plan Chuẩn Doanh Nghiệp

Mọi bản **Performance Test Plan** do skill này sinh ra PHẢI chứa đủ 12 thành phần cốt lõi:

```
1. Thông tin chung & Lịch sử tài liệu (Document Control)
2. Bối cảnh kinh doanh & Phân tích rủi ro hiệu năng (Business Drivers & Performance Risks)
3. Phạm vi kiểm thử (In-Scope Critical Transactions vs Out-of-Scope)
4. Yêu cầu phi chức năng (NFR) & Chỉ số đo lường hiệu năng (SLAs / SLOs / KPIs)
5. Chiến lược kịch bản tải (6 Scenarios: Smoke, Load, Stress, Spike, Soak, Breakpoint)
6. Kiến trúc môi trường kiểm thử & Tỷ lệ đối chiếu Production (Scale Ratio 1:1, 1:2)
7. Chiến lược dữ liệu tải lớn (Database Volume & Parameterized Test Data)
8. Chiến lược Stubbing / Mocking dịch vụ bên thứ ba (3rd-Party Isolation)
9. Chiến lược giám sát hạ tầng & Ứng dụng (APM, Prometheus, Server & DB Metrics)
10. Tiêu chí Vào - Ra - Tạm dừng kiểm thử (Entry, Exit & Suspension Criteria)
11. Cơ cấu nhân sự, Ma trận phân công trách nhiệm (RACI Matrix) & Lịch trình (Timeline)
12. Danh mục tài liệu đầu ra & Báo cáo bàn giao (Deliverables)
```

---

## 3. Chi Tiết Kỹ Thuật Từng Mục Trong Kế Hoạch

### 3.1. Bối Cảnh & Rủi Ro Kinh Doanh (Business Drivers & Risks)
- Không chỉ nói về kỹ thuật, phải liên kết trực tiếp với rủi ro kinh doanh:
  - Sự cố sập hệ thống vào giờ cao điểm (Downtime cost).
  - Tỷ lệ bỏ giỏ hàng khi trang tải chậm trên 3 giây (Bounce rate).
  - Tràn bộ nhớ (Out-Of-Memory) dẫn đến khởi động lại container liên tục.
  - Tắc nghẽn kết nối cơ sở dữ liệu (Database Connection Starvation).

### 3.2. Phạm Vi Giao Dịch Trọng Yếu (Critical Business Transactions)
- Áp dụng nguyên lý Pareto (Quy tắc 80/20): 80% tải tập trung vào 20% nghiệp vụ chính.
- Tiêu chí chọn API vào phạm vi:
  1. Tần suất người dùng gọi cao nhất (High-volume).
  2. Xử lý logic phức tạp nhất (Compute-intensive).
  3. Đọc/ghi cơ sở dữ liệu nặng nhất (I/O & DB-heavy: Báo cáo, Tìm kiếm đa tiêu chí, Checkout).

### 3.3. Định Lượng SLAs & Ngưỡng Chấp Nhận (Standard KPIs)
- **Tuyệt đối không dùng Average Response Time làm tiêu chí chính.**
- **Bắt buộc dùng Bách phân vị (Percentiles):**
  - **P90 / P95 Latency:** Đánh giá trải nghiệm 90% - 95% người dùng thông thường.
  - **P99 Latency:** Đánh giá trường hợp độ trễ xấu nhất.
  - **Thông lượng (Throughput):** Đạt tối thiểu $X$ RPS theo tính toán Little's Law.
  - **Tỷ lệ lỗi (Error Rate):** `< 1%` cho Load Test; `< 5%` cho Stress Test tại điểm cực hạn.
  - **Ngưỡng sử dụng phần cứng server:** CPU `< 75%`, RAM `< 80%`, Disk I/O không bão hòa.

### 3.4. Cấu Hình Môi Trường & Scale Ratio
- Đánh giá tương quan giữa môi trường Test và Production:
  - Nếu Test = Prod (Tỷ lệ 1:1) → Số liệu đo được là số liệu thực tế.
  - Nếu Test = 50% Prod (Tỷ lệ 1:2) → Bắt buộc nêu rõ công thức suy diễn (Extrapolation rule) và giới hạn của việc scale phi tuyến tính.
- Cấu hình máy phát tải (k6 Load Generators): Số lượng instance, CPU/RAM, băng thông mạng, tránh trường hợp máy phát tải bị nghẽn CPU trước khi server bị nghẽn.

### 3.5. Dữ Liệu Tải (Volume Sizing & Data Feeder)
- **Quy tắc vàng:** Không bao giờ test hiệu năng trên Database trống. Kích thước bảng trong DB môi trường test phải tương đương ít nhất 80% - 100% dữ liệu thực tế trên Production để đảm bảo câu query SQL phải quét index và dữ liệu thực tế.
- Dữ liệu tham số hóa: Phân bổ dữ liệu tài khoản và đơn hàng độc lập cho từng VU qua `SharedArray`.

### 3.6. Giám Sát Hạ Tầng & APM (Observability Plan)
- **Client-Side:** k6 metrics (HTTP req duration, data received, failed requests).
- **Application-Side:** APM tool (Datadog, New Relic, Dynatrace, Prometheus/Grafana) theo dõi JVM Heap, Garbage Collection pauses, Thread Pool, Response Time breakdown.
- **Database-Side:** Active connections, Lock wait time, Slow Query log, Cache hit ratio.

### 3.7. Tiêu Chí Vào - Ra - Tạm Dừng (Governance Gates)
- **Entry Criteria:**
  - [ ] Bộ code chức năng đã đóng băng (Code freeze), không sửa đổi logic nghiệp vụ trong thời gian test.
  - [ ] Môi trường test đã được cấu hình độc lập, không có người dùng kiểm thử manual khác thao tác cùng lúc.
  - [ ] Dữ liệu test (Data seed) đã được chuẩn bị đủ cho $N$ iterations mà không bị trùng lặp.
  - [ ] Script k6 đã vượt qua Smoke Test (1-2 VUs, 100% assertions PASS).
- **Suspension Criteria (Tạm dừng bài test ngay lập tức):**
  - Tỷ lệ lỗi vượt quá 15% liên tục trong 2 phút.
  - Môi trường cơ sở dữ liệu hoặc container ứng dụng bị sập (Crash / OOM).
  - Phát hiện dữ liệu của môi trường Production bị ảnh hưởng.
- **Exit Criteria (Nghiệm thu hoàn thành):**
  - [ ] Toàn bộ 6 kịch bản đã được thực thi đầy đủ.
  - [ ] 100% Thresholds cấu hình trong k6 đạt tiêu chuẩn SLA đã ký duyệt.
  - [ ] Báo cáo phân tích nguyên nhân gốc rễ (RCA) hoàn tất cho mọi điểm bất thường.
  - [ ] Tài liệu nghiệm thu có chữ ký của Performance Lead, Tech Lead và PM.

---

## 4. Quy Trình 3 Bước Sinh Performance Test Plan

```
Bước 1: Thu thập thông tin đầu vào (NFR, System Specs, SLAs)
    │
    ▼
Bước 2: Phân tích & Áp dụng công thức (Little's Law, Workload profile, RACI)
    │
    ▼
Bước 3: Biên soạn & Xuất file docs/performance/PERFORMANCE_TEST_PLAN_<MODULE_HOAC_HE_THONG>.md
```
