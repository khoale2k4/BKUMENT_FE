import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Comment {
    id: string | number;
    user: string;
    avatar: string;
    content: string;
    time: string;
    likes: number;
}

export interface DocumentDetail {
    id: string;
    title: string;
    description: string;
    author: {
        name: string;
        avatar: string;
        role?: string;
    };
    stats: {
        views: number;
        downloads: number;
        pages: number;
        date: string;
    };
    fileUrl: string;
}

interface DocumentState {
    currentDocument: DocumentDetail | null;
    detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';

    comments: Comment[];
    commentsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: DocumentState = {
    currentDocument: null,
    detailStatus: 'idle',

    comments: [],
    commentsStatus: 'idle'
};

export const fetchDocumentById = createAsyncThunk(
    'documents/fetchDetail',
    async (id: string) => {
        const response = await fetch(`${API_ENDPOINTS.DOCUMENTS.GET_DETAIL(id)}`);
        const data = await response.json();

        return {
            id: data.id,
            title: data.title || "Untitled Document",
            description: data.description || data.content || "No description available.",
            author: {
                name: data.author?.name || data.author || "Unknown",
                avatar: data.author?.avatar || "https://placehold.co/100x100/3b82f6/white?text=A",
                role: data.author?.role || "Author"
            },
            stats: {
                views: data.views || 0,
                downloads: data.downloads || 0,
                pages: data.pages || 1,
                date: data.createdAt || "Recently"
            },
            fileUrl: data.fileUrl || data.assets?.[0] || ""
        } as DocumentDetail;
    }
);

export const fetchCommentsByDocId = createAsyncThunk(
    'articles/fetchComments',
    async (documentId: string) => {
        const response = await fetch(`${API_ENDPOINTS.COMMENTS.GET_BY_DOC(documentId)}`);
        const data = await response.json();

        return data.map((c: any) => ({
            id: c.id,
            user: c.user || c.author,
            avatar: c.avatar || "https://placehold.co/100x100/gray/white?text=U",
            content: c.content,
            time: c.createdAt || "Just now",
            likes: c.likes || 0
        })) as Comment[];
    }
);

const documentSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        clearCurrentDocument: (state) => {
            state.currentDocument = null;
            state.comments = [];
            state.detailStatus = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDocumentById.pending, (state) => {
                state.detailStatus = 'loading';
            })
            .addCase(fetchDocumentById.fulfilled, (state, action: PayloadAction<DocumentDetail>) => {
                state.detailStatus = 'succeeded';
                state.currentDocument = action.payload;
            })
            .addCase(fetchDocumentById.rejected, (state) => {
                state.detailStatus = 'failed';
            });

        builder
            .addCase(fetchCommentsByDocId.pending, (state) => {
                state.commentsStatus = 'loading';
            })
            .addCase(fetchCommentsByDocId.fulfilled, (state, action: PayloadAction<Comment[]>) => {
                state.commentsStatus = 'succeeded';
                state.comments = action.payload;
            })
            .addCase(fetchCommentsByDocId.rejected, (state) => {
                state.commentsStatus = 'failed';
            });
    },
});

export const { clearCurrentDocument } = documentSlice.actions;
export default documentSlice.reducer;