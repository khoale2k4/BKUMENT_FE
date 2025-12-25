export type UploadStatus = 'idle' | 'getting_url' | 'uploading' | 'uploaded' | 'saving' | 'success' | 'error';
export type VisibilityStatus = 'PUBLIC' | 'PRIVATE' | 'OTHER';

export interface FileUploadItem {
    localId: string;
    file: File;
    name: string;
    size: number;
    type: string;
    progress: number;
    presignedUrl?: string;
    storageId?: string;
    title?: string;
    university?: string;
    description?: string;
    course?: string;
    status: UploadStatus;
    errorMessage?: string;
    visibility: VisibilityStatus;
}