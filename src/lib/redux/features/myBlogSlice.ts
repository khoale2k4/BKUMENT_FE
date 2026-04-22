import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as blogService from '@/lib/services/blog.service';
import { showToast } from './toastSlice';

interface MyBlogState {
    // --- KHU VỰC CŨ (Giữ nguyên để không hỏng code người khác) ---
    items: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalElements: number;

    // --- KHU VỰC MỚI CỦA BẠN (Thêm vào để dùng cho trang Profile người khác) ---
    viewedItems: any[];
    viewedStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: MyBlogState = {
    // --- KHU VỰC CŨ ---
    items: [],
    status: 'idle',
    error: null,
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,

    // --- KHU VỰC MỚI CỦA BẠN ---
    viewedItems: [],
    viewedStatus: 'idle',
};

// --- THUNK CŨ ---
export const fetchMyBlogs = createAsyncThunk(
    'myBlogs/fetchAll',
    async ({ page, size }: { page: number; size: number }, { rejectWithValue }) => {
        try {
            const response = await blogService.getMyBlogs(page, size);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'errors.fetchFailed');
        }
    }
);

export const deleteBlogAsync = createAsyncThunk(
    'myBlogs/delete',
    async (id: string, { dispatch, rejectWithValue }) => {
        try {
            await blogService.deleteBlog(id);
            dispatch(showToast({ type: 'success', title: 'common.toast.success', message: 'blogs.detail.deleteSuccess' }));
            return id;
        } catch (error: any) {
            const message = error.response?.data?.message || 'errors.deleteFailed';
            dispatch(showToast({ type: 'error', title: 'common.toast.error', message }));
            return rejectWithValue(message);
        }
    }
);

// --- THUNK MỚI CỦA BẠN ---
export const getUserBlogsById = createAsyncThunk(
    'myBlogs/fetchByUserId',
    async ({ userId, page, size }: { userId: string; page: number; size: number }, { rejectWithValue }) => {
        try {
            const response = await blogService.getUserBlogs(userId, page, size);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'errors.fetchFailed');
        }
    }
);

const myBlogSlice = createSlice({
    name: 'myBlogs',
    initialState,
    reducers: {
        resetMyBlogs: (state) => {
            state.items = [];
            state.status = 'idle';
            state.currentPage = 0;
        },
        // --- REDUCER MỚI DÀNH CHO BẠN ---
        resetViewedUserBlogs: (state) => {
            state.viewedItems = [];
            state.viewedStatus = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            // --- CÁC CASE CŨ (GIỮ NGUYÊN) ---
            .addCase(fetchMyBlogs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMyBlogs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.content || [];
                state.currentPage = action.payload.number || 0;
                state.totalPages = action.payload.totalPages || 0;
                state.totalElements = action.payload.totalElements || 0;
            })
            .addCase(fetchMyBlogs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(deleteBlogAsync.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
                state.totalElements -= 1;
            })

            // --- CÁC CASE MỚI CỦA BẠN ---
            .addCase(getUserBlogsById.pending, (state) => {
                state.viewedStatus = 'loading';
            })
            .addCase(getUserBlogsById.fulfilled, (state, action) => {
                state.viewedStatus = 'succeeded';
                state.viewedItems = action.payload.content || [];
                // Bạn có thể thêm viewedCurrentPage, viewedTotalPages vào interface nếu cần phân trang ở trang người khác
            })
            .addCase(getUserBlogsById.rejected, (state, action) => {
                state.viewedStatus = 'failed';
            });
    },
});

export const { resetMyBlogs, resetViewedUserBlogs } = myBlogSlice.actions;
export default myBlogSlice.reducer;