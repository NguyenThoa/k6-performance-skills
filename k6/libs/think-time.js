import { sleep } from 'k6';

/**
 * Pacing & Think Time Helper:
 * Mô phỏng thời gian dừng đọc/thao tác của người dùng thật.
 * Tuyệt đối không dùng sleep cố định (fixed) vì sẽ tạo ra các đợt dội sóng hài phi thực tế.
 */

/**
 * Dừng ngẫu nhiên trong khoảng [minSeconds, maxSeconds] (Phân phối đều - Uniform Distribution)
 */
export function randomThinkTime(minSeconds = 1, maxSeconds = 3) {
  const duration = Math.random() * (maxSeconds - minSeconds) + minSeconds;
  sleep(duration);
}

/**
 * Dừng theo phân phối chuẩn (Gaussian / Normal Distribution)
 * @param {number} mean - Thời gian dừng kỳ vọng trung bình (giây)
 * @param {number} stdDev - Độ lệch chuẩn
 */
export function gaussianThinkTime(mean = 2.0, stdDev = 0.5) {
  // Box-Muller transform
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  let duration = mean + z0 * stdDev;
  if (duration < 0.2) duration = 0.2; // Tránh sleep âm hoặc quá ngắn
  sleep(duration);
}
