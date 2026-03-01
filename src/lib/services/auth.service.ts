import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import { setAccessToken, removeAccessToken } from '@/lib/utils/token';

interface LoginCredentials {
    username: string;
    password: string;
}

interface RegisterPayload {
    account: {
        username: string;
        password: string;
        role: string;
    };
    firstName: string;
    lastName: string;
    dob: string;
    university: string;
}

interface LoginResponse {
    token: string;
    user: {
        name: string;
        email: string;
    };
}

/**
 * Login user và tự động lưu token
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (data.code === 1000) {
        const token = data.result.token;

        // Tự động lưu token vào localStorage
        setAccessToken(token);

        return {
            token,
            user: {
                name: credentials.username,
                email: credentials.username,
            },
        };
    } else {
        throw new Error(data.message || 'Login failed');
    }
};

/**
 * Register user mới
 */
export const register = async (payload: RegisterPayload): Promise<any> => {
    const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
};

/**
 * Logout user và xóa token
 */
export const logout = async (token: string): Promise<any> => {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    });

    if (!response.ok) {
        throw new Error('Logout API failed');
    }

    const data = await response.json();

    // Xóa token khỏi localStorage
    removeAccessToken();

    return data;
};
