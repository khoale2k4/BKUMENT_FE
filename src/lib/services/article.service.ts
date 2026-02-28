import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import httpClient from './http';

interface SearchResponse {
    content: any[];
    totalPages: number;
}

/**
 * Search documents với pagination
 */
export const searchDocuments = async (page: number, size: number): Promise<SearchResponse> => {
    const response = await httpClient.get(API_ENDPOINTS.DOCUMENTS.RECOMMENDED_DOCUMENTS(page, size));

    return {
        content: response.data.result.content,
        totalPages: response.data.result.totalPages || 10,
    };
};

/**
 * Search blogs với pagination
 */
export const searchBlogs = async (page: number, size: number): Promise<SearchResponse> => {
    const response = await httpClient.get(API_ENDPOINTS.BLOGS.SEARCH(page, size));

    return {
        content: response.data.result.content,
        totalPages: response.data.result.totalPages || 10,
    };
};

/**
 * Search content by keyword với pagination
 */
export const searchContent = async (query: string, page: number, size: number): Promise<SearchResponse> => {
    const response = await httpClient.get(API_ENDPOINTS.HOME.SEARCH(query, page, size));

    return {
        content: response.data.results || [],
        totalPages: Math.ceil((response.data.results?.length || 0) / size) || 1,
    };
};
