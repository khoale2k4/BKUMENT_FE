export type UploadStatus = 'idle' | 'getting_url' | 'analyzing' | 'uploading' | 'uploaded' | 'saving' | 'success' | 'error';
export type VisibilityStatus = 'PUBLIC' | 'PRIVATE' | 'OTHER';

export interface FileUploadItem {
    localId: string;
    docId: string | undefined;
    file?: File;
    name: string;
    size: number;
    type: string;
    progress: number;
    presignedUrl?: string;
    storageId?: string;
    topic?: string;
    subject?: string;
    title?: string;
    university?: string;
    universityId?: string;
    courseId?: string;
    topicId?: string;
    description?: string;
    keywords?: string[];
    summary?: string;
    course?: string;
    status: UploadStatus;
    errorMessage?: string;
    visibility: VisibilityStatus;
}