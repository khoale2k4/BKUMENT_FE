import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as commentService from '@/lib/services/comment.service';

interface CommentState {
    comments: commentService.Comment[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    page: number;
    totalPages: number;
}

const initialState: CommentState = {
    comments: [],
    status: 'idle',
    page: 0,
    totalPages: 0,
};

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async ({ resourceId, page, size }: { resourceId: string, page: number, size: number }) => {
        const response = await commentService.getCommentsByDocId(resourceId, page, size);
        return {
            items: response.content || response,
            page: page,
            totalPages: response.totalPages || 1
        };
    }
);

export const fetchReplies = createAsyncThunk(
    'comments/fetchReplies',
    async ({ parentId, page, size }: { parentId: string, page: number, size: number }) => {
        const response = await commentService.getCommentsByReplyId(parentId, page, size);
        return {
            parentId,
            items: response.content || response,
            page: page,
            totalPages: response.totalPages || 1
        };
    }
);

export const submitComment = createAsyncThunk(
    'comments/submitComment',
    async (payload: commentService.CreateCommentPayload, { dispatch, rejectWithValue }) => {
        try {
            const newComment = await commentService.createComment(payload);

            if (!payload.replyId) {
                // If it's a main comment, refresh the list
                dispatch(fetchComments({ resourceId: payload.resourceId, page: 0, size: 5 }));
            } else {
                // If it's a reply, refresh the replies for that parent
                dispatch(fetchReplies({ parentId: payload.replyId, page: 0, size: 5 }));
            }

            return { newComment, replyId: payload.replyId };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Lỗi khi gửi bình luận');
        }
    }
);

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        clearComments: (state) => {
            state.comments = [];
            state.status = 'idle';
            state.page = 0;
            state.totalPages = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state, action) => {
                if (action.meta.arg.page === 0) {
                    state.status = 'loading';
                }
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (action.payload.page === 0) {
                    state.comments = action.payload.items;
                } else {
                    state.comments = [...state.comments, ...action.payload.items];
                }
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchComments.rejected, (state) => {
                state.status = 'failed';
            });

        builder
            .addCase(fetchReplies.pending, (state, action) => {
                const { parentId, page } = action.meta.arg;
                const parentIndex = state.comments.findIndex(c => c.id.toString() === parentId.toString());
                if (parentIndex !== -1 && page === 0) {
                    state.comments[parentIndex].isLoadingReplies = true;
                }
            })
            .addCase(fetchReplies.fulfilled, (state, action) => {
                const { parentId, items, page, totalPages } = action.payload;
                const parentIndex = state.comments.findIndex(c => c.id.toString() === parentId.toString());

                if (parentIndex !== -1) {
                    state.comments[parentIndex].isLoadingReplies = false;
                    state.comments[parentIndex].repliesPage = page;
                    state.comments[parentIndex].repliesTotalPages = totalPages;

                    if (page === 0) {
                        state.comments[parentIndex].replies = items;
                    } else {
                        const oldReplies = state.comments[parentIndex].replies || [];
                        state.comments[parentIndex].replies = [...oldReplies, ...items];
                    }
                }
            })
            .addCase(fetchReplies.rejected, (state, action) => {
                const { parentId } = action.meta.arg;
                const parentIndex = state.comments.findIndex(c => c.id.toString() === parentId.toString());
                if (parentIndex !== -1) {
                    state.comments[parentIndex].isLoadingReplies = false;
                }
            });

        builder
            .addCase(submitComment.fulfilled, (state, action) => {
                const { replyId } = action.payload;
                if (replyId) {
                    const parentIndex = state.comments.findIndex(c => c.id.toString() === replyId.toString());
                    if (parentIndex !== -1) {
                        state.comments[parentIndex].numberOfChildComment = (state.comments[parentIndex].numberOfChildComment || 0) + 1;
                    }
                }
            });
    },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
