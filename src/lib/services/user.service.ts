import { API_ENDPOINTS } from '@/lib/apiEndPoints';

interface UserInfo {
    user: string;
    avatar: string;
}

/**
 * Lấy thông tin user hiện tại
 */
export const getUserInfo = async (): Promise<UserInfo> => {
    const response = await fetch(API_ENDPOINTS.ACCOUNT.GET_USER_INFO);
    const data = await response.json();

    return {
        user: data.user,
        avatar: data.avatar,
    };
};
