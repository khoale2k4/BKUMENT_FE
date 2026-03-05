const TOKEN_KEY = 'accessToken';

/**
 * Lấy accessToken từ localStorage
 */
export const getAccessToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
};

/**
 * Lưu accessToken vào localStorage
 */
export const setAccessToken = (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Xóa accessToken khỏi localStorage
 */
export const removeAccessToken = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
};
