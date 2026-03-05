import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_ENDPOINTS } from '@/lib/apiEndPoints'; 
import * as authService from '@/lib/services/auth.service';

// --- Helper to get token from LocalStorage (Safe for Next.js SSR) ---
const getStoredToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken');
    }
    return null;
};

// --- Interfaces ---
interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    user: { name: string; email: string } | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: !!getStoredToken(), // Auto-set to true if token exists
    token: getStoredToken(),             // Load token from storage
    user: null, // Note: You might want to fetch user profile separately if token exists
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
        role: string;
    };
    firstName: string;
    lastName: string;
    dob: string;
    university: string;
}

// --- Async Thunks ---

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: LoginPayload, { rejectWithValue }) => {
        try {
            const result = await authService.login(credentials);
            return result;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (payload: RegisterPayload, { rejectWithValue }) => {
        try {
            const result = await authService.register(payload);
            return result;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (token: string, { rejectWithValue }) => {
        try {
            const result = await authService.logout(token);
            return result;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Logout failed');
        }
    }
);

// --- Slice ---

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Standard reducer for manual login updates
        login: (state, action: PayloadAction<{ name: string; email: string; token: string }>) => {
            state.isAuthenticated = true;
            state.user = {
                name: action.payload.name,
                email: action.payload.email
            };
            state.token = action.payload.token;
            state.status = 'idle';
            state.error = null;
            
            // Sync with LocalStorage
            localStorage.setItem('accessToken', action.payload.token);
        },
        initializeAuth: (state) => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('accessToken');
                const savedUser = localStorage.getItem('user');

                if (token) {
                    state.isAuthenticated = true;
                    state.token = token;
                    
                    if (savedUser) {
                        state.user = JSON.parse(savedUser);
                    }
                }
            }

        },
        // Force logout (e.g., when token expires)
        forceLogout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.status = 'idle';
            
            // Sync with LocalStorage
            localStorage.removeItem('accessToken');
        },
    },
    extraReducers: (builder) => {
        // --- Login ---
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
                
                // SAVE TO STORAGE
                localStorage.setItem('accessToken', action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.isAuthenticated = false;
            });

        // --- Register ---
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

        // --- Logout ---
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
                
                // REMOVE FROM STORAGE
                localStorage.removeItem('accessToken');
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                
                // Even if API fails, we forcefully logout the user on client side
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                localStorage.removeItem('accessToken');
            });
    }
});

export const { login, initializeAuth, forceLogout } = authSlice.actions;
export default authSlice.reducer;