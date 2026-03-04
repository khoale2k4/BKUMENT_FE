import { FileUploadItem } from '@/types/FileUpload';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as documentService from '@/lib/services/document.service';
import * as userService from '@/lib/services/user.service';
import * as commentService from '@/lib/services/comment.service';
import axios from 'axios';

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
interface UploadState {
    files: FileUploadItem[];
    activeStep: number;
    uploadStatus: 'idle' | 'uploading' | 'saving' | 'success' | 'error';
}

interface DocumentState {
    currentDocument: DocumentDetail | null;
    detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';

    currentAuthor: UserInfo | null;
    authorStatus: 'idle' | 'loading' | 'succeeded' | 'failed';

    comments: Comment[];
    commentsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';

    upload: UploadState;
}

const initialState: DocumentState = {
    currentDocument: null,
    detailStatus: 'idle',

    currentAuthor: null,
    authorStatus: 'idle',

    comments: [],
    commentsStatus: 'idle',

    upload: {
        files: [],
        activeStep: 1,
        uploadStatus: 'idle',
    }
};

export const fetchDocumentById = createAsyncThunk(
    'documents/fetchDetail',
    async (id: string) => {
        return await documentService.getDocumentById(id);
    }
);

export const fetchAuthorById = createAsyncThunk(
    'documents/fetchAuthor',
    async (id: string) => {
        const data = await userService.getUserInfo();

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
        return await commentService.getCommentsByDocId(documentId);
    }
);

export const uploadFile = createAsyncThunk(
    'documents/uploadFile',
    async (fileItem: FileUploadItem, { dispatch, rejectWithValue }) => {
        const { localId, file } = fileItem;
        if (!file) return;

        try {
            dispatch(updateFileStatus({ localId, updates: { status: 'getting_url' } }));

            const { url: uploadUrl, assetId: fileId } = await documentService.getPresignedUrl(file.name);

            dispatch(updateFileStatus({
                localId,
                updates: {
                    status: 'uploading',
                    presignedUrl: uploadUrl,
                    storageId: fileId
                }
            }));

            await axios.put(uploadUrl, file, {
                headers: { 'Content-Type': file.type },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        dispatch(updateFileProgress({ localId, progress: percent }));
                    }
                },
            });

            dispatch(updateFileStatus({ localId, updates: { status: 'uploaded', progress: 100 } }));
            return localId;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Upload failed';
            dispatch(updateFileStatus({ localId, updates: { status: 'error', errorMessage } }));
            return rejectWithValue({ localId, errorMessage });
        }
    }
);

export const saveFilesMetadata = createAsyncThunk(
    'documents/saveFilesMetadata',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const state = getState() as { documents: DocumentState };
        const filesToSave = state.documents.upload.files.filter(f => f.status === 'uploaded' || f.status === 'success');

        if (filesToSave.length === 0) return;

        let hasError = false;

        for (const file of filesToSave) {
            try {
                dispatch(updateFileStatus({ localId: file.localId, updates: { status: 'saving' } }));

                await documentService.saveDocumentMetadata({
                    assetId: file.storageId || '',
                    title: file.title || '',
                    university: file.university || '',
                    course: file.course || '',
                    description: file.description || '',
                    resourceType: 'DOCUMENT',
                    visibility: file.visibility,
                    downloadable: true,
                    documentType: file.type,
                });

                dispatch(updateFileStatus({ localId: file.localId, updates: { status: 'success' } }));
            } catch (error) {
                console.error(error);
                hasError = true;
                dispatch(updateFileStatus({
                    localId: file.localId,
                    updates: { status: 'error', errorMessage: "Save info failed" }
                }));
            }
        }

        if (hasError) {
            return rejectWithValue("Some files failed to save");
        }
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
        },
        setUploadFiles: (state, action: PayloadAction<FileUploadItem[]>) => {
            state.upload.files = [...state.upload.files, ...action.payload];
        },
        removeUploadFile: (state, action: PayloadAction<string>) => {
            state.upload.files = state.upload.files.filter(f => f.localId !== action.payload);
        },
        updateFileStatus: (state, action: PayloadAction<{ localId: string, updates: Partial<FileUploadItem> }>) => {
            const { localId, updates } = action.payload;
            const index = state.upload.files.findIndex(f => f.localId === localId);
            if (index !== -1) {
                state.upload.files[index] = { ...state.upload.files[index], ...updates };
            }
        },
        updateFileProgress: (state, action: PayloadAction<{ localId: string, progress: number }>) => {
            const { localId, progress } = action.payload;
            const file = state.upload.files.find(f => f.localId === localId);
            if (file) file.progress = progress;
        },
        updateFileMetadataInput: (state, action: PayloadAction<FileUploadItem[]>) => {
            state.upload.files = action.payload;
        },
        setActiveStep: (state, action: PayloadAction<number>) => {
            state.upload.activeStep = action.payload;
        },
        resetUploadState: (state) => {
            state.upload = initialState.upload;
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

        builder.addCase(saveFilesMetadata.pending, (state) => {
            state.upload.uploadStatus = 'saving';
        });

        builder.addCase(saveFilesMetadata.fulfilled, (state) => {
            state.upload.uploadStatus = 'success';
            state.upload.activeStep = 3;
        });

        builder.addCase(saveFilesMetadata.rejected, (state) => {
            state.upload.uploadStatus = 'error';
        });
    },
});

export const {
    clearCurrentDocument,
    setUploadFiles,
    removeUploadFile,
    updateFileStatus,
    updateFileProgress,
    updateFileMetadataInput,
    setActiveStep,
    resetUploadState
} = documentSlice.actions;
export default documentSlice.reducer;