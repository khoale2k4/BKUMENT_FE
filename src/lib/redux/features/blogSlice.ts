import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_ENDPOINTS } from '@/lib/apiEndPoints';

interface BlogState {
    id?: string;
    title: string;
    authorId: string;
    contentHTML: string;
    coverImage: string | null;
    visibility: 'PUBLIC' | 'PRIVATE';
    status: 'idle' | 'uploading_cover' | 'submitting' | 'getting' | 'succeeded' | 'failed';
    assetIds: string[];
    error: string | null;
    createdAt: string | null;
}

const initialState: BlogState = {
    title: '',
    contentHTML: '',
    coverImage: null,
    authorId: '',
    visibility: 'PUBLIC',
    status: 'idle',
    error: null,
    assetIds: [] as string[],
    createdAt: null,
};

export const uploadImage = createAsyncThunk(
    'blog/uploadImage',
    async (file: File, { getState, rejectWithValue }) => {
        const state = (getState() as any).blog as BlogState;
        try {
            const presignedRes = await fetch(
                `${API_ENDPOINTS.RESOURCE.GET_PRESIGNED_URL(encodeURIComponent(file.name))}`
            );
            const presignedData = await presignedRes.json();

            if (presignedData.code !== 1000) throw new Error(presignedData.message);

            const { url: uploadUrl, assetId } = presignedData.result;

            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type },
            });

            if (!uploadRes.ok) throw new Error('Upload failed');

            return API_ENDPOINTS.RESOURCE.LINK_IMAGE_FILEID(assetId);
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
        console.log('Redux Submit Payload at blog Slicesf:', payload)

        const uploadRes = await fetch(API_ENDPOINTS.BLOGS.UPLOAD_NEW_BLOG, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!uploadRes.ok) throw new Error('Upload failed');

        const data = (await uploadRes.json()).result;
        return data;
    }
);

export const fetchPost = createAsyncThunk(
    'blog/fetchPost',
    async (blogId: string) => {
        const fetchRes = await fetch(API_ENDPOINTS.BLOGS.GET_DETAIL(blogId), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!fetchRes.ok) throw new Error('Upload failed');

        const data = (await fetchRes.json()).result;
        return data.content[0];
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
                state.contentHTML = action.payload.content;
                state.coverImage = action.payload.coverImage;
                state.title = action.payload.name;
                state.authorId = action.payload.authorId;
                state.createdAt = action.payload.createdAt;
                state.status = 'succeeded';
            })
            .addCase(fetchPost.pending, (state) => {
                state.status = 'getting';
            })
    }
});

export const { setTitle, setContent, setCoverImage, setVisibility, resetEditor } = blogSlice.actions;
export default blogSlice.reducer;