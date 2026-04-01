import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as documentService from '@/lib/services/document.service';
import { DocumentDetail } from '@/lib/services/document.service';
import { showToast } from './toastSlice';

interface MyDocumentState {
    items: DocumentDetail[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalElements: number;
}

const initialState: MyDocumentState = {
    items: [],
    status: 'idle',
    error: null,
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
};

export const fetchMyDocuments = createAsyncThunk(
    'myDocuments/fetchAll',
    async ({ page, size }: { page: number; size: number }, { rejectWithValue }) => {
        try {
            const response = await documentService.getMyDocuments(page, size);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch your documents');
        }
    }
);

export const deleteDocumentAsync = createAsyncThunk(
    'myDocuments/delete',
    async (id: string, { dispatch, rejectWithValue }) => {
        try {
            await documentService.deleteDocument(id);
            dispatch(showToast({
                type: 'success',
                title: 'Thành công',
                message: 'Đã xóa tài liệu!'
            }));
            return id;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Xóa tài liệu thất bại';
            dispatch(showToast({
                type: 'error',
                title: 'Lỗi',
                message
            }));
            return rejectWithValue(message);
        }
    }
);

const myDocumentSlice = createSlice({
    name: 'myDocuments',
    initialState,
    reducers: {
        resetMyDocuments: (state) => {
            state.items = [];
            state.status = 'idle';
            state.currentPage = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyDocuments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMyDocuments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.content;
                state.currentPage = action.payload.number || 0;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
            })
            .addCase(fetchMyDocuments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(deleteDocumentAsync.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
                state.totalElements -= 1;
            });
    },
});

export const { resetMyDocuments } = myDocumentSlice.actions;
export default myDocumentSlice.reducer;
