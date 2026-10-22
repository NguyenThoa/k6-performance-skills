# k6 Enterprise Performance Testing Suite 🚀

Thư mục này chứa framework kiểm thử hiệu năng doanh nghiệp được xây dựng trên nền tảng **Grafana k6**, tuân thủ kiến trúc phân tầng (Layered Architecture), hỗ trợ tích hợp CI/CD và báo cáo trực quan.

---

## 📂 Cấu Trúc Thư Mục

```
k6/
├── config/                      # Cấu hình môi trường, SLAs & kịch bản chạy
│   ├── environments.js          # Base URL và API Keys theo dev/staging/prod
│   ├── thresholds.js            # Ngưỡng SLAs (P95, P99, error rate)
│   └── options.js               # Các profile chạy (smoke, load, stress, spike, soak)
├── data/                        # Test data tham số hóa
│   ├── users.json               # Danh sách user test dùng qua SharedArray
│   └── payloads/                # Request payloads
├── libs/                        # Thư viện dùng chung
│   ├── http-client.js           # Base HTTP wrapper (auto tags, logging, headers)
│   ├── auth-provider.js         # Token retrieval & caching cho VUs
│   ├── metrics.js               # Custom Metrics (Trend, Rate, Counter)
│   └── think-time.js            # Pacing & Random Think Time helpers
├── services/                    # API Clients theo từng domain nghiệp vụ
│   └── auth.service.js          # Login, refresh token
├── scenarios/                   # Kịch bản End-to-End User Journey
│   ├── smoke-test.js            # Kiểm tra kết nối & tính đúng đắn của script
│   └── load-test.js             # Kịch bản kiểm thử tải chính
├── reports/                     # Lưu HTML reports & summary JSON
├── package.json                 # k6 scripts helper
└── README.md                    # Hướng dẫn sử dụng
```

---

## ⚡ Cài Đặt k6

### Windows (qua Winget hoặc Chocolatey):
```powershell
winget install k6 --source winget
# Hoặc
choco install k6
```

### macOS:
```bash
brew install k6
```

### Linux (Debian/Ubuntu):
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### Chạy qua Docker (Không cần cài k6 vào máy):
```bash
docker run --rm -i -v ${PWD}:/k6 grafana/k6 run /k6/scenarios/smoke-test.js
```

---

## 🏃 Hướng Dẫn Chạy Test

Từ thư mục `k6/`:

```bash
# 1. Chạy Smoke Test (1 VU, 1-2 phút)
k6 run scenarios/smoke-test.js

# 2. Chạy Load Test với cấu hình mặc định
k6 run scenarios/load-test.js

# 3. Chạy Load Test chỉ định môi trường staging qua biến môi trường
k6 run -e TARGET_ENV=staging scenarios/load-test.js

# 4. Xuất HTML Report trực tiếp
# Báo cáo tự động lưu vào reports/summary.html và reports/summary.json
```

---

## 📊 Xem Báo Cáo
Sau khi test kết thúc, mở file `k6/reports/summary.html` trên trình duyệt để xem biểu đồ và bảng phân tích chi tiết từng endpoint.
