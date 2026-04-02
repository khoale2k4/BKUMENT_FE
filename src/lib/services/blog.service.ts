import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import httpClient from './http';
import axios from 'axios';

interface BlogPost {
    title: string;
    coverImage: string | null;
    content: string;
    visibility: 'PUBLIC' | 'PRIVATE';
    type: string;
    assetIds: string[];
}

interface BlogDetail {
    id: string;
    content: string;
    coverImage: string;
    name: string;
    authorId: string;
    createdAt: string;
    views: number;
}

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
 * Upload image và trả về URL
 */
export const uploadImage = async (file: File): Promise<string> => {
    // Get presigned URL
    const { url, assetId } = await getPresignedUrl(file.name);

    await axios.put(url, file, {
        headers: { 'Content-Type': file.type },
    });

    return API_ENDPOINTS.RESOURCE.LINK_IMAGE_FILEID(assetId);
};

/**
 * Submit blog post mới
 */
export const submitPost = async (post: BlogPost): Promise<any> => {
    const response = await httpClient.post(API_ENDPOINTS.BLOGS.UPLOAD_NEW_BLOG, JSON.stringify(post));

    // if (!response.ok) {
    //     throw new Error('Upload failed');
    // }

    // const data = await response.json();
    return response.data.result;
};

export const fetchPostById = async (blogId: string) => {
    const response = await httpClient.get(API_ENDPOINTS.BLOGS.GET_DETAIL(blogId));
    return response.data.result.content[0];
};

/**
 * Lấy danh sách blog của người dùng hiện tại
 */
export const getMyBlogs = async (page: number, size: number): Promise<any> => {
    const response = await httpClient.get(API_ENDPOINTS.BLOGS.MY_BLOGS(page, size));
    return response.data.result;
};

/**
 * Xóa blog theo ID
 */
export const deleteBlog = async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.BLOGS.DELETE(id));
};
