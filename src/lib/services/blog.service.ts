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
    const response = await httpClient.post(API_ENDPOINTS.BLOGS.UPLOAD_NEW_BLOG, JSON.stringify(post), {
        headers: { 'Content-Type': 'application/json' },
    });

    // if (!response.ok) {
    //     throw new Error('Upload failed');
    // }

    // const data = await response.json();
    // return data.result;
};

/**
 * Fetch blog post theo ID
 */
export const fetchPostById = async (blogId: string): Promise<BlogDetail> => {
    const response = await httpClient.get(API_ENDPOINTS.BLOGS.GET_DETAIL(blogId));

    // if (!response.ok) {
    //     throw new Error('Fetch failed');
    // }

    // const data = await response.json();
    // return data.result.content[0];
};
