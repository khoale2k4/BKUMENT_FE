import { API_ENDPOINTS } from '@/lib/apiEndPoints';

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
 * Upload image và trả về URL
 */
export const uploadImage = async (file: File): Promise<string> => {
    // Get presigned URL
    const presignedRes = await fetch(
        API_ENDPOINTS.RESOURCE.GET_PRESIGNED_URL(encodeURIComponent(file.name))
    );
    const presignedData = await presignedRes.json();

    if (presignedData.code !== 1000) {
        throw new Error(presignedData.message);
    }

    const { url: uploadUrl, assetId } = presignedData.result;

    // Upload to storage
    const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
    });

    if (!uploadRes.ok) {
        throw new Error('Upload failed');
    }

    // Return image URL
    return API_ENDPOINTS.RESOURCE.LINK_IMAGE_FILEID(assetId);
};

/**
 * Submit blog post mới
 */
export const submitPost = async (post: BlogPost): Promise<any> => {
    const response = await fetch(API_ENDPOINTS.BLOGS.UPLOAD_NEW_BLOG, {
        method: 'POST',
        body: JSON.stringify(post),
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.result;
};

/**
 * Fetch blog post theo ID
 */
export const fetchPostById = async (blogId: string): Promise<BlogDetail> => {
    const response = await fetch(API_ENDPOINTS.BLOGS.GET_DETAIL(blogId), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error('Fetch failed');
    }

    const data = await response.json();
    return data.result.content[0];
};
