const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
// https://bkment-identity-service-latest.onrender.com/identity/auth/login
// const ARTICLE_URL = process.env.NEXT_PUBLIC_ARTICLE_API_URL || '';
// const USER_URL = process.env.NEXT_PUBLIC_USER_API_URL || '';

// deploy
// const IDENTITY_URL = 'https://bkment-identity-service-latest.onrender.com/identity';

//local
// const IDENTITY_URL = 'http://localhost:8888/api/v1/identity'
// local của tui là 8080
const IDENTITY_URL = 'http://localhost:8080/identity'
//local
const DEBUG_URL = ''

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${IDENTITY_URL}/auth/login`,
        SIGNUP: `${IDENTITY_URL}/accounts/users`,
        LOGOUT: `${IDENTITY_URL}/auth/logout`,
        PROFILE: `${IDENTITY_URL}/identity/api/auth/me`,
    },
    ACCOUNT: {
        PROFILE: `${IDENTITY_URL}/identity/api/auth/me`,
        GET_USER_INFO: `${DEBUG_URL}/api/user/info`,
    },
    ARTICLES: {
        GET_ALL: `${DEBUG_URL}/api/articles`,
        
        GET_DETAIL: (id: string | number) => `${DEBUG_URL}/api/articles/${id}`,
        CREATE: `${DEBUG_URL}/api/articles`,
        UPDATE: (id: string | number) => `${DEBUG_URL}/api/articles/${id}`,
        DELETE: (id: string | number) => `${DEBUG_URL}/api/articles/${id}`,
    },
    DOCUMENTS: {
        GET_ALL: `${DEBUG_URL}/api/resource`,
        UPDATE_METADATA: `${API_BASE_URL}/document/create`,
        GET_DETAIL: (id: string | number) => `${API_BASE_URL}/document/search?q=${id}`,
    },
    BLOGS: {
        GET_ALL: `${DEBUG_URL}/api/resource`,
        GET_DETAIL: (id: string | number) => `${DEBUG_URL}/api/blogs/${id}`, // gọi GET cái này để lấy dữ liệu
        UPLOAD_NEW_BLOG: `${API_BASE_URL}/blog/`
    },
    RESOURCE: {
        GET_PRESIGNED_URL: (fileName: string) => `${API_BASE_URL}/resource/presign?fileName=${fileName}`,
        UPDATE_METADATA: `${API_BASE_URL}/resource/metadata`,
        LINK_IMAGE_FILEID: (fileId: string) => `${API_BASE_URL}/resource/download/asset/${fileId}`,
    },
    COMMENTS: {
        GET_BY_DOC: (id: string | number) => `${DEBUG_URL}/api/documents/${id}/comments`,
    },
    USERS: {
        LIST: `${DEBUG_URL}/api/users`,
    }
};

