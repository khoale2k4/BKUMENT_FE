import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as blogService from '@/lib/services/blog.service';
import * as documentService from '@/lib/services/document.service';

interface Author {
    id: string,
    name: string,
    avatarUrl: string
}

interface BlogState {
    id?: string;
    title: string;
    author?: Author;
    contentHTML: string;
    coverImage: string | null;
    visibility: 'PUBLIC' | 'PRIVATE';
    status: 'idle' | 'uploading_cover' | 'submitting' | 'getting' | 'succeeded' | 'failed';
    assetIds: string[];
    error: string | null;
    createdAt: string | null;

    averageRating: number | null;
    myRating: number | null;
}

const initialState: BlogState = {
    title: '',
    contentHTML: '',
    coverImage: null,
    visibility: 'PUBLIC',
    status: 'idle',
    error: null,
    assetIds: [] as string[],
    createdAt: null,
    averageRating: null,
    myRating: null,
};

export const uploadImage = createAsyncThunk(
    'blog/uploadImage',
    async (file: File, { rejectWithValue }) => {
        try {
            return await blogService.uploadImage(file);
        } catch (error: any) {
            console.error(error.message);
            return rejectWithValue(error.message || 'Upload error');
        }
    }
);

export const submitPost = createAsyncThunk(
    'blog/submitPost',
    async (_, { getState, rejectWithValue }) => {
        const state = (getState() as any).blogs as BlogState;

        if (!state.title.trim()) return rejectWithValue('Tiêu đề không được để trống');
        if (!state.contentHTML.trim()) return rejectWithValue('Nội dung không được để trống');

        const payload = {
            title: state.title,
            coverImage: state.coverImage,
            content: state.contentHTML,
            visibility: state.visibility,
            type: 'POST',
            assetIds: state.assetIds,
        };
        console.log('Redux Submit Payload at blog Slicesf:', payload);

        try {
            return await blogService.submitPost(payload);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Submit failed');
        }
    }
);

export const fetchRatingData = createAsyncThunk(
    'blog/fetchRating',
    async (resourceId: string) => {
        const [average, myRating] = await Promise.all([
            documentService.getAverageRating(resourceId).catch(() => 0),
            documentService.getMyRating(resourceId).catch(() => 0)
        ]);
        return { average, myRating };
    }
);

export const rateBlog = createAsyncThunk(
    'blog/rate',
    async ({ resourceId, rating }: { resourceId: string, rating: number }, { dispatch }) => {
        await documentService.submitRating(resourceId, rating);
        dispatch(fetchRatingData(resourceId));
        return rating;
    }
);

export const fetchPost = createAsyncThunk(
    'blog/fetchPost',
    async (blogId: string, { dispatch }) => {
        const response = await blogService.fetchPostById(blogId);
        dispatch(fetchRatingData(blogId));
        return response;
    }
);

export const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
        setContent: (state, action: PayloadAction<string>) => {
            state.contentHTML = action.payload;
        },
        setCoverImage: (state, action: PayloadAction<string | null>) => {
            state.coverImage = action.payload;
        },
        setVisibility: (state, action: PayloadAction<'PUBLIC' | 'PRIVATE'>) => {
            state.visibility = action.payload;
        },
        resetEditor: () => ({ ...initialState, assetIds: [] })
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadImage.fulfilled, (state, action) => {
                state.assetIds.push(action.payload);
            })
            .addCase(submitPost.pending, (state) => {
                state.status = 'submitting';
            })
            .addCase(submitPost.fulfilled, (state, action) => {
                state.id = action.payload.id;
                state.status = 'succeeded';
            })
            .addCase(submitPost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchPost.fulfilled, (state, action) => {
                // TODO: fix this
                state.contentHTML = action.payload.content;
                state.coverImage = action.payload.coverImage;
                state.title = action.payload.name;
                state.author = action.payload.author;
                state.createdAt = action.payload.createdAt;
                state.status = 'succeeded';
            })
            .addCase(fetchPost.pending, (state) => {
                state.status = 'getting';
            });

        builder.addCase(fetchRatingData.fulfilled, (state, action) => {
            state.averageRating = action.payload.average;
            state.myRating = action.payload.myRating;
        });

        builder.addCase(rateBlog.fulfilled, (state, action) => {
            state.myRating = action.payload;
        });
    }
});

export const { setTitle, setContent, setCoverImage, setVisibility, resetEditor } = blogSlice.actions;
export default blogSlice.reducer;