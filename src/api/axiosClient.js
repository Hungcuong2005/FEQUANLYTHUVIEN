import axios from "axios";

/**
 * axiosClient - Cấu hình Axios gốc cho toàn bộ project Client
 */
const rawBase =
  (import.meta.env?.VITE_API_BASE_URL || "http://localhost:4000").replace(/\/+$/, "");

const axiosClient = axios.create({
  baseURL: `${rawBase}/api/v1`,
  withCredentials: true,
});

/**
 * 🔥 Request Interceptor - Tự động xử lý Content-Type
 */
axiosClient.interceptors.request.use(
  (config) => {

    // ✅ GẮN TOKEN VÀO HEADER
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // giữ logic cũ
    if (config.data instanceof FormData) {
      console.log("🔥 [axiosClient] FormData detected - removing Content-Type header");
      delete config.headers["Content-Type"];
    } else if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
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
