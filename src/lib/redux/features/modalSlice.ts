import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface ModalState {
    notification: {
        isOpen: boolean;
        type: NotificationType;
        title: string;
        message: string;
    };
    
    reportModal: {
        isOpen: boolean;
        targetId: string | null; 
        type: 'DOCUMENT' | 'BLOG' | 'ACCOUNT';
    };
}

const initialState: ModalState = {
    notification: {
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
    },
    reportModal: {
        isOpen: false,
        targetId: null,
        type: 'DOCUMENT',
    }
};

interface ReportModalType {
    targetId: string;
    type: 'DOCUMENT' | 'BLOG' | 'ACCOUNT';
}

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        showNotification: (state, action: PayloadAction<{ type: NotificationType; title: string; message: string }>) => {
            state.notification.isOpen = true;
            state.notification.type = action.payload.type;
            state.notification.title = action.payload.title;
            state.notification.message = action.payload.message;
        },
        hideNotification: (state) => {
            state.notification.isOpen = false;
        },

        openReportModal: (state, action: PayloadAction<ReportModalType>) => {
            state.reportModal.isOpen = true;
            state.reportModal.targetId = action.payload.targetId;
            state.reportModal.type = action.payload.type;
        },
        closeReportModal: (state) => {
            state.reportModal.isOpen = false;
            state.reportModal.targetId = null;
        }
    },
});

export const { 
    showNotification, 
    hideNotification, 
    openReportModal, 
    closeReportModal 
} = modalSlice.actions;

export default modalSlice.reducer;