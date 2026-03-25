import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import httpClient from './http';

interface SearchResponse {
    content: any[];
    totalPages: number;
}

export interface PersonMayKnow {
    id: string;
    accountId: string;
    fullName: string;
    firstName: string;
    lastName: string;
    university: string;
    universityId: number;
    dob: string;
    bio: string;
    avatarUrl: string;
    email: string;
    points: number;
    followerCount: number;
    followingCount: number;
}

interface PeopleMayKnowResponse {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
    data: PersonMayKnow[];
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
export const searchContent = async (query: string, page: number, size: number) => {
    const response = await httpClient.get(API_ENDPOINTS.HOME.SEARCH(query, page, size));

    return response.data.result;
};

/**
 * Lấy danh sách người dùng có thể biết với pagination
 */
export const getPeopleMayKnow = async (page: number, size: number): Promise<PeopleMayKnowResponse> => {
    const response = await httpClient.get(API_ENDPOINTS.ACCOUNT.PEOPLE_MAY_KNOW(page, size));
    return response.data.result;
};

/**
 * Theo dõi một người dùng
 */
export const followUser = async (profileId: string): Promise<string> => {
    const response = await httpClient.post(API_ENDPOINTS.ACCOUNT.FOLLOW(profileId));
    return response.data.result;
};
