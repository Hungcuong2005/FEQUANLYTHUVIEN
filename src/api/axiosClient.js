import axios from "axios";

/**
 * axiosClient - Cấu hình Axios gốc cho toàn bộ project Client
 * 
 * - baseURL: Lấy từ biến môi trường VITE_API_BASE_URL (ưu tiên) hoặc localhost
 * - withCredentials: true (Để gửi kèm cookie/token khi gọi API)
 * - headers: Tự động xử lý dựa trên loại data (JSON/FormData)
 */
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1",
    withCredentials: true,
});

/**
 * 🔥 Request Interceptor - Tự động xử lý Content-Type
 */
axiosClient.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      console.log("🔥 [axiosClient] FormData detected - removing Content-Type header");
      delete config.headers['Content-Type'];
    } else {
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    return config;
  },
  (error) => {
    console.error("❌ [axiosClient] Request error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ [axiosClient] Response error:", {
      status: error?.response?.status,
      message: error?.response?.data?.message || error.message,
      url: error?.config?.url,
    });
    return Promise.reject(error);
  }
);

export default axiosClient;