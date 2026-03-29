import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as chatService from '@/lib/services/chat.service';
import { Conversation, updateConversationAvatar } from '@/lib/services/chat.service';
import { getPresignedUrl } from '@/lib/services/document.service';
import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import axios from 'axios';
import { RootState } from '../store';
import { DateTime } from 'luxon';

export interface ParticipantInfo {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
}

export interface ChatMessage {
    id: string;
    tempId?: string;
    conversationId: string;
    type: 'TEXT' | 'IMAGE' | 'FILE';
    message: string;
    sender: ParticipantInfo;
    createdDate: string;
    isSelf?: boolean;
    status?: 'sending' | 'sent' | 'error';
}

interface ChatState {
    conversations: Conversation[];
    conversationsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    conversationsPage: number;
    conversationsTotalPages: number;

    activeConversationId: string | null;
    currentMessages: ChatMessage[];
    messagesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    
    messagesPage: number;
    hasMoreMessages: boolean;

    pendingTargetUserId: string | null;
}

const initialState: ChatState = {
    conversations: [],
    conversationsStatus: 'idle',
    conversationsPage: 0,
    conversationsTotalPages: 0,

    activeConversationId: null,
    currentMessages: [],
    messagesStatus: 'idle',

    messagesPage: 0,
    hasMoreMessages: true,

    pendingTargetUserId: null,
};

export const fetchConversations = createAsyncThunk(
    'chat/fetchConversations',
    async ({ page, size }: { page: number; size: number }) => {
        const response: any = await chatService.getConversations(page, size);
        console.log("Fetched conversations:", response);

        return {
            items: response.content as Conversation[],
            page: response.number,
            totalPages: response.totalPages
        };
    }
);

export const fetchMessagesByConversationId = createAsyncThunk(
    'chat/fetchMessages',
    async ({ conversationId, page, size }: { conversationId: string, page: number, size: number }) => {
        const response: any = await chatService.getMessages(conversationId, page, size);

        const dataArray = response.content || response; 

        const sortedMessages = [...dataArray].sort((a, b) => {
            const timeA = new Date(a.createdDate).getTime();
            const timeB = new Date(b.createdDate).getTime();
            return timeA - timeB; 
        });

        return {
            conversationId,
            messages: sortedMessages,
            page,
            size
        };
    }
);

export const sendMessageAsync = createAsyncThunk(
    'chat/sendMessage',
    async ({ conversationId, message, type, tempId }: { conversationId: string; message: string; type: 'TEXT' | 'IMAGE' | 'FILE', tempId: string }, { rejectWithValue }) => {
        try {
            const typeUpper = type.toUpperCase() as 'TEXT' | 'IMAGE' | 'FILE';
            const response = await chatService.sendMessage(conversationId, message, typeUpper, tempId);
            return { ...response, tempId };
        } catch (error: any) {
            return rejectWithValue({ error: error.response?.data?.message || 'Failed to send message', tempId });
        }
    }
);

export const createChatAsync = createAsyncThunk(
    'chat/createChat',
    async ({ type = 'DIRECT', userIds }: { type?: 'GROUP' | 'DIRECT'; userIds: string[] }, { rejectWithValue }) => {
        try {
            const response = await chatService.createChat(type, userIds);
            console.log("Created chat response:", response);
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
                type: 'IMAGE',
                tempId: DateTime.now().toString()
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
            state.messagesPage = 0;
            state.hasMoreMessages = true;
        },
        clearChatState: () => initialState,
        addMessage: (state, action: PayloadAction<ChatMessage>) => {
            const newMessage = { ...action.payload, status: 'sent' as const };

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
        },
        setPendingTargetUserId: (state, action: PayloadAction<string | null>) => {
            state.pendingTargetUserId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConversations.pending, (state, action) => {
                if (action.meta.arg.page === 0) {
                    state.conversationsStatus = 'loading';
                }
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {

                if (action.payload.page === 0) {
                    state.conversations = action.payload.items;
                } else {
                    state.conversations = [...state.conversations, ...action.payload.items];
                }

                state.conversationsStatus = 'succeeded';
            })
            .addCase(fetchConversations.rejected, (state) => {
                state.conversationsStatus = 'failed';
            });

        builder
            .addCase(fetchMessagesByConversationId.pending, (state, action) => {
                if (action.meta.arg.page === 0) {
                    state.messagesStatus = 'loading';
                }
            })
            .addCase(fetchMessagesByConversationId.fulfilled, (state, action) => {
                state.messagesStatus = 'succeeded';
                if (state.activeConversationId === action.payload.conversationId) {
                    if (action.payload.page === 0) {
                        state.currentMessages = action.payload.messages;
                    } else {
                        state.currentMessages = [...action.payload.messages, ...state.currentMessages];
                    }
                    state.messagesPage = action.payload.page;
                    state.hasMoreMessages = action.payload.messages.length === action.payload.size;
                }
            })
            .addCase(fetchMessagesByConversationId.rejected, (state) => {
                state.messagesStatus = 'failed';
            });
            
        builder
            .addCase(sendMessageAsync.pending, (state, action) => {
                const { conversationId, message, type, tempId } = action.meta.arg;
                
                const tempMessage: ChatMessage = {
                    id: tempId,
                    tempId: tempId,
                    conversationId,
                    type,
                    message,
                    sender: { userId: 'OPTIMISTIC_SELF', username: '', firstName: '', lastName: '', avatar: '' }, 
                    createdDate: new Date().toISOString(),
                    isSelf: true,
                    status: 'sending'
                };
                
                if (state.activeConversationId === conversationId) {
                    state.currentMessages.push(tempMessage);
                }
                
                const convIndex = state.conversations.findIndex(c => c.id === conversationId);
                if (convIndex !== -1) {
                    state.conversations[convIndex].lastMessage = message;
                    const [chat] = state.conversations.splice(convIndex, 1);
                    state.conversations.unshift(chat);
                }
            })
            .addCase(sendMessageAsync.fulfilled, (state, action) => {
                const realMessage = action.payload;
                const tempId = action.payload.tempId;

                if (state.activeConversationId === realMessage.conversationId) {
                    const tempIndex = state.currentMessages.findIndex(m => m.tempId === tempId || m.id === tempId);

                    const socketIndex = state.currentMessages.findIndex(m => m.id === realMessage.id);

                    if (socketIndex !== -1) {
                        if (tempIndex !== -1 && tempIndex !== socketIndex) {
                            state.currentMessages.splice(tempIndex, 1);
                        }
                    } else if (tempIndex !== -1) {
                        state.currentMessages[tempIndex] = { ...realMessage, status: 'sent', isSelf: true };
                    } else {
                        state.currentMessages.push({ ...realMessage, status: 'sent', isSelf: true });
                    }
                }
            })
            .addCase(sendMessageAsync.rejected, (state, action) => {
                const tempId = (action.payload as any)?.tempId || action.meta.arg.tempId;
                
                const msgIndex = state.currentMessages.findIndex(m => m.tempId === tempId || m.id === tempId);
                if (msgIndex !== -1) {
                    state.currentMessages[msgIndex].status = 'error';
                }
            });
    },
});

export const { setActiveConversation, clearChatState, addMessage, setPendingTargetUserId } = chatSlice.actions;
export default chatSlice.reducer;