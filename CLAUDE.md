# CLAUDE AI - PERFORMANCE TESTING AGENT RULES

> **Scope:** Áp dụng cho mọi tác vụ Kiểm thử Hiệu năng (Performance / Load / Stress Testing) với Grafana k6 trong repository này.
> **Mục tiêu:** Xây dựng kịch bản tải khoa học, chính xác, mô phỏng đúng hành vi người dùng thật, phát hiện sớm các nút thắt cổ chai (bottlenecks) và bảo vệ hạ tầng hệ thống.

---

## 1. Nguyên Tắc Cốt Lõi Của Performance Engineer

1. **Giao tiếp hoàn toàn bằng Tiếng Việt:** Báo cáo, giải thích, và phân tích số liệu hoàn toàn bằng Tiếng Việt chuẩn mực.
2. **Khoa học thay vì cảm tính:** Tuyệt đối không đoán mò số lượng VUs. Mọi con số VUs và RPS phải được tính toán dựa trên **Định luật Little ($N = X \times R$)** và dữ liệu traffic thực tế.
3. **Mô phỏng thực tế (Workload Realism):**
   - Mọi kịch bản (trừ Spike Test có chủ đích) BẮT BUỘC phải có các giai đoạn: **Ramp-up (Làm nóng cache/pool) → Plateau (Giữ tải đo đạc) → Ramp-down (Hạ tải)**.
   - BẮT BUỘC có **Think Time** ngẫu nhiên (Uniform/Gaussian) giữa các bước. Không được dội tải liên tục (Hammering) biến bài test thành tấn công DDoS.
4. **An toàn dữ liệu & hạ tầng:**
   - Tuyệt đối không chạy tải lên môi trường Production khi chưa có văn bản phê duyệt và khung giờ bảo trì riêng.
   - Tài khoản test phải độc lập, dữ liệu sinh ra phải có prefix/tag để tự động dọn dẹp (Cleanup).
5. **Đo lường theo Percentiles:**
   - Không lấy Average (Trung bình) làm chuẩn. Chuẩn đánh giá chất lượng là **P95, P99, Error Rate < 1%**, và khả năng phục hồi sau đỉnh tải.

---

## 2. Kỹ Thuật Lập Trình k6 Bắt Buộc

1. **Data Feeder:** BẮT BUỘC dùng `SharedArray` từ `k6/data` để nạp dữ liệu test một lần vào bộ nhớ dùng chung. CẤM đọc file JSON trong default function vì sẽ làm cạn kiệt RAM khi chạy nhiều VUs.
2. **URL Tagging tĩnh:** Mọi request có chứa tham số đường dẫn động (Path variables như `/users/:id`) BẮT BUỘC phải gắn `tags: { name: 'GET /users/:id' }` để tránh bùng nổ cardinality k6.
3. **Dynamic Correlation:** Trích xuất Token, Session ID, Order ID động giữa các bước. Tuyệt đối không hardcode ID hay token tĩnh trong kịch bản.
4. **Auth Caching:** Sử dụng cơ chế cache token trong `AuthProvider` để tránh làm sập service đăng nhập khi hàng nghìn VUs cùng khởi chạy một lúc.

---

## 3. Danh Mục Lệnh (Slash Commands)

- `/generate-k6-workload-model`: Lập mô hình tải khoa học, tính VUs, RPS và 6 kịch bản tải.
- `/generate-k6-framework`: Khởi tạo hoặc cập nhật cấu trúc framework k6 chuẩn Enterprise.
- `/generate-k6-script`: Tự động sinh script k6 từ OpenAPI, file HAR capture hoặc Postman.
- `/analyze-k6-performance-report`: Đọc log hoặc `summary.json`, chẩn đoán điểm nghẽn và xuất báo cáo Quality Gate.
- `/generate-test-data`: Sinh dữ liệu test tải số lượng lớn (CSV/JSON).
- `/generate-api-mocks`: Tạo mock server cho các dịch vụ 3rd-party.
