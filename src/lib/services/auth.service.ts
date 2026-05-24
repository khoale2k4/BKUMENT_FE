import { API_ENDPOINTS } from "@/lib/apiEndPoints";
import { setAccessToken, removeAccessToken, getRefreshToken, setRefreshToken, removeRefreshToken } from "@/lib/utils/token";
import httpClient from "./http";
import axios from "axios"; // Import thẳng từ thư viện gốc
interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterPayload {
  account: {
    username: string;
    password: string;
    role: string;
  };
  firstName: string;
  lastName: string;
  dob: string;
  universityId: number;
  email: string;
  phone: string;
  address: string;
  bio: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    name: string;
    email: string;
  };
}

// Thêm interface này để TypeScript gợi ý code cho chuẩn
export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}
/**
 * Login user và tự động lưu token
 */
export const login = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (data.code === 1000) {
    const token = data.result.token;
    const refreshTokenValue = data.result.refreshToken;

    // Tự động lưu token vào localStorage
    setAccessToken(token);
    if (refreshTokenValue) setRefreshToken(refreshTokenValue);

    return {
      token,
      refreshToken: refreshTokenValue,
      user: {
        name: credentials.username,
        email: credentials.username,
      },
    };
  } else {
    throw new Error(data.message || "Login failed");
  }
};

/**
 * Register user mới
 */
export const register = async (payload: RegisterPayload): Promise<any> => {
  const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error("Logout API failed");
  }

  const data = await response.json();

  // Xóa token khỏi localStorage
  removeAccessToken();
  removeRefreshToken();

  return data;
};

export const refreshToken = async () => {
  const currentRefreshToken = getRefreshToken();

  if (!currentRefreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: currentRefreshToken }),
  });

  const data = await response.json();
  if (data.code !== 1000) {
    throw new Error(data.message);
  }

  return data.result; // Trả về { token: "...", refreshToken: "..." }
};

// Sửa getUniversities thành fetchUniversities
export const fetchUniversities = async (): Promise<
  { id: number; name: string }[]
> => {
  const response = await fetch(API_ENDPOINTS.ACCOUNT.GET_UNIVERSITIES(1, 200));
  const data = await response.json();
  return data.result.data;
};

export const sendForgotPasswordEmail = async (email: string): Promise<any> => {
  const response = await httpClient.post(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD_WITH_EMAIL(email),
  );
  return response.data.result;
};

export const sendVerifyResetToken = async (token: string): Promise<any> => {
  const response = await httpClient.post(
    API_ENDPOINTS.AUTH.VERIFY_RESET_TOKEN(token),
  );
  return response.data.result;
};

export const sendResetPassword = async (
  payload: ResetPasswordPayload,
): Promise<any> => {
  // Dùng axios thuần thì sẽ không bị dính bất kỳ interceptor nào cài trong httpClient
  const response = await axios.post(
    API_ENDPOINTS.AUTH.RESET_PASSWORD, // Đảm bảo cái này là URL đầy đủ (có http://)
    payload,
  );

  return response.data.result;
};
