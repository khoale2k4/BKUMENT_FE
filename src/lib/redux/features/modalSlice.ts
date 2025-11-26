import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationState {
    isOpen: boolean;
    type: NotificationType;
    title: string;
    message: string;
}

const initialState: NotificationState = {
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        showNotification: (state, action: PayloadAction<{ type: NotificationType; title: string; message: string }>) => {
            state.isOpen = true;
            state.type = action.payload.type;
            state.title = action.payload.title;
            state.message = action.payload.message;
        },
        hideNotification: (state) => {
            state.isOpen = false;
        },
    },
});

export const { showNotification, hideNotification } = modalSlice.actions;
export default modalSlice.reducer;