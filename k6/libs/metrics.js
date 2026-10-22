import { Trend, Rate, Counter, Gauge } from 'k6/metrics';

/**
 * Custom Metrics:
 * Theo dõi chuyên sâu các nghiệp vụ trọng yếu vượt ra ngoài chỉ số HTTP mặc định
 */

// Trend: Đo thời gian hoàn tất các chuỗi nghiệp vụ quan trọng
export const BusinessJourneyDuration = new Trend('business_journey_duration', true);
export const SearchDuration = new Trend('search_latency', true);
export const CheckoutDuration = new Trend('checkout_latency', true);

// Rate: Tỷ lệ thành công/thất bại theo góc nhìn người dùng
export const BusinessSuccessRate = new Rate('business_success_rate');

// Counter: Đếm số lượng đơn hàng hoặc giao dịch hoàn thành thành công
export const CompletedOrdersCount = new Counter('completed_orders_count');

// Gauge: Theo dõi kích thước tải trọng hoặc giá trị tức thời
export const ActiveSessionsGauge = new Gauge('active_sessions_estimate');
