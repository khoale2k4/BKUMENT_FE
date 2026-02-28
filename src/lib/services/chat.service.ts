import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import httpClient from './http';

// --- INTERFACES ---

export interface ParticipantInfo {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
}

export interface Conversation {
    id: string;
    type: 'GROUP' | 'DIRECT';
    name: string | null;
    participantsHash: string;
    participants: ParticipantInfo[];
    createdDate: string;      // Thay cho Instant
    lastMessage: string;
    lastMessageTime: string;  // Thay cho Instant
    modifiedDate: string;     // Thay cho Instant
}

export interface ChatMessage {
    id: string;
    conversationId: string;
    type: 'TEXT' | 'IMAGE' | 'FILE';
    message: string;
    sender: ParticipantInfo;
    createdDate: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

// --- SERVICES ---

/**
 * Lấy danh sách các cuộc trò chuyện (có phân trang)
 */
export const getConversations = async (page: number, size: number): Promise<PaginatedResponse<Conversation>> => {
    // Truyền params page và size vào endpoint
    const response = await httpClient.get(API_ENDPOINTS.CHAT.GET_CONVERSATIONS(page, size));
    
    // Giả định backend trả về data nằm trong trường result
    return response.data;
};

/**
 * Lấy chi tiết các tin nhắn trong một cuộc trò chuyện
 */
export const getMessages = async (conversationId: string): Promise<ChatMessage[]> => {
    const response = await httpClient.get(API_ENDPOINTS.CHAT.GET_MESSAGES(conversationId));
    
    // Trả về trực tiếp mảng tin nhắn
    return response.data;
};

/**
 * (Tuỳ chọn) Hàm gửi tin nhắn mới
 */
export const sendMessage = async (conversationId: string, content: string, type: 'text' | 'image' | 'file' = 'text'): Promise<ChatMessage> => {
    const response = await httpClient.post(API_ENDPOINTS.CHAT.SEND_MESSAGE, {
        conversationId,
        content,
        type
    });

    return response.data.result;
};