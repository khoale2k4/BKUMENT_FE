"use client";

import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { uploadConversationAvatarAsync } from "@/lib/redux/features/chatSlice";
import { getChatDisplayInfo } from "./page";
import { Conversation } from "@/lib/services/chat.service";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";

interface ChatHeaderProps {
    activeChat: Conversation;
    onToggleSidebar: () => void;
    currentUserId: string;
}

const ChatHeader = ({ activeChat, onToggleSidebar, currentUserId }: ChatHeaderProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { name, avatar } = getChatDisplayInfo(activeChat, currentUserId);
    const participantsCount = activeChat.participants?.length || 0;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageClick = () => {
        if (true || activeChat.type === 'GROUP') {
            fileInputRef.current?.click();
        } else {
            alert("Bạn chỉ có thể đổi ảnh đại diện cho Nhóm trò chuyện!");
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("Dung lượng ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.");
            return;
        }

        setIsUploading(true);
        try {
            await dispatch(uploadConversationAvatarAsync({ 
                conversationId: activeChat.id, 
                file: file 
            })).unwrap();
            
            alert("Cập nhật ảnh đại diện thành công!");
        } catch (error) {
            alert("Cập nhật ảnh thất bại. Vui lòng thử lại sau.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-3">
                
                <div 
                    className={`relative ${activeChat.type === 'GROUP' ? 'cursor-pointer hover:opacity-80' : ''}`}
                    onClick={handleImageClick}
                    title={activeChat.type === 'GROUP' ? "Nhấn để đổi ảnh nhóm" : ""}
                >
                    <AuthenticatedImage src={avatar} alt={name} className={`w-12 h-12 rounded-full object-cover transition-opacity ${isUploading ? 'opacity-40' : ''}`} />
                    
                    {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>

                <input 
                    type="file" 
                    ref={fileInputRef} 
                    hidden 
                    accept="image/png, image/jpeg, image/jpg" 
                    onChange={handleFileChange} 
                />

                <div>
                    <h2 className="font-bold text-xl text-gray-900">{name}</h2>
                    <p className="text-sm text-gray-500 underline cursor-pointer">
                        {activeChat.type === 'GROUP' ? `${participantsCount} thành viên` : 'Xem hồ sơ'}
                    </p>
                </div>
            </div>
            
            <button 
                onClick={onToggleSidebar}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                title="Đóng/Mở danh sách chat"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
    );
};

export default ChatHeader;