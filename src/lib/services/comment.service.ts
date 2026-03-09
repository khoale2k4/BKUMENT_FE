import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import httpClient from './http';

export interface Comment {
    id: string | number;
    user: string;
    avatar: string;
    content: string;
    numberOfChildComment: number;
    time: string;
    
    replies?: Comment[];
    repliesPage?: number;
    repliesTotalPages?: number;
    isLoadingReplies?: boolean;
}

export interface CreateCommentPayload {
    resourceId: string;      
    content: string;         
    replyId?: string | null; 
}

/**
 * Lấy danh sách comments theo document ID
 */
export const getCommentsByDocId = async (
    documentId: string, 
    page: number, 
    size: number
): Promise<{ content: Comment[], totalPages: number }> => { 
    const response: any = await httpClient.get(API_ENDPOINTS.COMMENTS.GET_BY_DOC(documentId, page, size));
    
    const responseData = response.data || response; 
    const result = responseData.result;

    const mappedComments: Comment[] = result.content.map((item: any) => ({
        id: item.id,
        user: item.author?.name || 'Unknown User',
        avatar: item.author?.avatarUrl || 'https://ui-avatars.com/api/?name=User&background=random',
        content: item.content,
        numberOfChildComment: item.numberOfChildComment,
        time: item.createdAt,
    }));

    return {
        content: mappedComments,
        totalPages: result.totalPages
    };
};

export const createComment = async (
    payload: CreateCommentPayload
): Promise<Comment> => { 
    const response: any = await httpClient.post(API_ENDPOINTS.COMMENTS.CREATE, payload);
    
    const responseData = response.data || response; 
    const result = responseData.result;

    const newComment: Comment = {
        id: result.id,
        user: result.author?.name || 'Unknown User',
        avatar: result.author?.avatarUrl || 'https://ui-avatars.com/api/?name=User&background=random',
        content: result.content,
        time: result.createdAt,
        numberOfChildComment: 0,
    };

    return newComment;
};

export const getCommentsByReplyId = async (
    parentId: string, 
    page: number, 
    size: number
): Promise<{ content: Comment[], totalPages: number }> => { 
    const response: any = await httpClient.get(API_ENDPOINTS.COMMENTS.GET_BY_PARENT_COMMENT(parentId, page, size));
    
    const responseData = response.data || response; 
    const result = responseData.result;

    const mappedComments: Comment[] = result.content.map((item: any) => ({
        id: item.id,
        user: item.author?.name || 'Unknown User',
        avatar: item.author?.avatarUrl || 'https://ui-avatars.com/api/?name=User&background=random',
        content: item.content,
        numberOfChildComment: item.numberOfChildComment,
        time: item.createdAt,
    }));

    return {
        content: mappedComments,
        totalPages: result.totalPages
    };
};