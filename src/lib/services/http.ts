import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken } from '@/lib/utils/token';

/**
 * HTTP client dùng chung cho toàn bộ ứng dụng
 * Tự động gắn Authorization header nếu có token
 */
const httpClient: AxiosInstance = axios.create({
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor - tự động gắn token vào header
 */
httpClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - xử lý lỗi tập trung
 */
httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Có thể thêm logic xử lý lỗi tập trung ở đây
        // Ví dụ: redirect về login nếu 401
        if (error.response?.status === 401) {
            // Handle unauthorized
            console.error('Unauthorized - Token may be invalid or expired');
        }

        return Promise.reject(error);
    }
);

export default httpClient;
