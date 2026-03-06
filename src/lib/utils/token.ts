const TOKEN_KEY = 'accessToken';

/**
 * Lấy accessToken từ sessionStorage
 */
export const getAccessToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(TOKEN_KEY);
};

/**
 * Lưu accessToken vào sessionStorage
 */
export const setAccessToken = (token: string): void => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(TOKEN_KEY, token);
};

/**
 * Xóa accessToken khỏi sessionStorage
 */
export const removeAccessToken = (): void => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(TOKEN_KEY);
};
