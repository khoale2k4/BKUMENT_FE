import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_ENDPOINTS } from '@/lib/apiEndPoints';

interface BlogState {
    title: string;
    contentHTML: string;
    coverImage: string | null;
    visibility: 'PUBLIC' | 'PRIVATE';
    status: 'idle' | 'uploading_cover' | 'submitting' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: BlogState = {
    title: '',
    contentHTML: '',
    coverImage: null,
    visibility: 'PUBLIC',
    status: 'idle',
    error: null,
};

export const uploadImage = createAsyncThunk(
    'blog/uploadImage',
    async (file: File, { rejectWithValue }) => {
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
            contentHTML: state.contentHTML,
            visibility: state.visibility,
            type: 'POST',
        };

        console.log('Redux Submit Payload at blog Slicesf:', payload);
        await new Promise(resolve => setTimeout(resolve, 1500));

        return payload;
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
        resetEditor: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitPost.pending, (state) => {
                state.status = 'submitting';
            })
            .addCase(submitPost.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(submitPost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { setTitle, setContent, setCoverImage, setVisibility, resetEditor } = blogSlice.actions;
export default blogSlice.reducer;