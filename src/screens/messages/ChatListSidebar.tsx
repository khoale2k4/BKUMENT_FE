"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setActiveConversation,
    createChatAsync,
    fetchConversations
} from "@/lib/redux/features/chatSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { formatTimestamp } from "@/lib/utils/formatTimestamp";
import { getChatDisplayInfo } from "./page";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";

interface ChatListSidebarProps {
    isOpen: boolean;
    currentUserId: string;
}

const ChatListSidebar = ({ isOpen, currentUserId }: ChatListSidebarProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { conversations, activeConversationId } = useSelector((state: RootState) => state.chat);

    const [searchValue, setSearchValue] = useState("");
    const [isCreating, setIsCreating] = useState(false); 

    const handleSearchKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchValue.trim() !== '') {
            e.preventDefault();
            setIsCreating(true);

            try {
                await dispatch(createChatAsync({
                    type: 'DIRECT',
                    userIds: [searchValue.trim()]
                })).unwrap(); 

                await dispatch(fetchConversations({ page: 0, size: 20 })).unwrap();

                setSearchValue("");

            } catch (error) {
                console.error("Lỗi khi tạo cuộc trò chuyện:", error);
                alert("Không thể tạo cuộc trò chuyện với ID này. Có thể ID không tồn tại.");
            } finally {
                setIsCreating(false);
            }
        }
    };

    return (
        <div className={`transition-all duration-300 ease-in-out bg-white h-full border-l border-gray-200 overflow-hidden ${isOpen ? "w-80 opacity-100" : "w-0 opacity-0 border-l-0"}`}>
            <div className="w-80 flex flex-col h-full">
                <div className="p-4 shrink-0">
                    <h2 className="text-2xl font-bold mb-4">Chats</h2>
                    <div className="relative">
                        <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        {/* TODO: Cái này tạm cho test tạo cuộc trò chuyện, sau sẽ thêm cách khác */}
                        <input
                            type="text"
                            placeholder="Tìm cuộc trò chuyện ..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            disabled={isCreating} 
                            className={`w-full bg-gray-50 text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none border border-gray-100 ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations && conversations.length > 0 ? (
                        conversations.map((chat: any) => {
                            const { name, avatar } = getChatDisplayInfo(chat, currentUserId);
                            const isActive = chat.id === activeConversationId;

                            return (
                                <div
                                    key={chat.id}
                                    onClick={() => dispatch(setActiveConversation(chat.id))}
                                    className={`flex items-center gap-3 p-3 mx-2 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors ${isActive ? "bg-blue-50" : ""}`}
                                >
                                    <AuthenticatedImage src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                                    <div className="flex-1 overflow-hidden">
                                        <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
                                        <p className="text-sm text-gray-500 truncate">
                                            {chat.lastMessage && chat.lastMessage.includes('http') && chat.lastMessage.includes('asset') ? "Hình ảnh" : chat.lastMessage || "Chưa có tin nhắn"}
                                            {chat.lastMessageTime && ` · ${formatTimestamp(chat.lastMessageTime).split(' ')[0]}`}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[70%] text-center px-6">
                            <div className="bg-gray-50 p-4 rounded-full mb-4">
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                </svg>
                            </div>
                            <h3 className="text-gray-900 font-medium mb-1">Chưa có tin nhắn</h3>
                            <p className="text-sm text-gray-500">
                                Nhập ID vào ô tìm kiếm ở trên để bắt đầu trò chuyện.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatListSidebar;