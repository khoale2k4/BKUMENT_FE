import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "@/lib/apiEndPoints";
import * as authService from "@/lib/services/auth.service";
import {
  RegisterPayload,
  sendForgotPasswordEmail,
  sendVerifyResetToken,
  sendResetPassword,
  ResetPasswordPayload,
} from "@/lib/services/auth.service";
import httpClient from "@/lib/services/http";
import { get } from "http";
// --- Helper to get token from localStorage (Safe for Next.js SSR) ---
import { fetchUniversities } from "../../services/auth.service";
const getStoredToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

export const parseJwt = (token: string | null) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Lỗi khi giải mã token:", error);
    return null;
  }
};

const getRolesFromToken = (token: string): string[] => {
  const decoded = parseJwt(token);
  console.log("roles decoded from token:", decoded?.scope); // Debug log để kiểm tra roles sau khi giải mã
  return decoded?.scope ? decoded.scope.split(" ") : [];
};

const getStoredCurrentRole = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("currentRole");
  }
  return null;
};

const determineDefaultRole = (roles: string[]): string => {
  if (roles.includes("ADMIN")) return "ADMIN";
  if (roles.includes("MODERATOR")) return "MODERATOR";
  // Kể cả khi có TUTOR, mặc định khi vào app vẫn là USER (họ sẽ tự switch sau)
  if (roles.includes("USER") || roles.includes("TUTOR")) return "USER";
  return roles[0] || "USER"; // Fallback an toàn
};

// --- Interfaces ---
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: { name: string; email: string } | null;
  roles: string[]; // <-- CHỈ LƯU ROLES
  currentRole: string | null; // <-- LƯU ROLE HIỆN TẠI ĐANG SỬ DỤNG
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  universities: University[];
  isUniversitiesLoading: boolean;
  universitiesError: string | null;
}

export interface University {
  id: number;
  name: string;
  // Thêm các trường khác nếu API của bạn trả về thêm (ví dụ: code, address...)
}

const initialToken = getStoredToken();
const initialRoles = initialToken ? getRolesFromToken(initialToken) : [];
const storedRole = getStoredCurrentRole();
const initialCurrentRole =
  storedRole && initialRoles.includes(storedRole)
    ? storedRole
    : initialRoles.length > 0
      ? determineDefaultRole(initialRoles)
      : "USER";

const initialState: AuthState = {
  isAuthenticated: !!getStoredToken(), // Auto-set to true if token exists
  token: getStoredToken(), // Load token from storage
  user: null, // Note: You might want to fetch user profile separately if token exists
  roles: initialToken ? getRolesFromToken(initialToken) : [], // Tự động lấy roles nếu có token
  currentRole: initialCurrentRole,
  status: "idle",
  error: null,
  universities: [],
  isUniversitiesLoading: false,
  universitiesError: null,
};

interface LoginPayload {
  username: string;
  password: string;
}

// --- Async Thunks ---

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      const result = await authService.login(credentials);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || "errors.network");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const result = await authService.register(payload);
      if (result.code !== 1000) {
        return rejectWithValue(result.message || "errors.registrationFailed");
      }
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || "errors.network");
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (token: string, { rejectWithValue }) => {
    try {
      const result = await authService.logout(token);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || "errors.logoutFailed");
    }
  },
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.refreshToken();
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || "errors.unauthorized");
    }
  },
);

export const getUniversities = createAsyncThunk(
  "auth/getUniversities",
  async (_: void, { rejectWithValue }) => {
    try {
      // Gọi đúng tên hàm API Service
      const response = await fetchUniversities();
      console.log("uni", response); // Debug log để kiểm tra dữ liệu trả về từ API
      return response as University[];
    } catch (error: any) {
      return rejectWithValue(
        error.message || "errors.network",
      );
    }
  },
);

export const forgotPasswordWithEmail = createAsyncThunk(
  "auth/forgotPasswordWithEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      // Gọi đúng hàm API đã được đổi tên
      const response = await sendForgotPasswordEmail(email);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "errors.network",
      );
    }
  },
);

export const verifyResetToken = createAsyncThunk(
  "auth/verifyResetToken",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await sendVerifyResetToken(token);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "errors.network",
      );
    }
  },
);


