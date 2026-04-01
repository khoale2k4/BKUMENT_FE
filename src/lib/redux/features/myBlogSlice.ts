import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as blogService from '@/lib/services/blog.service';
import { showToast } from './toastSlice';

interface MyBlogState {
    items: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalElements: number;
}

const initialState: MyBlogState = {
    items: [],
    status: 'idle',
    error: null,
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
};

export const fetchMyBlogs = createAsyncThunk(
    'myBlogs/fetchAll',
    async ({ page, size }: { page: number; size: number }, { rejectWithValue }) => {
        try {
            const response = await blogService.getMyBlogs(page, size);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch your blogs');
        }
    }
);

export const deleteBlogAsync = createAsyncThunk(
    'myBlogs/delete',
    async (id: string, { dispatch, rejectWithValue }) => {
        try {
            await blogService.deleteBlog(id);
            dispatch(showToast({
                type: 'success',
                title: 'Thành công',
                message: 'Đã xóa bài viết!'
            }));
            return id;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Xóa bài viết thất bại';
            dispatch(showToast({
                type: 'error',
                title: 'Lỗi',
                message
            }));
            return rejectWithValue(message);
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
        }
    },
    extraReducers: (builder) => {
        builder
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
            });
    },
});

export const { resetMyBlogs } = myBlogSlice.actions;
export default myBlogSlice.reducer;
