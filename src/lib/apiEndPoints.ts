const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        REGISTER: `${API_BASE_URL}/api/auth/register`,
        PROFILE: `${API_BASE_URL}/api/auth/me`,
    },
    ARTICLES: {
        GET_ALL: `${API_BASE_URL}/api/articles`,
        
        GET_DETAIL: (id: string | number) => `${API_BASE_URL}/api/articles/${id}`,
        CREATE: `${API_BASE_URL}/api/articles`,
        UPDATE: (id: string | number) => `${API_BASE_URL}/api/articles/${id}`,
        DELETE: (id: string | number) => `${API_BASE_URL}/api/articles/${id}`,
    },
    USERS: {
        LIST: `${API_BASE_URL}/api/users`,
    }
};