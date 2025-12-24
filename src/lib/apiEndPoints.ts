const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const IDENTITY_URL = 'https://bkment-identity-service-latest.onrender.com/identity';
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
    DOCUMENTS: {
        GET_ALL: `${API_BASE_URL}/api/resource`,
        GET_DETAIL: (id: string | number) => `${API_BASE_URL}/api/documents/${id}`,
    },
    COMMENTS: {
        GET_BY_DOC: (id: string | number) => `${API_BASE_URL}/api/documents/${id}/comments`,
    },
    USERS: {
        LIST: `${API_BASE_URL}/api/users`,
    }
};

