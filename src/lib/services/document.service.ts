import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import httpClient from './http';

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

interface FileUploadMetadata {
    assetId: string;
    title: string;
    university: string;
    course: string;
    description: string;
    resourceType: string;
    visibility: string;
    downloadable: boolean;
    documentType: string;
}

/**
 * Lấy chi tiết document theo ID
 */
export const getDocumentById = async (id: string): Promise<DocumentDetail> => {
    const response = await fetch(API_ENDPOINTS.DOCUMENTS.GET_DETAIL(id));
    const data = (await response.json()).result.content[0];

    return {
        id,
        title: data.title || 'Untitled Document',
        description: data.description || 'No description available.',
        downloadUrl: data.downloadUrl || '',
        createdAt: data.createdAt,
        documentType: data.documentType,
        downloadable: data.downloadable,
        downloadCount: data.downloadCount,
        course: data.course,
        university: data.university,
    };
};

/**
 * Lấy presigned URL để upload file
 */
export const getPresignedUrl = async (fileName: string): Promise<{ url: string; assetId: string }> => {
    const response = await httpClient.get(API_ENDPOINTS.RESOURCE.GET_PRESIGNED_URL(fileName));
    return {
        url: response.data.result.url,
        assetId: response.data.result.assetId,
    };
};

/**
 * Upload file lên storage với presigned URL
 */
export const uploadToStorage = async (
    url: string,
    file: File,
    onProgress?: (progress: number) => void
): Promise<void> => {
    await httpClient.put(url, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percent);
            }
        },
    });
};

/**
 * Lưu metadata của document
 */
export const saveDocumentMetadata = async (metadata: FileUploadMetadata): Promise<void> => {
    await httpClient.post(API_ENDPOINTS.DOCUMENTS.UPDATE_METADATA, metadata);
};
