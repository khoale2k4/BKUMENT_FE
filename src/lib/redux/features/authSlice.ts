import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_ENDPOINTS } from '@/lib/apiEndPoints'; // Đảm bảo import đúng đường dẫn

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    user: { name: string; email: string } | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    user: null,
    status: 'idle',
    error: null,
};

interface LoginPayload {
    username: string;
    password: string;
}

export interface RegisterPayload {
    account: {
        username: string;
        password: string;
        role: string; // VD: "STUDENT"
    };
    firstName: string;
    lastName: string;
    dob: string;
    university: string;
}

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: LoginPayload, { rejectWithValue }) => {
        try {
            const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (data.code === 1000) {
                return {
                    token: data.result.token,
                    user: {
                        name: credentials.username,
                        email: credentials.username
                    }
                };
            } else {
                return rejectWithValue(data.message || 'Login failed');
            }
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (payload: RegisterPayload, { rejectWithValue }) => {
        try {
            const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.code === 1000) {
                return data.result;
            } else {
                return rejectWithValue(data.message || 'Registration failed');
            }
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });

            if (!response.ok) {
                throw new Error('Logout API failed');
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Logout failed');
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ name: string; email: string; token: string }>) => {
            state.isAuthenticated = true;
            state.user = {
                name: action.payload.name,
                email: action.payload.email
            };
            state.token = action.payload.token;
            state.status = 'idle';
            state.error = null;
        },
        forceLogout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.isAuthenticated = false;
            });

        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        builder
            .addCase(logoutUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.status = 'succeeded';
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;

                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            });
    }
});

export const { login, forceLogout } = authSlice.actions;
export default authSlice.reducer;