import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as chatService from '@/lib/services/chat.service'; 

// 1. CẬP NHẬT INTERFACES KHỚP VỚI ENTITY JAVA

export interface ParticipantInfo {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
}

export interface Conversation {
    id: string;
    type: 'GROUP' | 'DIRECT'; // Theo Java
    name: string | null;      // Direct chat có thể null
    participantsHash: string;
    participants: ParticipantInfo[];
    createdDate: string;      
    lastMessage: string;
    lastMessageTime: string;
    modifiedDate: string;
    // unreadCount: number;   // Nếu backend chưa có, bạn có thể comment lại hoặc xử lý sau
}

export interface ChatMessage {
    id: string;
    conversationId: string;
    type: 'TEXT' | 'IMAGE' | 'FILE'; // Backend trả về chữ in hoa
    message: string;                 // Thay vì 'content'
    sender: ParticipantInfo;         // Thay vì ChatUser
    createdDate: string;             // Thay vì 'timestamp'
    
    // Field này không có ở Backend, Frontend tự thêm vào để UI biết tin nhắn của ai
    isSelf?: boolean; 
}

// 2. CẬP NHẬT CHAT STATE

interface ChatState {
    conversations: Conversation[];
    conversationsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    conversationsPage: number;
    conversationsTotalPages: number;

    activeConversationId: string | null;
    currentMessages: ChatMessage[]; // Đổi từ Message sang ChatMessage
    messagesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ChatState = {
    conversations: [],
    conversationsStatus: 'idle',
    conversationsPage: 0,
    conversationsTotalPages: 0,

    activeConversationId: null,
    currentMessages: [],
    messagesStatus: 'idle',
};

// 3. ASYNC THUNKS (Giữ nguyên logic, chỉ cập nhật type)

export const fetchConversations = createAsyncThunk(
    'chat/fetchConversations',
    async ({ page, size }: { page: number; size: number }) => {
        const response = await chatService.getConversations(page, size);
        return {
            items: response.content as Conversation[],
            page: page,
            totalPages: response.totalPages
        };
    }
);

export const fetchMessagesByConversationId = createAsyncThunk(
    'chat/fetchMessages',
    async (conversationId: string) => {
        const response = await chatService.getMessages(conversationId);
        return {
            conversationId,
            messages: response as ChatMessage[] // Đổi type
        };
    }
);

// 4. SLICE

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setActiveConversation: (state, action: PayloadAction<string>) => {
            state.activeConversationId = action.payload;
            state.currentMessages = []; 
            state.messagesStatus = 'idle';
        },
        clearChatState: () => {
            return initialState;
        },
        addMessage: (state, action: PayloadAction<ChatMessage>) => {
            // Cập nhật tin nhắn vào khung chat hiện tại
            if (state.activeConversationId === action.payload.conversationId) {
                state.currentMessages.push(action.payload);
            }
            // Cập nhật lastMessage ở sidebar
            const index = state.conversations.findIndex(c => c.id === action.payload.conversationId);
            if (index !== -1) {
                // Đổi thành .message và .createdDate cho khớp với ChatMessage
                state.conversations[index].lastMessage = action.payload.message; 
                state.conversations[index].lastMessageTime = action.payload.createdDate; 
                
                // Đẩy conversation có tin nhắn mới lên đầu
                const [chat] = state.conversations.splice(index, 1);
                state.conversations.unshift(chat);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConversations.pending, (state, action) => {
                if (action.meta.arg.page === 0) {
                    state.conversationsStatus = 'loading';
                }
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.conversationsStatus = 'succeeded';
                if (action.payload.page === 0) {
                    state.conversations = action.payload.items;
                } else {
                    state.conversations = [...state.conversations, ...action.payload.items];
                }
                state.conversationsPage = action.payload.page;
                state.conversationsTotalPages = action.payload.totalPages;
            })
            .addCase(fetchConversations.rejected, (state) => {
                state.conversationsStatus = 'failed';
            });

        builder
            .addCase(fetchMessagesByConversationId.pending, (state) => {
                state.messagesStatus = 'loading';
            })
            .addCase(fetchMessagesByConversationId.fulfilled, (state, action) => {
                state.messagesStatus = 'succeeded';
                if (state.activeConversationId === action.payload.conversationId) {
                    state.currentMessages = action.payload.messages;
                }
            })
            .addCase(fetchMessagesByConversationId.rejected, (state) => {
                state.messagesStatus = 'failed';
            });
    },
});

export const {
    setActiveConversation,
    clearChatState,
    addMessage
} = chatSlice.actions;

export default chatSlice.reducer;