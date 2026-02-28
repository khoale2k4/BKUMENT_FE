import { FileUploadItem } from '@/types/FileUpload';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as documentService from '@/lib/services/document.service';
import * as userService from '@/lib/services/user.service';
import * as commentService from '@/lib/services/comment.service';
import { showToast } from './toastSlice';
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
    viewUrl: string;
    previewImageUrl: string;
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
export interface University {
    id: number;
    name: string;
    abbreviation: string;
    logoUrl: string | null;
}

export interface Course {
    id: string;
    name: string;
    topics: Topic[];
}

export interface Topic {
    id: string;
    name: string;
}

interface UploadState {
    files: FileUploadItem[];
    activeStep: number;
    uploadStatus: 'idle' | 'analyzing' | 'uploading' | 'saving' | 'success' | 'error';
}

interface DocumentState {
    currentDocument: DocumentDetail | null;
    detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';

    relatedDocuments: DocumentDetail[];
    relatedStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    relatedPage: number;
    relatedTotalPages: number;

    currentAuthor: UserInfo | null;
    authorStatus: 'idle' | 'loading' | 'succeeded' | 'failed';

    comments: Comment[];
    commentsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';

    universities: University[];
    universitiesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';

    courses: Course[];
    coursesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';

    topics: Topic[];
    topicsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';

    upload: UploadState;
}

const initialState: DocumentState = {
    currentDocument: null,
    detailStatus: 'idle',

    relatedDocuments: [],
    relatedStatus: 'idle',
    relatedPage: 0,
    relatedTotalPages: 0,

    currentAuthor: null,
    authorStatus: 'idle',

    comments: [],
    commentsStatus: 'idle',

    universities: [],
    universitiesStatus: 'idle',

    courses: [],
    coursesStatus: 'idle',

    topics: [],
    topicsStatus: 'idle',

    upload: {
        files: [],
        activeStep: 1,
        uploadStatus: 'idle',
    }
};

export const fetchDocumentById = createAsyncThunk(
    'documents/fetchDetail',
    async (id: string) => {
        const response = await documentService.getDocumentById(id);
        console.log(response);
        return response;
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

export const fetchRelatedDocuments = createAsyncThunk(
    'documents/fetchRelated',
    async ({ docId, page, size }: { docId: string, page: number; size: number }) => {
        const response = await documentService.getRelatedDocuments(docId, page, size);
        return {
            items: response.content.map((dta: any) => ({
                id: dta.id,
                title: dta.name || dta.title,
                description: dta.description,
                downloadUrl: dta.downloadUrl,
                previewImageUrl: dta.previewImageUrl,
                downloadCount: 0,
                documentType: dta.documentType,
                downloadable: dta.downloadable,
                university: dta.university,
                course: dta.course,
                createdAt: dta.createdAt
            })),
            page: page,
            totalPages: response.totalPages
        };
    }
);

export const searchUniversities = createAsyncThunk(
    'documents/searchUniversities',
    async (query: string) => {
        return await documentService.searchUniversities(query);
    }
);

export const searchCourses = createAsyncThunk(
    'documents/searchCourses',
    async (query: string) => {
        return await documentService.searchCourses(query);
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

            dispatch(updateFileStatus({ localId, updates: { status: 'analyzing', progress: 100 } }));

            const { docId, keywords, summary } = await documentService.analyseDocument({
                assetId: fileId,
                fileName: file.name
            });

            // console.log(docAnalyseResult);

            dispatch(updateFileStatus({
                localId,
                updates: {
                    status: 'success',
                    progress: 100,
                    docId,
                    keywords,
                    summary,
                    // Auto-fill description if summary is available
                    description: summary
                }
            }));
            return localId;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Upload failed';
            dispatch(updateFileStatus({ localId, updates: { status: 'error', errorMessage } }));
            dispatch(showToast({
                type: 'error',
                title: 'Upload Failed',
                message: errorMessage
            }));
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
                    id: file.docId,
                    title: file.title || '',
                    university: file.university || '',
                    universityId: file.universityId,
                    course: file.course || '',
                    courseId: file.courseId,
                    topicId: file.topicId,
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
            state.relatedDocuments = [];
            state.relatedStatus = 'idle';
            state.relatedPage = 0;
            state.relatedTotalPages = 0;
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

        builder
            .addCase(fetchRelatedDocuments.pending, (state, action) => {
                if (action.meta.arg.page === 0) {
                    state.relatedStatus = 'loading';
                }
            })
            .addCase(fetchRelatedDocuments.fulfilled, (state, action) => {
                state.relatedStatus = 'succeeded';
                if (action.payload.page === 0) {
                    state.relatedDocuments = action.payload.items;
                } else {
                    state.relatedDocuments = [...state.relatedDocuments, ...action.payload.items];
                }
                state.relatedPage = action.payload.page;
                state.relatedTotalPages = action.payload.totalPages;
            })
            .addCase(fetchRelatedDocuments.rejected, (state) => {
                state.relatedStatus = 'failed';
            });

        builder
            .addCase(searchUniversities.pending, (state) => {
                state.universitiesStatus = 'loading';
            })
            .addCase(searchUniversities.fulfilled, (state, action: PayloadAction<University[]>) => {
                state.universitiesStatus = 'succeeded';
                state.universities = action.payload;
            })
            .addCase(searchUniversities.rejected, (state) => {
                state.universitiesStatus = 'failed';
            });

        builder
            .addCase(searchCourses.pending, (state) => {
                state.coursesStatus = 'loading';
            })
            .addCase(searchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
                state.coursesStatus = 'succeeded';
                state.courses = action.payload;
            })
            .addCase(searchCourses.rejected, (state) => {
                state.coursesStatus = 'failed';
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