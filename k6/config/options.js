/**
 * Các mẫu cấu hình k6 Scenarios cho 6 loại kịch bản chuẩn
 */

// 1. Smoke Test: Xác thực script và kiểm tra kết nối (1 VU, 1-2 phút)
export const smokeOptions = {
  vus: 1,
  duration: '1m',
};

// 2. Load Test (Average Load): 3 giai đoạn Ramp-up -> Steady -> Ramp-down
export const loadOptions = {
  stages: [
    { duration: '2m', target: 50 },  // Ramp-up lên 50 VUs trong 2 phút
    { duration: '5m', target: 50 },  // Giữ tải ổn định 50 VUs trong 5 phút
    { duration: '1m', target: 0 },   // Ramp-down về 0
  ],
};

// 3. Stress Test: Tìm điểm gãy (Breaking point) qua các bậc thang tải
export const stressOptions = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '3m', target: 100 },
    { duration: '3m', target: 150 },
    { duration: '3m', target: 200 }, // Đỉnh tải 200 VUs
    { duration: '2m', target: 0 },
  ],
};

// 4. Spike Test: Đột biến tức thời trong thời gian cực ngắn
export const spikeOptions = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '30s', target: 250 }, // Bật vọt lên 250 VUs trong 30 giây
    { duration: '2m', target: 250 },  // Duy trì đỉnh sốc 2 phút
    { duration: '30s', target: 10 },  // Hạ sốc về 10
    { duration: '1m', target: 0 },
  ],
};

// 5. Soak / Endurance Test: Kiểm tra rò rỉ bộ nhớ (Memory Leak)
export const soakOptions = {
  stages: [
    { duration: '5m', target: 40 },
    { duration: '2h', target: 40 },  // Giữ tải liên tục 2 giờ (có thể tăng lên 8h-24h)
    { duration: '5m', target: 0 },
  ],
};
