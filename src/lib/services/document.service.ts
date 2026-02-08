import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import httpClient from './http';

export interface DocumentDetail {
    id: string;
    title: string;
    description: string;
    downloadUrl: string;
    downloadCount: number;
    previewImageUrl: string;
    documentType?: string;
    downloadable: boolean;
    university?: string;
    course?: string;
    createdAt: Date;
}

interface FileUploadMetadata {
    assetId: string;
    id: string | undefined;
    title: string;
    university: string;
    course: string;
    description: string;
    resourceType: string;
    visibility: string;
    downloadable: boolean;
    documentType: string;
}

interface AnalyseDocumentBody {
    assetId: string;
    fileName: string | undefined;
}

interface AnalyseDocumentResponse {
    keywords: string[],
    docId: string;
    summary: string | undefined;
}

/**
 * Lấy chi tiết document theo ID
 */
export const getDocumentById = async (id: string): Promise<DocumentDetail> => {
    const response = await httpClient.get(API_ENDPOINTS.DOCUMENTS.GET_DETAIL(id));

    return response.data.result.content[0];
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
 * Lưu metadata của document
 */
export const saveDocumentMetadata = async (metadata: FileUploadMetadata): Promise<void> => {
    console.log(metadata);
    await httpClient.post(API_ENDPOINTS.DOCUMENTS.UPDATE_METADATA, metadata);
};

export const analyseDocument = async (body: AnalyseDocumentBody): Promise<AnalyseDocumentResponse> => {
    const res = await httpClient.get(API_ENDPOINTS.DOCUMENTS.ANALYSE_DOCUMENT(body.assetId, body.fileName), {
        timeout: 600000
    });

    return res.data.result;
};

export const getRelatedDocuments = async (id: string, page: number, size: number): Promise<any> => {
    const response = await httpClient.get(API_ENDPOINTS.DOCUMENTS.RELATED_DOCUMENTS(id, page, size));
    return response.data.result;
};
