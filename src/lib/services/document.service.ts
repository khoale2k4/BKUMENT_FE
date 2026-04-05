import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import httpClient from './http';

export interface DocumentDetail {
    id: string;
    title: string;
    author: Author;
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
    views: number;
}

interface Author {
    id: string,
    name: string,
    avatarUrl: string
}

interface FileUploadMetadata {
    assetId: string;
    id: string | undefined;
    title: string;
    university: string;
    universityId?: string;
    course: string;
    courseId?: string;
    topicId?: string;
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

/**
 * Search universities by query
 */
export const searchUniversities = async (query: string, page: number, size: number): Promise<{ id: number; name: string; abbreviation: string; logoUrl: string | null }[]> => {
    const response = await httpClient.get(API_ENDPOINTS.DOCUMENTS.SEARCH_UNIVERSITIES(query, page, size));
    return response.data.result;
};

/**
 * Search courses by query
 */
export const searchCourses = async (query: string): Promise<{ id: string; name: string; topics: { id: string; name: string }[] }[]> => {
    const response = await httpClient.get(API_ENDPOINTS.DOCUMENTS.COURSES(query));
    return response.data.result.data;
};

/**
 * Lấy danh sách tài liệu của người dùng hiện tại
 */
export const getMyDocuments = async (page: number, size: number): Promise<any> => {
    const response = await httpClient.get(API_ENDPOINTS.DOCUMENTS.MY_DOCUMENTS(page, size));
    return response.data.result;
};

/**
 * Lấy danh sách tài liệu của người dùng theo id
 */
export const getUserDocuments = async (userId: string, page: number, size: number): Promise<any> => {
    const response = await httpClient.get(API_ENDPOINTS.DOCUMENTS.USER_DOCUMENTS(userId, page, size));
    return response.data.result;
};

/**
 * Lấy danh sách tài liệu nổi bật
 */
export const getTopDocuments = async (page: number, size: number): Promise<any> => {
    const response = await httpClient.get(API_ENDPOINTS.DOCUMENTS.TOP_DOCUMENTS(page, size));
    return response.data.result;
};

/**
 * Xóa tài liệu theo ID
 */
export const deleteDocument = async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.DOCUMENTS.DELETE(id));
};

/**
 * Láy điểm đánh giá trung bình
 */
export const getAverageRating = async (resourceId: string): Promise<number> => {
    try {
        const response = await httpClient.get(API_ENDPOINTS.REPORT.GET_AVERAGE_RATING(resourceId));
        const result = response.data.result;
        return typeof result === 'object' ? (result.averageScore || result.score || 0) : (result || 0);
    } catch (error) {
        console.error("Lỗi khi lấy đánh giá trung bình:", error);
        return 0;
    }
};

/**
 * Lấy đánh giá của bản thân
 */
export const getMyRating = async (resourceId: string): Promise<number> => {
    try {
        const response = await httpClient.get(API_ENDPOINTS.REPORT.GET_MY_RATING(resourceId));
        const result = response.data.result;
        return typeof result === 'object' ? (result.score || 0) : (result || 0);
    } catch (error) {
        console.error("Lỗi khi lấy đánh giá bản thân:", error);
        return 0;
    }
};

/**
 * Gửi đánh giá mới
 */
export const submitRating = async (resourceId: string, score: number): Promise<void> => {
    await httpClient.post(API_ENDPOINTS.REPORT.SUBMIT_RATING, { resourceId, score });
};
