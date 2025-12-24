const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
// https://bkment-identity-service-latest.onrender.com/identity/auth/login

const IDENTITY_URL = 'https://bkment-identity-service-latest.onrender.com/identity';
// const ARTICLE_URL = process.env.NEXT_PUBLIC_ARTICLE_API_URL || '';
// const USER_URL = process.env.NEXT_PUBLIC_USER_API_URL || '';
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${IDENTITY_URL}/api/auth/login`,
        REGISTER: `${IDENTITY_URL}/api/auth/register`,
        PROFILE: `${IDENTITY_URL}/api/auth/me`,
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

