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
    downloadUrl: string;
    downloadCount: number;
    documentType?: string;
    downloadable: boolean;
    university?: string;
    course?: string;
    createdAt: Date;
}

export interface UserInfo {
    user: string;
    avatar: string;
}

interface DocumentState {
    currentDocument: DocumentDetail | null;
    detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';

    currentAuthor: UserInfo | null;
    authorStatus: 'idle' | 'loading' | 'succeeded' | 'failed';

    comments: Comment[];
    commentsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: DocumentState = {
    currentDocument: null,
    detailStatus: 'idle',

    currentAuthor: null,
    authorStatus: 'idle',

    comments: [],
    commentsStatus: 'idle'
};

export const fetchDocumentById = createAsyncThunk(
    'documents/fetchDetail',
    async (id: string) => {
        const response = await fetch(`${API_ENDPOINTS.DOCUMENTS.GET_DETAIL(id)}`);
        const data = (await response.json()).result;

        return {
            id: id,
            title: data.title || "Untitled Document",
            description: data.description  || "No description available.",
            downloadUrl: data.downloadUrl || "",
            createdAt: data.createdAt,
            documentType: data.documentType,
            downloadable: data.downloadable,
            downloadCount: data.downloadCount,
            course: data.course,
            university: data.university,
        } as DocumentDetail;
    }
);

export const fetchAuthorById = createAsyncThunk(
    'documents/fetchAuthor',
    async (id: string) => {
        const response = await fetch(`${API_ENDPOINTS.ACCOUNT.GET_USER_INFO}`);
        const data = await response.json();

        return {
            id: id,
            user: data.user,
            avatar: data.avatar
        } as UserInfo;
    }
);

export const fetchCommentsByDocId = createAsyncThunk(
    'documents/fetchComments',
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
            state.currentAuthor = null;
            state.comments = [];
            state.detailStatus = 'idle';
            state.authorStatus = 'idle';
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
            .addCase(fetchAuthorById.pending, (state) => {
                state.authorStatus = 'loading';
            })
            .addCase(fetchAuthorById.fulfilled, (state, action: PayloadAction<UserInfo>) => {
                state.authorStatus = 'succeeded';
                state.currentAuthor = action.payload;
            })
            .addCase(fetchAuthorById.rejected, (state) => {
                state.authorStatus = 'failed';
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