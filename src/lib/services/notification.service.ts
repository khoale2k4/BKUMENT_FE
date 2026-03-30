// // src/lib/services/notification.service.ts
// import httpClient from './http';
// import { API_ENDPOINTS } from '../apiEndPoints';

// export interface AppNotification {
//     id: string;
//     type: string;
//     title: string;
//     message: string;
//     timestamp: string; // Đổi từ createdAt thành timestamp
//     read: boolean;
//     metadata: any;
// }

// export interface PaginatedNotifications {
//     currentPage: number;
//     totalPages: number;
//     pageSize: number;
//     totalElements: number;
//     data: AppNotification[];
// }

// export const fetchNotifications = async (page: number = 1, size: number = 20): Promise<PaginatedNotifications> => {
//     const response = await httpClient.get(API_ENDPOINTS.CHAT.GET_APP_NOTIFICATION(page, size));
//     console.log('API Response for notifications:', response.data); // Debug log
//     return response.data.result;
// };

 import httpClient from './http';
import { API_ENDPOINTS } from '@/lib/apiEndPoints'; // Nhớ import config chứa CHAT_URL của bạn

export interface AppNotification {
    id: string;
    type: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    metadata: any;
}

export interface PaginatedNotifications {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
    data: AppNotification[];
}

export const fetchNotifications = async (page: number, size: number ): Promise<PaginatedNotifications> => {
    const response = await httpClient.get(API_ENDPOINTS.CHAT.GET_APP_NOTIFICATION(page, size));
    return response.data.result;
};

export const fetchUnreadCount = async (): Promise<number> => {
    const response = await httpClient.get(API_ENDPOINTS.CHAT.COUNT_UNREAD_NOTIFICATIONS);
    return response.data.result; // Giả sử API trả về trực tiếp một con số
};

export const markAllNotificationsRead = async () => {
    const response = await httpClient.patch(API_ENDPOINTS.CHAT.MARK_ALL_NOTIFICATIONS_READ);
    return response.data.result;
};

export const markNotificationRead = async (notificationId: string) => {
    const response = await httpClient.patch(API_ENDPOINTS.CHAT.MARK_NOTIFICATION_READ(notificationId));
    return response.data.result;
};
