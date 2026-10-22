# Prompt Templates — k6 Performance Testing

Thư mục này chứa các prompt mẫu dùng nhanh (copy → paste → gửi) dành riêng cho **k6 Performance Testing trên Claude Code**.

---

## 📋 Danh Sách Prompts

| # | File | Command Tương Ứng | Mục Đích |
|---|---|---|---|
| 01 | `prompt_01_generate_workload_model.txt` | `/generate-k6-workload-model` | Lập mô hình tải (Workload Model) khoa học từ số liệu kinh doanh & NFR qua Định luật Little |
| 02 | `prompt_02_generate_k6_framework.txt` | `/generate-k6-framework` | Scaffold cấu trúc framework k6 chuẩn Enterprise trong thư mục `k6/` |
| 03 | `prompt_03_generate_k6_script.txt` | `/generate-k6-script` | Sinh script k6 từ OpenAPI/Swagger, HAR file hoặc Postman có correlation động |
| 04 | `prompt_04_analyze_performance_report.txt` | `/analyze-k6-performance-report` | Phân tích kết quả chạy k6 (`summary.json`), chẩn đoán bottleneck & xuất báo cáo Quality Gate |
| 05 | `prompt_05_generate_test_data.txt` | `/generate-test-data` | Sinh tập dữ liệu test tải số lượng lớn (CSV/JSON) nạp qua `SharedArray` |
| 06 | `prompt_06_generate_api_mocks.txt` | `/generate-api-mocks` | Thiết lập Mock Server cho dịch vụ bên thứ 3 để cô lập môi trường test tải |

---

## ⚡ Cách Dùng

1. Mở file `.txt` tương ứng với công việc bạn cần làm.
2. Thay thế các thông tin trong ngoặc vuông `[...]` bằng thông số thật của hệ thống.
3. Copy toàn bộ nội dung và gửi vào Claude Code.
