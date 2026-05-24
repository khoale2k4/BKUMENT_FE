const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

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

/**
 * Lấy refreshToken từ localStorage
 */
export const getRefreshToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Lưu refreshToken vào localStorage
 */
export const setRefreshToken = (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * Xóa refreshToken khỏi localStorage
 */
export const removeRefreshToken = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};
