# k6 Performance Testing Skills 🚀

Chào mừng bạn đến với **k6 Performance Testing Skills** — bộ công cụ và kỹ năng kiểm thử hiệu năng doanh nghiệp được thiết kế chuyên biệt cho **Claude Code** và **Grafana k6**.

Bộ repo này được đúc kết từ **Thoant Tester**, loại bỏ hoàn toàn các phương pháp "đoán mò số VUs", mang đến quy trình kiểm thử hiệu năng khoa học từ khâu lập mô hình tải, sinh mã kịch bản, đến chẩn đoán nút thắt cổ chai (bottlenecks) và thẩm định phát hành (Release Gate).

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
│   ├── commands/                 # 7 Slash Commands chuyên biệt
│   │   ├── generate-performance-test-plan.md # /generate-performance-test-plan (Master Plan ISO 29119-3)
│   │   ├── generate-k6-workload-model.md     # /generate-k6-workload-model (Little's Law, VUs, RPS)
│   │   ├── generate-k6-framework.md          # /generate-k6-framework (Scaffold modular framework)
│   │   ├── generate-k6-script.md             # /generate-k6-script (Convert OpenAPI/HAR sang k6)
│   │   ├── analyze-k6-performance-report.md  # /analyze-k6-performance-report (Chẩn đoán RCA & Gate)
│   │   ├── generate-test-data.md             # /generate-test-data (CSV/JSON data feeder)
│   │   └── generate-api-mocks.md             # /generate-api-mocks (Mocking 3rd party)
│   ├── rules/
│   │   └── performance_rules.md  # 5 quy tắc bắt buộc về an toàn tải, SLA P95/P99
│   ├── skills/                   # 7 Kỹ năng chuyên môn sâu cho AI
│   │   ├── skills-performance-test-planner   # Lập kế hoạch tải chuẩn ISO/IEC 29119-3 & IEEE 829
│   │   ├── skills-k6-workload-modeler        # Lập mô hình tải khoa học, 6 loại test
│   │   ├── skills-k6-framework-architect     # Kiến trúc framework k6 phân tầng
│   │   ├── skills-k6-script-generator        # Sinh code k6 chuẩn, dynamic correlation
│   │   ├── skills-k6-analyzer-diagnoser      # Chẩn đoán điểm nghẽn & Quality Gate
│   │   ├── skills-test-data-generator        # Sinh dữ liệu lớn nạp SharedArray
│   │   └── skills-api-mocking                # Mocking 3rd-party cô lập hệ thống
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
├── prompts/                      # 7 PROMPT MẪU DÙNG NHANH (Copy → Paste → Gửi)
│   ├── prompt_00_generate_performance_test_plan.txt
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
│       ├── PERFORMANCE_TEST_PLAN_<MODULE>.md  # Bản kế hoạch cấp quản lý ký duyệt
│       └── <module>/
│           ├── WORKLOAD_MODEL_<MODULE>.md
│           └── runs/run_<timestamp>/performance_report.md
├── CLAUDE.md                     # Quy tắc chung cho AI Agent
├── .gitignore                    # Bỏ qua node_modules, reports, .env
└── README.md                     # Tài liệu này
```

---

## 🔄 Quy Trình 5 Chặng Kiểm Thử Hiệu Năng (End-to-End Performance Lifecycle)

```
[Chặng 0: Lập Kế Hoạch Chuẩn] ────> [Chặng 1: Lập Mô Hình Tải] ────> [Chặng 2: Scaffold Framework]
  /generate-performance-test-plan     /generate-k6-workload-model         /generate-k6-framework
  (ISO 29119-3 / IEEE 829 Plan)       (Tính VUs, Little's Law, SLAs)      (Chuẩn hóa cấu trúc k6/)
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

Bạn có 2 cách tiếp cận tùy theo mục đích:

---

### Cách 1: Chạy Thử Nhanh Công Cụ k6 (Quick Dry-Run)
*Dành cho người mới bắt đầu muốn kiểm tra môi trường và chạy thử script k6 mẫu trong 1 phút:*

1. Di chuyển vào thư mục k6:
   ```bash
   cd k6
   ```
2. Chạy kịch bản Smoke Test (1 VU, 1 phút):
   ```bash
   npm run test:smoke
   ```
3. Xem báo cáo HTML sinh ra tại `k6/reports/smoke_test_summary.html`.

---

### Cách 2: Quy Trình Chuẩn Dự Án Từ A-Z (Enterprise Performance Delivery)
*Dành cho chiến dịch kiểm thử tải thực tế của hệ thống / module — tuân thủ chuẩn quản lý chất lượng:*

```
[Bước 0: Lập Plan Chuẩn] ──> [Bước 1: Mô Hình Tải] ──> [Bước 2: Sinh Script] ──> [Bước 3: Chạy & Đo Đạc] ──> [Bước 4: Chẩn Đoán & Gate]
```

* **Bước 0: Lập Kế Hoạch Kiểm Thử Hiệu Năng (Master Performance Test Plan)**
  * Mở `prompts/prompt_00_generate_performance_test_plan.txt`, điền bối cảnh dự án, SLAs mong muốn, cấu hình máy chủ test và nhân sự phụ trách.
  * Gửi vào Claude Code để xuất file `docs/performance/PERFORMANCE_TEST_PLAN_<HE_THONG>.md` chuẩn ISO/IEC 29119-3 & IEEE 829 làm căn cứ ký duyệt với Stakeholders/Khách hàng trước khi phát tải.

* **Bước 1: Lập Mô Hình Tải Khoa Học (Workload Model)**
  * Mở `prompts/prompt_01_generate_workload_model.txt`, điền traffic giờ cao điểm (Peak hours) và số active users.
  * Gửi vào Claude Code để tính toán VUs, RPS theo Định luật Little ($N = X \times R$) và cấu hình Stages cho 6 kịch bản tải ra file `docs/performance/<module>/WORKLOAD_MODEL_<MODULE>.md`.

* **Bước 2: Tự Động Sinh Kịch Bản k6 Từ Swagger / OpenAPI**
  * Mở `prompts/prompt_03_generate_k6_script.txt`, dán link Swagger/OpenAPI hoặc file HAR capture.
  * Gửi vào Claude Code để tự động tạo Service class (`k6/services/`) và kịch bản E2E (`k6/scenarios/`) có đầy đủ Dynamic Correlation, static URL tagging và Random Think Time.

* **Bước 3: Thực Thi Kịch Bản Kiểm Thử Tải**
  * Chạy kịch bản kiểm thử tải:
    ```bash
    k6 run scenarios/load-test.js
    ```
  * Mở file `k6/reports/load_test_summary.html` trên trình duyệt để quan sát biểu đồ và bảng phân tích endpoint.

* **Bước 4: Chẩn Đoán Điểm Nghẽn & Thẩm Định Phát Hành (Quality Gate)**
  * Mở `prompts/prompt_04_analyze_performance_report.txt`, trích xuất kết quả chạy từ `k6/reports/summary.json`.
  * Gửi vào Claude Code để AI chẩn đoán nguyên nhân gốc rễ (Database bottlenecks, Memory leaks, Ingress Rate Limit) và ra quyết định **Quality Gate: 🟢 PASS (RELEASE GO) / 🟡 WARN / 🔴 FAIL (NO-GO)**.
