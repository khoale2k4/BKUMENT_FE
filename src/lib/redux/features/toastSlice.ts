import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationState {
    isOpen: boolean;
    type: NotificationType;
    title: string;
    message: string;
    id: number;
}

const initialState: NotificationState = {
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    id: 0,
};

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        showToast: (state, action: PayloadAction<{ type: NotificationType; title: string; message: string }>) => {
            state.isOpen = true;
            state.type = action.payload.type;
            state.title = action.payload.title;
            state.message = action.payload.message;
        },
        hideToast: (state) => {
            state.isOpen = false;
        },
    },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;