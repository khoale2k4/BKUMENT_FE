"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations, fetchMessagesByConversationId } from "@/lib/redux/features/chatSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { Conversation } from "@/lib/services/chat.service";
import ChatHeader from "./ChatHeader";
import MessageGroup from "./MessageGroup";
import { formatTimestamp } from "@/lib/utils/formatTimestamp";
import ChatInput from "./ChatInput";
import ChatListSidebar from "./ChatListSidebar";

export const getChatDisplayInfo = (chat: Conversation, currentUserId: string) => {
    if (chat.type === 'GROUP') {
        return {
            name: chat.name || "Nhóm trò chuyện",
            avatar: chat.conversationAvatar || "https://ui-avatars.com/api/?name=Group&background=random"
        };
    }
    const otherUser = chat.participants.find(p => p.userId !== currentUserId) || chat.participants[0];
    if (!otherUser) return { name: "Unknown", avatar: "" };

    return {
        name: `${otherUser.lastName} ${otherUser.firstName}`.trim() || otherUser.username,
        avatar: otherUser.avatar || chat.conversationAvatar
    };
};

const MessagesPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        conversations,
        activeConversationId,
        currentMessages,
        messagesStatus
    } = useSelector((state: RootState) => state.chat);

    const {
        user,
    } = useSelector((state: RootState) => state.profile);

    useEffect(() => {
        dispatch(fetchConversations({ page: 0, size: 20 }));
    }, [dispatch]);

    useEffect(() => {
        if (activeConversationId) {
            dispatch(fetchMessagesByConversationId(activeConversationId));
        }
    }, [dispatch, activeConversationId]);

    const activeChat = (conversations || []).find(c => c.id === activeConversationId);

    const groupedMessages = useMemo(() => {
        if (!currentMessages || currentMessages.length === 0) return [];

        const groups: any[] = [];
        let currentGroup: any = null;

        currentMessages.forEach((msg: any) => {
            const isSelf = msg.sender.userId === user?.id;
            const msgTime = new Date(msg.createdDate).getTime();

            if (currentGroup && currentGroup.senderId === msg.sender.userId) {
                const prevTime = new Date(currentGroup.lastMsgTime).getTime();
                const diffInMinutes = (msgTime - prevTime) / (1000 * 60);

                if (diffInMinutes <= 30) {
                    currentGroup.messages.push({ type: msg.type, content: msg.message, id: msg.id });
                    currentGroup.lastMsgTime = msg.createdDate;
                    return;
                }
            }

            if (currentGroup) groups.push(currentGroup);

            currentGroup = {
                id: msg.id,
                isSelf: isSelf,
                senderId: msg.sender.userId,
                timestamp: msg.createdDate,
                lastMsgTime: msg.createdDate,
                user: {
                    name: `${msg.sender.lastName} ${msg.sender.firstName}`.trim() || msg.sender.username,
                    avatar: msg.sender.avatar
                },
                messages: [{ type: msg.type, content: msg.message, id: msg.id }]
            };
        });

        if (currentGroup) groups.push(currentGroup);

        return groups;
    }, [currentMessages, user?.id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (groupedMessages.length > 0) {
            scrollToBottom();
        }
    }, [groupedMessages]);

    if (!user) {
        return (
            <div className="flex h-[calc(100vh-70px)] w-full items-center justify-center bg-white/50">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }


    return (
        <div className="flex h-[calc(100vh-70px)] w-full bg-white font-sans text-gray-800 overflow-hidden">
            <div className="flex flex-col flex-1 h-full min-w-0 bg-white">

                {!activeConversationId ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50">
                        <div className="bg-blue-50 p-6 rounded-full mb-4">
                            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Không có gì cả...</h3>
                        <p className="text-gray-500">Hãy chọn một cuộc trò chuyện để gửi tin nhắn.</p>
                    </div>
                ) : (
                    <>
                        {activeChat && (
                            <ChatHeader
                                activeChat={activeChat}
                                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                                currentUserId={user?.id ?? ""}
                            />
                        )}

                        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                            {messagesStatus === 'loading' ? (
                                <div className="flex-1 flex justify-center items-center">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : groupedMessages.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <div className="bg-blue-50 p-6 rounded-full mb-4">
                                        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có tin nhắn nào</h3>
                                    <p className="text-gray-500">Hãy là người đầu tiên gửi tin nhắn.</p>
                                </div>
                            ) : (
                                groupedMessages.map((group, index) => {
                                    let showTime = false;

                                    if (index === 0) {
                                        showTime = true;
                                    } else {
                                        const prevGroup = groupedMessages[index - 1];
                                        const currentTimestamp = new Date(group.timestamp).getTime();
                                        const prevTimestamp = new Date(prevGroup.timestamp).getTime();
                                        const diffInMinutes = (currentTimestamp - prevTimestamp) / (1000 * 60);

                                        if (diffInMinutes > 30) {
                                            showTime = true;
                                        }
                                    }

                                    return (
                                        <React.Fragment key={group.id}>
                                            {showTime && (
                                                <div className="text-center text-xs font-medium text-gray-400 my-4 uppercase tracking-wide">
                                                    {formatTimestamp(group.timestamp)}
                                                </div>
                                            )}
                                            <MessageGroup
                                                isSelf={group.isSelf}
                                                user={group.user}
                                                messages={group.messages}
                                            />
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </div>

                        <ChatInput />
                    </>
                )}
            </div>

            <ChatListSidebar
                isOpen={isSidebarOpen}
                currentUserId={user?.id ?? ""}
            />

        </div>
    );
};

export default MessagesPage;