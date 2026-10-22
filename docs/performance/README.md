# Danh Mục Báo Cáo & Mô Hình Tải Hiệu Năng (Performance Catalog)

Thư mục này lưu trữ tài liệu kế hoạch tải (**Workload Models**) và kết quả thực thi kiểm thử hiệu năng (**Run Reports**) theo từng module.

---

## 📂 Quy Định Tổ Chức Thư Mục

```
docs/performance/
├── README.md                                  # Danh mục này
└── <module>/
    ├── WORKLOAD_MODEL_<MODULE>.md             # Bản mô hình tải, tính toán VUs, Little's Law, Scenarios
    └── runs/
        └── run_<timestamp>_<loại-test>/       # Ví dụ: run_20261022_2130_load_test/
            ├── summary.json                   # Output kết quả thô từ k6
            ├── summary.html                   # Dashboard báo cáo trực quan
            └── performance_report.md          # Báo cáo đánh giá, đối soát SLA, phân tích bottleneck
```
