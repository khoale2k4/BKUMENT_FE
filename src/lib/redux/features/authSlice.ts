// src/lib/redux/features/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    user: { name: string; email: string } | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    user: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // 3. Update PayloadAction to include 'token'
        login: (state, action: PayloadAction<{ name: string; email: string; token: string }>) => {
            state.isAuthenticated = true;
            state.user = {
                name: action.payload.name,
                email: action.payload.email
            };
            // 4. Save the token to the state
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null; // Clear token on logout
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;