# k6 Performance Testing Skills 🚀

Chào mừng bạn đến với **k6 Performance Testing Skills** — bộ công cụ và kỹ năng kiểm thử hiệu năng doanh nghiệp được thiết kế chuyên biệt cho **Claude Code** và **Grafana k6**.

Bộ repo này được đúc kết từ **20 năm kinh nghiệm Performance Lead / PM** kết hợp **5 năm ứng dụng AI trong tự động hóa kiểm thử tải**, loại bỏ hoàn toàn các phương pháp "đoán mò số VUs", mang đến quy trình kiểm thử hiệu năng khoa học từ khâu lập mô hình tải, sinh mã kịch bản, đến chẩn đoán nút thắt cổ chai (bottlenecks) và thẩm định phát hành (Release Gate).

---

## 🌟 Tính Năng Nổi Bật

- **📐 Lập Mô Hình Tải Khoa Học (Little's Law):** Tự động tính toán số lượng Virtual Users (VUs), Arrival Rate (RPS), Pacing, và Think Time từ số liệu kinh doanh thực tế. Không dội tải mù quáng.
- **🎯 Bao Phủ 6 Loại Kịch Bản Tải Chuẩn:** Smoke Test, Average Load Test, Stress Test (tìm điểm gãy), Spike Test (đột biến tức thời), Soak/Endurance Test (săn rò rỉ RAM), Breakpoint Test.
- **🏗️ Framework k6 Chuẩn Enterprise (Modular Architecture):**
  - Tách bạch `config/`, `data/`, `libs/`, `services/`, `scenarios/`, `reports/`.
  - Quản lý đa môi trường linh hoạt (`local`, `dev`, `staging`).
  - Sử dụng `SharedArray` bảo vệ bộ nhớ RAM, chống cạn kiệt tài nguyên máy test khi tải hàng nghìn VUs.
  - Cơ chế Auth Provider caching thông minh, tránh nghẽn API đăng nhập.
- **🤖 Sinh Script k6 Thông Minh Với AI:**
  - Tự động convert từ OpenAPI / Swagger, HAR capture (DevTools), hoặc Postman Collection.
  - Xử lý **Dynamic Correlation** (trích xuất token, session ID, order ID giữa các bước).
  - Tự động gán static URL tags (`tags: { name: 'GET /orders/:id' }`) ngăn chặn bùng nổ High Cardinality.
  - Mô phỏng hành vi người thật với **Random Think Time** (Gaussian & Uniform distribution).
- **🔬 Chẩn Đoán Điểm Nghẽn Tự Động (Root Cause Analysis - RCA):**
  - Phân tích `summary.json`, phát hiện đường cong gậy khúc côn cầu (*Hockey-stick*), cạn kiệt DB Connection Pool, Slow queries thiếu Index, Memory leak trong Soak test, Ingress Rate Limit (HTTP 429).
  - Ra quyết định Quality Gate: 🟢 **PASS (GO)** / 🟡 **WARN** / 🔴 **FAIL (NO-GO)**.
  - Xuất báo cáo HTML trực quan kèm khuyến nghị kỹ thuật cụ thể cho Backend Dev & DevOps.

---

## 📂 Cấu Trúc Thư Mục Chuẩn

```
k6-performance-skills/
├── .claude/
│   ├── commands/                 # 6 Slash Commands chuyên biệt
│   │   ├── generate-k6-workload-model.md
│   │   ├── generate-k6-framework.md
│   │   ├── generate-k6-script.md
│   │   ├── analyze-k6-performance-report.md
│   │   ├── generate-test-data.md
│   │   └── generate-api-mocks.md
│   ├── rules/
│   │   └── performance_rules.md  # 5 quy tắc bắt buộc về an toàn tải, SLA P95/P99
│   ├── skills/                   # 6 Kỹ năng chuyên môn sâu cho AI
│   │   ├── skills-k6-workload-modeler
│   │   ├── skills-k6-framework-architect
│   │   ├── skills-k6-script-generator
│   │   ├── skills-k6-analyzer-diagnoser
│   │   ├── skills-test-data-generator
│   │   └── skills-api-mocking
│   └── settings.json             # Quyền hạn thực thi k6 & shell cho Claude Code
├── k6/                           # MÃ NGUỒN FRAMEWORK k6 CHUẨN ENTERPRISE
│   ├── config/                   # environments, options, thresholds
│   ├── data/                     # users.json nạp qua SharedArray
│   ├── libs/                     # http-client, auth-provider, think-time, metrics
│   ├── services/                 # API client classes theo domain nghiệp vụ
│   ├── scenarios/                # smoke-test.js, load-test.js
│   ├── reports/                  # Lưu HTML Report & summary JSON
│   ├── package.json              # npm scripts chạy test nhanh
│   └── README.md                 # Hướng dẫn chi tiết chạy k6
├── prompts/                      # 6 PROMPT MẪU DÙNG NHANH (Copy → Paste → Gửi)
│   ├── prompt_01_generate_workload_model.txt
│   ├── prompt_02_generate_k6_framework.txt
│   ├── prompt_03_generate_k6_script.txt
│   ├── prompt_04_analyze_performance_report.txt
│   ├── prompt_05_generate_test_data.txt
│   ├── prompt_06_generate_api_mocks.txt
│   └── README.md
├── docs/
│   └── performance/              # ĐẦU RA KẾT QUẢ DỰ ÁN
│       ├── README.md
│       └── <module>/
│           ├── WORKLOAD_MODEL_<MODULE>.md
│           └── runs/run_<timestamp>/performance_report.md
├── CLAUDE.md                     # Quy tắc chung cho AI Agent
├── .gitignore                    # Bỏ qua node_modules, reports, .env
└── README.md                     # Tài liệu này
```

---

## 🔄 Quy Trình 4 Chặng Kiểm Thử Hiệu Năng (End-to-End Workflow)

```
[Chặng 1: Lập Mô Hình Tải] ──────> [Chặng 2: Scaffold Framework]
  /generate-k6-workload-model         /generate-k6-framework
  (Tính VUs, Little's Law, SLAs)      (Chuẩn hóa cấu trúc thư mục k6/)
                 │                                   │
                 ▼                                   ▼
[Chặng 4: Chẩn Đoán & Quality Gate] <─── [Chặng 3: Sinh Script k6]
  /analyze-k6-performance-report       /generate-k6-script
  (Phân tích P95, RCA, GO/NO-GO)       (Convert OpenAPI/HAR, Correlation)
```

---

## ⚡ Cài Đặt k6

### Windows
```powershell
winget install k6 --source winget
# Hoặc
choco install k6
```

### macOS
```bash
brew install k6
```

### Linux (Ubuntu/Debian)
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6
```

### Chạy qua Docker (Không cần cài đặt)
```bash
docker run --rm -i -v ${PWD}/k6:/k6 grafana/k6 run /k6/scenarios/smoke-test.js
```

---

## 🏃 Hướng Dẫn Bắt Đầu Nhanh

### Bước 1: Khởi động Smoke Test
Từ thư mục gốc:
```bash
cd k6
npm run test:smoke
```

### Bước 2: Thiết kế kịch bản tải mới
1. Mở file `prompts/prompt_01_generate_workload_model.txt`, điền số lượng active users và SLAs mong muốn.
2. Gửi vào Claude Code để tạo file `docs/performance/<module>/WORKLOAD_MODEL_<MODULE>.md`.

### Bước 3: Tự động sinh kịch bản từ OpenAPI / Swagger
1. Mở file `prompts/prompt_03_generate_k6_script.txt`, dán link Swagger/OpenAPI.
2. Gửi vào Claude Code để tự động sinh file Service trong `k6/services/` và Scenario trong `k6/scenarios/`.

### Bước 4: Chạy test và phân tích báo cáo
1. Chạy kịch bản: `k6 run scenarios/load-test.js`
2. Mở file `k6/reports/load_test_summary.html` để xem biểu đồ trực quan.
3. Dùng lệnh `/analyze-k6-performance-report` để AI chẩn đoán nguyên nhân gốc rễ và xuất báo cáo Quality Gate.
