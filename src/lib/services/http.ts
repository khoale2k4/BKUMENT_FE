import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, removeAccessToken, removeRefreshToken } from "@/lib/utils/token";
import { API_ENDPOINTS } from "@/lib/apiEndPoints";

/**
 * HTTP client dùng chung cho toàn bộ ứng dụng
 * Tự động gắn Authorization header nếu có token
 */
const httpClient: AxiosInstance = axios.create({
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Request interceptor - tự động gắn token vào header
 */
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    console.log("quang lay token ở http client:", token); // Debug log

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor - xử lý lỗi tập trung
 */
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return httpClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const currentRefreshToken = getRefreshToken();
      
      if (!currentRefreshToken) {
        isRefreshing = false;
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname + window.location.search;
          if (!currentPath.includes('/login')) {
            localStorage.setItem('redirectUrl', currentPath);
            removeAccessToken();
            removeRefreshToken();
            localStorage.removeItem('currentRole');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }

      try {
        const response = await fetch(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: currentRefreshToken }),
        });
        const data = await response.json();
        
        if (data.code === 1000) {
          const newToken = data.result.token;
          const newRefreshToken = data.result.refreshToken;
          
          setAccessToken(newToken);
          if (newRefreshToken) setRefreshToken(newRefreshToken);
          
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return httpClient(originalRequest);
        } else {
          throw new Error(data.message || "Refresh failed");
        }
      } catch (err) {
        processQueue(err, null);
        
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname + window.location.search;
          if (!currentPath.includes('/login')) {
            localStorage.setItem('redirectUrl', currentPath);
            removeAccessToken();
            removeRefreshToken();
            localStorage.removeItem('currentRole');
            window.location.href = '/login';
          }
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default httpClient;
