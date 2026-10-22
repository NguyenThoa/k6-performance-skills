---
name: skills-k6-workload-modeler
description: Skill chuyên gia phân tích và thiết kế mô hình tải (Workload Modeling) cho kiểm thử hiệu năng với k6 — tính toán Little's Law, Virtual Users (VUs), Arrival Rate (RPS), Think Time, Pacing, phân bổ User Flow Mix, và thiết lập SLA/SLO/Thresholds theo chuẩn ISO/IEC 25010.
---

# k6 Workload Modeler & Performance Strategist

> **Role & Experience:** Kỹ năng phân tích tải và chiến lược kiểm thử hiệu năng được đúc kết từ 20 năm kinh nghiệm Performance Lead/PM kết hợp 5 năm ứng dụng AI.
> **Mục tiêu:** Chuyển hóa các yêu cầu phi chức năng (NFR), traffic thực tế, hoặc tài liệu SRS/API thành **Mô hình tải khoa học (Scientific Workload Model)**, loại bỏ hoàn toàn việc "đoán mò số VU", sẵn sàng chuyển đổi trực tiếp sang k6 `options.scenarios`.

---

## 1. When to Use

Sử dụng skill này khi:
- Bắt đầu một chiến dịch kiểm thử hiệu năng cho module hoặc toàn bộ hệ thống.
- Cần tính toán số lượng **Virtual Users (VUs)**, **Throughput (RPS)**, **Pacing**, và **Think Time** dựa trên số liệu kinh doanh (VD: "Hệ thống có 50.000 active users/ngày, peak hour 30%").
- Cần thiết kế 6 kịch bản tải chuẩn: **Smoke, Load, Stress, Spike, Soak (Endurance), Breakpoint**.
- Cần thiết lập **SLA / SLO / Thresholds** khoa học cho từng API/Giao dịch (P90, P95, P99, Max Error Rate).
- Phân bổ trọng số luồng người dùng (**User Flow Traffic Mix**).

---

## 2. Nền Tảng Tính Toán Tải Khoa Học (Core Formulas)

### 2.1. Định luật Little (Little's Law)
$$N = X \times R$$
*Trong đó:*
- $N$: Số lượng Virtual Users đồng thời (Concurrency / VUs).
- $X$: Thông lượng yêu cầu (Throughput / Requests Per Second - RPS).
- $R$: Tổng thời gian một vòng lặp (Total Turnaround Time) = $T_{response} + T_{think\_time} + T_{pacing}$.

### 2.2. Tính toán Peak RPS từ chỉ số nghiệp vụ
$$\text{Peak RPS} = \frac{\text{Tổng giao dịch trong ngày} \times \text{Tỷ lệ giờ cao điểm (Peak \%)}}{\text{Số giờ cao điểm (Peak Hours)} \times 3600} \times \text{Hệ số an toàn (Safety Factor: 1.2 - 1.5)}$$

### 2.3. Tính toán VUs cần thiết
$$\text{VUs} = \text{Peak RPS} \times (\text{Response Time trung bình} + \text{Think Time trung bình})$$

> ⚠️ **Quy tắc của PM 20 năm:** Tuyệt đối không bao giờ chạy test tải mà không có **Think Time** và **Pacing**. Không có Think Time sẽ biến test tải thành **DDoS Attack**, làm sai lệch hoàn toàn bản chất hành vi người dùng thật.

---

## 3. Danh Mục 6 Kịch Bản Tải Chuẩn (k6 Executor Mapping)

| Kịch bản | Mục đích | Cấu hình k6 Executor | Đặc điểm Stages |
|---|---|---|---|
| **1. Smoke Test** | Kiểm tra tính đúng đắn của script và môi trường | `shared-iterations` hoặc `constant-vus` | 1 - 2 VUs, chạy 1 - 2 phút, 0% error chấp nhận |
| **2. Load Test (Average)** | Đánh giá hành vi hệ thống dưới tải dự kiến bình thường | `ramping-vus` hoặc `ramping-arrival-rate` | Ramp-up (10-20%) → Steady/Plateau (60-80%) → Ramp-down (10%) |
| **3. Stress Test** | Tìm điểm gãy (Breaking point), kiểm tra khả năng tự phục hồi | `ramping-vus` | Đẩy tải vượt 150% - 200% tải bình thường qua nhiều bậc (Step-up) |
| **4. Spike Test** | Kiểm tra độ đàn hồi khi tải tăng đột biến (Flash sale, mở bán vé) | `ramping-vus` | Tăng vọt từ 0 lên 300-500% trong < 30s, duy trì 2-5m rồi hạ đột ngột |
| **5. Soak / Endurance** | Tìm rò rỉ bộ nhớ (Memory Leak), cạn kiệt DB Connection Pool | `constant-vus` | Duy trì tải 70-80% trong thời gian dài (2h - 8h - 24h) |
| **6. Breakpoint Test** | Tìm giới hạn tối đa mà hệ thống có thể chịu đựng | `ramping-arrival-rate` | Tăng liên tục RPS cho đến khi Error Rate > 5% hoặc Response Time sập |

---

## 4. Chuẩn Định Nghĩa SLA & Thresholds

Skill này định nghĩa bảng ngưỡng (Thresholds) cho từng nhóm API:

```javascript
// Chuẩn thiết lập Thresholds trong k6
export const thresholds = {
  // Toàn hệ thống
  http_req_failed: ['rate<0.01'], // Tỷ lệ lỗi < 1%
  http_req_duration: ['p(95)<1500', 'p(99)<3000'], // 95% dưới 1.5s, 99% dưới 3s
  
  // Riêng từng transaction / group
  'http_req_duration{type:auth}': ['p(95)<800'],
  'http_req_duration{type:search}': ['p(95)<2000'],
  'http_req_duration{type:checkout}': ['p(95)<2500'],
};
```

---

## 5. Quy Trình 4 Bước Tạo Workload Model

```
Bước 1: Khảo sát NFR & API ──> Bước 2: Tính toán VUs/RPS ──> Bước 3: Phân bổ Traffic Mix ──> Bước 4: Xuất WORKLOAD_MODEL.md
```

### Bước 1: Thu thập thông tin đầu vào
- Danh sách API / User Flows chính.
- Số lượng người dùng hiện tại & mục tiêu tương lai (Active Users, Concurrency).
- Khung giờ cao điểm, SLAs cam kết.

### Bước 2: Tính toán thông số
- Áp dụng Little's Law tính VUs, RPS, Think Time (dùng phân phối Poisson/Gaussian ngẫu nhiên 2 - 5 giây).

### Bước 3: Phân bổ Traffic Distribution (User Mix)
- Ví dụ: 60% Người dùng duyệt xem sản phẩm (Browse/Search), 30% Thêm giỏ hàng (Cart), 10% Thanh toán (Checkout).

### Bước 4: Tạo tài liệu mô hình tải
Lưu file vào `docs/performance/<module>/WORKLOAD_MODEL_<MODULE>.md` với đầy đủ:
1. Bảng tóm tắt NFR & SLAs
2. Công thức tính toán chi tiết
3. Ma trận Traffic Mix
4. Cấu hình k6 Scenarios & Thresholds sẵn sàng để `skills-k6-script-generator` sử dụng.
