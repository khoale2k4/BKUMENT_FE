import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "@/lib/apiEndPoints";
import * as authService from "@/lib/services/auth.service";
import { RegisterPayload } from "@/lib/services/auth.service";
// --- Helper to get token from sessionStorage (Safe for Next.js SSR) ---
const getStoredToken = () => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("accessToken");
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
  return decoded?.scope ? decoded.scope.split(" ") : [];
};

const getStoredCurrentRole = () => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("currentRole");
  }
  return null;
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

  // --- THÊM MỚI: State lưu danh sách trường Đại học ---
  universities: University[];
  isUniversitiesLoading: boolean;
  universitiesError: string | null;
}
const initialToken = getStoredToken();

const initialState: AuthState = {
  isAuthenticated: !!getStoredToken(), // Auto-set to true if token exists
  token: getStoredToken(), // Load token from storage
  user: null, // Note: You might want to fetch user profile separately if token exists
  roles: initialToken ? getRolesFromToken(initialToken) : [], // Tự động lấy roles nếu có token
  currentRole: getStoredCurrentRole() || "USER",
  status: "idle",
  error: null,

  // --- THÊM MỚI: State lưu danh sách trường Đại học ---
  universities: [],
  isUniversitiesLoading: false,
  universitiesError: null,
};

interface LoginPayload {
  username: string;
  password: string;
}

export interface University {
  id: number;
  name: string;
  // Thêm các trường khác nếu API của bạn trả về thêm (ví dụ: code, address...)
}

// --- Async Thunks ---

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      const result = await authService.login(credentials);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const result = await authService.register(payload);
      if (result.code !== 1000) {
        alert("Đăng ký thất bại: " + result.message);
        return rejectWithValue(result.message || "Registration failed");
      }
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
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
      return rejectWithValue(error.message || "Logout failed");
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
      return rejectWithValue(error.message || "Refresh token failed");
    }
  }
);

export const getUniversities = createAsyncThunk(
  "auth/getUniversities",
  async (_, { rejectWithValue }) => {
    try {
      // Bạn có thể đưa URL này vào file API_ENDPOINTS.ts cho gọn nhé
      const response = await fetch("http://localhost:8888/api/v1/profile/universities", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      // Dựa theo format chung của dự án bạn (code 1000 là success)
      if (data.code !== 1000) {
        throw new Error(data.message || "Failed to fetch universities");
      }
      console.log("Danh sách trường Đại học nhận được:", data.result);

      return data.result as University[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi kết nối khi tải danh sách trường");
    }
  }
);
// --- Slice ---

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
      state.currentRole = "USER";
      state.status = "idle";
      state.error = null;

      sessionStorage.setItem("accessToken", action.payload.token);
      sessionStorage.setItem("user", JSON.stringify({ name: action.payload.name, email: action.payload.email }));
    },
    initializeAuth: (state) => {
      if (typeof window !== "undefined") {
        const token = sessionStorage.getItem("accessToken");
        const savedUser = sessionStorage.getItem("user");
        const savedRole = sessionStorage.getItem("currentRole");
        if (token) {
          state.isAuthenticated = true;
          state.token = token;
          state.roles = getRolesFromToken(token);
          state.currentRole = savedRole || "USER";
          if (savedUser) {
            state.user = JSON.parse(savedUser);
          }
        }
      }
    },
    switchRole: (state, action: PayloadAction<string>) => {
      const newRole = action.payload;
      if (state.roles.includes(newRole)) {
        state.currentRole = newRole;
        sessionStorage.setItem("currentRole", newRole);
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
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("currentRole");
        const currentPath = window.location.pathname + window.location.search;
        if (!currentPath.includes("/login")) {
          localStorage.setItem("redirectUrl", currentPath);
        }
        window.location.href = '/login';
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
        const token = action.payload.token;

        if (token) {
          state.token = token;
          state.roles = getRolesFromToken(token);
          state.currentRole = "USER";
          if (typeof window !== "undefined") {
            sessionStorage.setItem("accessToken", token);
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
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("currentRole");
          const currentPath = window.location.pathname + window.location.search;
          if (!currentPath.includes("/login")) {
            localStorage.setItem("redirectUrl", currentPath);
          }
          window.location.href = '/login';
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
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("currentRole");
          const currentPath = window.location.pathname + window.location.search;
          if (!currentPath.includes("/login")) {
            localStorage.setItem("redirectUrl", currentPath);
          }
          window.location.href = '/login';
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
            sessionStorage.setItem("currentRole", "USER");
          }

          // Cập nhật session storage
          sessionStorage.setItem("accessToken", newToken);
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
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("currentRole");
          const currentPath = window.location.pathname + window.location.search;
          if (!currentPath.includes("/login")) {
            localStorage.setItem("redirectUrl", currentPath);
          }
          window.location.href = '/login';
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

export const { login, initializeAuth, forceLogout, switchRole } = authSlice.actions;
export default authSlice.reducer;