import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as chatService from '@/lib/services/chat.service';
import { Conversation, updateConversationAvatar } from '@/lib/services/chat.service';
import { getPresignedUrl } from '@/lib/services/document.service';
import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import axios from 'axios';
import { RootState } from '../store';

export interface ParticipantInfo {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
}

export interface ChatMessage {
    id: string;
    conversationId: string;
    type: 'TEXT' | 'IMAGE' | 'FILE';
    message: string;
    sender: ParticipantInfo;
    createdDate: string;
    isSelf?: boolean;
}

interface ChatState {
    conversations: Conversation[];
    conversationsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    conversationsPage: number;
    conversationsTotalPages: number;

    activeConversationId: string | null;
    currentMessages: ChatMessage[];
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

export const fetchConversations = createAsyncThunk(
    'chat/fetchConversations',
    async ({ page, size }: { page: number; size: number }) => {
        const response = await chatService.getConversations(page, size);
        console.log(response)
        return {
            items: response as unknown as Conversation[],
            page: 0,
            totalPages: 1
        };
    }
);

export const fetchMessagesByConversationId = createAsyncThunk(
    'chat/fetchMessages',
    async (conversationId: string) => {
        const response = await chatService.getMessages(conversationId);
        
        const sortedMessages = [...response].sort((a, b) => {
            const timeA = new Date(a.createdDate).getTime();
            const timeB = new Date(b.createdDate).getTime();
            return timeA - timeB;
        });

        return {
            conversationId,
            messages: sortedMessages
        };
    }
);

export const sendMessageAsync = createAsyncThunk(
    'chat/sendMessage',
    async ({ conversationId, message, type }: { conversationId: string; message: string; type: 'TEXT' | 'IMAGE' | 'FILE' }, { rejectWithValue }) => {
        try {
            const typeLower = type.toLowerCase() as 'text' | 'image' | 'file';
            const response = await chatService.sendMessage(conversationId, message, typeLower);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send message');
        }
    }
);

export const createChatAsync = createAsyncThunk(
    'chat/createChat',
    async ({ type = 'DIRECT', userIds }: { type?: 'GROUP' | 'DIRECT'; userIds: string[] }, { rejectWithValue }) => {
        try {
            const response = await chatService.createChat(type, userIds);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create chat');
        }
    }
);

export const uploadConversationAvatarAsync = createAsyncThunk(
    'chat/uploadAvatar',
    async ({ conversationId, file }: { conversationId: string; file: File }, { dispatch, rejectWithValue }) => {
        try {
            const { url, assetId } = await getPresignedUrl(file.name);

            await axios.put(url, file, {
                headers: { 'Content-Type': file.type },
            });

            await updateConversationAvatar(conversationId, API_ENDPOINTS.RESOURCE.LINK_IMAGE_FILEID(assetId));

            await dispatch(fetchConversations({ page: 0, size: 20 })).unwrap();

            return assetId;
        } catch (error: any) {
            console.error("Lỗi upload avatar:", error);
            return rejectWithValue(error.message || 'Lỗi khi cập nhật ảnh đại diện');
        }
    }
);

export const sendImageMessageAsync = createAsyncThunk(
    'chat/sendImageMessage',
    async ({ conversationId, file }: { conversationId: string; file: File }, { dispatch, rejectWithValue }) => {
        try {
            const { url, assetId } = await getPresignedUrl(file.name);

            await axios.put(url, file, {
                headers: { 'Content-Type': file.type },
            });

            const imageUrl = API_ENDPOINTS.RESOURCE.LINK_IMAGE_FILEID(assetId);

            const result = await dispatch(sendMessageAsync({
                conversationId,
                message: imageUrl,
                type: 'IMAGE'
            })).unwrap();

            return result;
        } catch (error: any) {
            console.error("Lỗi gửi tin nhắn ảnh:", error);
            return rejectWithValue(error.message || 'Lỗi khi gửi ảnh');
        }
    }
);

export const receiveSocketMessageThunk = createAsyncThunk(
    'chat/receiveSocketMessage',
    async (incomingMessage: ChatMessage, { dispatch, getState }) => {
        const state = getState() as RootState;
        
        const isConversationExist = state.chat.conversations.some(
            (c) => c.id === incomingMessage.conversationId
        );

        dispatch(chatSlice.actions.addMessage(incomingMessage));

        if (!isConversationExist) {
            dispatch(fetchConversations({ page: 0, size: 20 }));
        }
    }
);

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
            const newMessage = action.payload;

            if (state.activeConversationId === newMessage.conversationId) {
                const isDuplicate = state.currentMessages.some(m => m.id === newMessage.id);
                if (!isDuplicate) {
                    state.currentMessages.push(newMessage);
                }
            }

            const index = state.conversations.findIndex(c => c.id === newMessage.conversationId);
            if (index !== -1) {
                state.conversations[index].lastMessage = newMessage.message;
                state.conversations[index].lastMessageTime = newMessage.createdDate;

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

        builder
            .addCase(sendMessageAsync.fulfilled, (state, action) => {
                chatSlice.caseReducers.addMessage(state, { payload: action.payload, type: 'chat/addMessage' });
            });

        builder
            .addCase(createChatAsync.fulfilled, (state, action) => {
                state.activeConversationId = action.payload.conversationId;
                state.currentMessages = [];
                state.messagesStatus = 'idle';
            });
    },
});

export const {
    setActiveConversation,
    clearChatState,
    addMessage
} = chatSlice.actions;

export default chatSlice.reducer;