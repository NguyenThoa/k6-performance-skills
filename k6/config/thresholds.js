/**
 * Tiêu chí đánh giá chất lượng hiệu năng (SLAs & Quality Gates)
 * Bám chuẩn ISO/IEC 25010 và best practices của PM 20 năm kinh nghiệm
 */

export const defaultThresholds = {
  // 1. Tỷ lệ lỗi (Error Rate) phải dưới 1%
  http_req_failed: [
    {
      threshold: 'rate<0.01',
      abortOnFail: false,
    },
  ],

  // 2. Thời gian phản hồi: 95% dưới 1500ms, 99% dưới 3000ms
  http_req_duration: [
    'p(90)<1000',
    'p(95)<1500',
    'p(99)<3000',
  ],

  // 3. Thời gian kết nối TCP & handshake SSL
  http_req_connecting: ['p(95)<200'],
  http_req_tls_handshaking: ['p(95)<300'],
};

// Ngưỡng riêng cho kịch bản Stress / Spike (cho phép độ trễ cao hơn)
export const stressThresholds = {
  http_req_failed: ['rate<0.05'], // Cho phép lỗi tối đa 5% ở đỉnh tải
  http_req_duration: ['p(95)<3000', 'p(99)<5000'],
};
