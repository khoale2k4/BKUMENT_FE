import { API_ENDPOINTS } from '@/lib/apiEndPoints';

export interface Comment {
    id: string | number;
    user: string;
    avatar: string;
    content: string;
    time: string;
    likes: number;
}

/**
 * Lấy danh sách comments theo document ID
 */
export const getCommentsByDocId = async (documentId: string): Promise<Comment[]> => {
    const response = await fetch(API_ENDPOINTS.COMMENTS.GET_BY_DOC(documentId));
    const data = await response.json();

    return data.map((c: any) => ({
        id: c.id,
        user: c.user || c.author,
        avatar: c.avatar || 'https://placehold.co/100x100/gray/white?text=U',
        content: c.content,
        time: c.createdAt || 'Just now',
        likes: c.likes || 0,
    }));
};
