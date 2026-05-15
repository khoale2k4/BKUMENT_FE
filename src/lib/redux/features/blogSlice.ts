import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as blogService from '@/lib/services/blog.service';
import * as documentService from '@/lib/services/document.service';
import { showToast } from './toastSlice';

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
    views: number | null;
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
    views: null,
};

export const uploadImage = createAsyncThunk(
    'blog/uploadImage',
    async (file: File, { rejectWithValue }) => {
        try {
            return await blogService.uploadImage(file);
        } catch (error: any) {
            console.error(error.message);
            return rejectWithValue(error.message || 'errors.uploadFailed');
        }
    }
);

// export const submitPost = createAsyncThunk(
//     'blog/submitPost',
//     async (_, { getState, rejectWithValue }) => {
//         const state = (getState() as any).blogs as BlogState;

//         if (!state.title.trim()) return rejectWithValue('errors.titleRequired');
//         if (!state.contentHTML.trim()) return rejectWithValue('errors.contentRequired');

//         const payload = {
//             title: state.title,
//             coverImage: state.coverImage,
//             content: state.contentHTML,
//             visibility: state.visibility,
//             // type: 'POST',
//             assetIds: state.assetIds,
//             topicId: "string"
//         };
//         console.log('Redux Submit Payload at blog Slicesf:', payload);

//         try {
//             return await blogService.submitPost(payload);
//         } catch (error: any) {
//             return rejectWithValue(error.message || 'blogs.write.header.failMsg');
//         }
//     }
// );

export const submitPost = createAsyncThunk(
    'blog/submitPost',
    async (_, { getState, rejectWithValue }) => {
        const state = (getState() as any).blogs as BlogState;

        if (!state.title.trim()) return rejectWithValue('errors.titleRequired');
        if (!state.contentHTML.trim()) return rejectWithValue('errors.contentRequired');

        // Regex chuẩn để nhận diện UUID
        const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
        
        // Cắt lấy ID từ mảng URL hiện tại
        const extractedAssetIds = state.assetIds
            .map((url: string) => {
                const match = url.match(uuidRegex);
                return match ? match[0] : null; // Lấy chuỗi UUID nếu match
            })
            .filter((id: string | null) => id !== null); // Lọc bỏ các giá trị null

        const payload = {
            title: state.title,
            coverImage: state.coverImage || "", 
            content: state.contentHTML,
            visibility: state.visibility,
            assetIds: extractedAssetIds, // Sử dụng mảng ID vừa được trích xuất
            topicId: "INT1005" 
        };
        
        console.log('Redux Submit Payload at blog Slice:', payload);

        try {
            return await blogService.submitPost(payload);
        } catch (error: any) {
            return rejectWithValue(error.message || 'blogs.write.header.failMsg');
        }
    }
);


export const updateBlogAsync = createAsyncThunk(
    'myBlogs/update',
    async (
        { 
            id, 
            title, 
            contentHTML, 
            coverImage, 
            visibility, 
            assetIds = [], 
            topicId = "INT1005" 
        }: { 
            id: string; 
            title: string; 
            contentHTML: string; 
            coverImage: string | null; 
            visibility: 'PUBLIC' | 'PRIVATE';
            assetIds?: string[];
            topicId?: string;
        }, 
        { dispatch, rejectWithValue }
    ) => {
        // 1. Validate dữ liệu đầu vào (giống submitPost)
        if (!title.trim()) return rejectWithValue('errors.titleRequired');
        if (!contentHTML.trim()) return rejectWithValue('errors.contentRequired');

        // 2. Regex chuẩn để nhận diện UUID
        const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
        
        // 3. Cắt lấy ID từ mảng URL hiện tại
        const extractedAssetIds = assetIds
            .map((url: string) => {
                const match = url.match(uuidRegex);
                return match ? match[0] : null; // Lấy chuỗi UUID nếu match
            })
            .filter((id: string | null) => id !== null); // Lọc bỏ các giá trị null

        // 4. Gom thành payload chuẩn
        const payload = {
            title: title,
            coverImage: coverImage || "", // Đảm bảo không gửi null
            content: contentHTML,
            visibility: visibility,
            assetIds: extractedAssetIds,
            topicId: topicId 
        };

        console.log('Redux Update Payload at blog Slice:', payload);

        try {
            // Lưu ý: Đảm bảo hàm blogService.updateBlog của bạn đã được cấu hình 
            // để nhận thêm assetIds và topicId (hoặc nhận nguyên object payload)
            await blogService.updateBlog(id, payload); 
            
            dispatch(showToast({ type: 'success', title: 'common.toast.success', message: 'blogs.detail.updateSuccess' }));
            
            // Trả về dữ liệu đã update để cập nhật lại Redux state
            return { id, ...payload };
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'errors.updateFailed';
            dispatch(showToast({ type: 'error', title: 'common.toast.error', message }));
            return rejectWithValue(message);
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
       resetEditor: (state) => {
            state.id = undefined;
            state.title = '';
            state.author = undefined;
            state.contentHTML = '';
            state.coverImage = null;
            state.visibility = 'PUBLIC';
            state.status = 'idle';
            state.assetIds = [];
            state.error = null;
            state.createdAt = null;
            state.averageRating = null;
            state.myRating = null;
            state.views = null;
        }
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
                state.id = action.payload.id; 
                state.visibility = action.payload.visibility || 'PUBLIC';
                state.assetIds = action.payload.assetIds || [];
                state.contentHTML = action.payload.content;
                state.coverImage = action.payload.coverImage;
                state.title = action.payload.name;
                state.author = action.payload.author;
                state.createdAt = action.payload.createdAt;
                state.views = action.payload.views;
                state.status = 'succeeded';
            })
            .addCase(fetchPost.pending, (state) => {
                state.status = 'getting';
            })
            .addCase(updateBlogAsync.pending, (state) => {
                state.status = 'submitting';
            })
            .addCase(updateBlogAsync.fulfilled, (state, action) => {
                state.id = action.payload.id;
                state.title = action.payload.title;
                state.contentHTML = action.payload.content;
                state.coverImage = action.payload.coverImage;
                state.visibility = action.payload.visibility;
                state.assetIds = action.payload.assetIds;
                state.status = 'succeeded';
            })
            .addCase(updateBlogAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
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