export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    payload: ResetPasswordPayload, // Nhận vào { email, otp, newPassword } từ UI
    { rejectWithValue }
  ) => {
    try {
      const response = await sendResetPassword(payload);
      return response;
    } catch (error: any) {
      // Bắt lỗi chuẩn từ Backend trả về
      return rejectWithValue(
        error.response?.data?.message || error.message || "errors.server"
      );
    }
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ name: string; email: string; token: string }>,
    ) => {
      state.isAuthenticated = true;
      state.user = {
        name: action.payload.name,
        email: action.payload.email,
      };
      state.token = action.payload.token;
      state.roles = getRolesFromToken(action.payload.token);
      state.currentRole = determineDefaultRole(state.roles);
      state.status = "idle";
      state.error = null;

      localStorage.setItem("accessToken", action.payload.token);
      localStorage.setItem("currentRole", state.currentRole);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: action.payload.name,
          email: action.payload.email,
        }),
      );
    },
    initializeAuth: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        const savedUser = localStorage.getItem("user");
        const savedRole = localStorage.getItem("currentRole");

        if (token) {
          state.isAuthenticated = true;
          state.token = token;
          state.roles = getRolesFromToken(token);

          // Kiểm tra chéo: savedRole có hợp lệ không?
          if (savedRole && state.roles.includes(savedRole)) {
            state.currentRole = savedRole;
          } else {
            // Nếu session lưu bậy bạ, reset về mặc định an toàn
            state.currentRole = determineDefaultRole(state.roles);
            localStorage.setItem("currentRole", state.currentRole);
          }

          if (savedUser) {
            state.user = JSON.parse(savedUser);
          }
        }
      }
    },
    switchRole: (state, action: PayloadAction<string>) => {
      const targetRole = action.payload;

      // Chỉ cho phép chuyển đổi qua lại giữa USER và TUTOR
      const allowedToSwitch = ["USER", "TUTOR"].includes(targetRole);

      if (allowedToSwitch && state.roles.includes(targetRole)) {
        state.currentRole = targetRole;
        if (typeof window !== "undefined") {
          localStorage.setItem("currentRole", targetRole);
        }
      } else {
        console.warn(
          `Attempted to switch to unauthorized or invalid role: ${targetRole}`,
        );
      }
    },
    forceLogout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.roles = [];
      state.currentRole = null;
      state.status = "idle";

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("currentRole");
        const currentPath = window.location.pathname + window.location.search;
        if (!currentPath.includes("/login")) {
          localStorage.setItem("redirectUrl", currentPath);
        }
        window.location.href = "/login";
      }
    },
  },
  extraReducers: (builder) => {
    // --- Login ---
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        const token = action.payload.token; // Đảm bảo trích xuất đúng token

        if (token) {
          state.token = token;
          state.roles = getRolesFromToken(token);

          // SỬ DỤNG HÀM XÁC ĐỊNH ROLE MẶC ĐỊNH
          state.currentRole = determineDefaultRole(state.roles);

          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", token);
            localStorage.setItem("currentRole", state.currentRole); // Phải lưu currentRole vào session

            const redirectUrl = localStorage.getItem("redirectUrl");
            if (redirectUrl) {
              localStorage.removeItem("redirectUrl");
              window.location.href = redirectUrl;
            }
          }
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // --- Register ---
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // --- Logout ---
    builder
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.roles = [];
        state.currentRole = null;
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("currentRole");
          const currentPath = window.location.pathname + window.location.search;
          if (!currentPath.includes("/login")) {
            localStorage.setItem("redirectUrl", currentPath);
          }
          window.location.href = "/login";
        }
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.roles = [];
        state.currentRole = null;
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("currentRole");
          const currentPath = window.location.pathname + window.location.search;
          if (!currentPath.includes("/login")) {
            localStorage.setItem("redirectUrl", currentPath);
          }
          window.location.href = "/login";
        }
      });

    // --- THÊM MỚI: Xử lý Refresh Token ---
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        // Lấy token mới từ payload { token: "..." }
        const newToken = action.payload.token || action.payload.result?.token;

        if (newToken) {
          state.token = newToken;
          state.roles = getRolesFromToken(newToken); // Giải mã lại roles từ token mới

          // An toàn: Kiểm tra xem token mới còn quyền của currentRole hiện tại không.
          // Nếu mất quyền TUTOR, tự động đẩy về USER.
          if (state.currentRole && !state.roles.includes(state.currentRole)) {
            state.currentRole = "USER";
            localStorage.setItem("currentRole", "USER");
          }

          // Cập nhật session storage
          localStorage.setItem("accessToken", newToken);
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        // Nếu Refresh Token thất bại (ví dụ: phiên đăng nhập đã quá hạn hoàn toàn),
        // tiến hành văng đăng xuất (Force Logout) để bảo vệ app.
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.roles = [];
        state.currentRole = null;
        state.status = "idle";

        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("currentRole");
          const currentPath = window.location.pathname + window.location.search;
          if (!currentPath.includes("/login")) {
            localStorage.setItem("redirectUrl", currentPath);
          }
          window.location.href = "/login";
        }
      });

    // --- THÊM MỚI: Get Universities ---
    builder
      .addCase(getUniversities.pending, (state) => {
        state.isUniversitiesLoading = true;
        state.universitiesError = null;
      })
      .addCase(getUniversities.fulfilled, (state, action) => {
        state.isUniversitiesLoading = false;
        state.universities = action.payload; // Gán data vào mảng
      })
      .addCase(getUniversities.rejected, (state, action) => {
        state.isUniversitiesLoading = false;
        state.universitiesError = action.payload as string;
      });
  },
});

export const { login, initializeAuth, forceLogout, switchRole } =
  authSlice.actions;
export default authSlice.reducer;
