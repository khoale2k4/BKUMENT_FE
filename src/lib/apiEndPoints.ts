const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
// https://bkment-identity-service-latest.onrender.com/identity/auth/login
// const ARTICLE_URL = process.env.NEXT_PUBLIC_ARTICLE_API_URL || '';
// const USER_URL = process.env.NEXT_PUBLIC_USER_API_URL || '';

// deploy
//const IDENTITY_URL = 'https://bkment-identity-service-latest.onrender.com/identity';

//local
const IDENTITY_URL = 'http://localhost:8080/identity'
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${IDENTITY_URL}/auth/login`,
        SIGNUP: `${IDENTITY_URL}/accounts/users`,
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

