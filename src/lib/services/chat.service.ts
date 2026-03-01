import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import httpClient from './http';
import { ChatMessage } from '../redux/features/chatSlice';

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
    conversationAvatar: string;
    participants: ParticipantInfo[];
    createdDate: string;      
    lastMessage: string;
    lastMessageTime: string;  
    modifiedDate: string;     
}

export interface PaginatedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}


export const getConversations = async (page: number, size: number): Promise<Conversation[]> => {
    const response = await httpClient.get(API_ENDPOINTS.CHAT.GET_CONVERSATIONS(page, size));
    
    return response.data.result;
};

export const getMessages = async (conversationId: string): Promise<ChatMessage[]> => {
    const response = await httpClient.get(API_ENDPOINTS.CHAT.GET_MESSAGES(conversationId));
    
    return response.data.result;
};

export const sendMessage = async (conversationId: string, message: string, type: 'text' | 'image' | 'file' = 'text'): Promise<ChatMessage> => {
    const response = await httpClient.post(API_ENDPOINTS.CHAT.SEND_MESSAGE, {
        conversationId,
        message,
        type
    });

    return response.data.result;
};

export const createChat = async (type: 'GROUP' | 'DIRECT' = 'DIRECT', userIds: string[],): Promise<ChatMessage> => {
    const response = await httpClient.post(API_ENDPOINTS.CHAT.START_CONVERSATIONS, {
        type,
        participantIds: userIds
    });

    return response.data.result;
};

export const updateConversationAvatar = async (conversationId: string, conversationAvatar: string): Promise<void> => {
    const response = await httpClient.put(API_ENDPOINTS.CHAT.UPDATE_CONVERSATION(conversationId), {
        conversationAvatar 
    });

    return response.data.result;
};