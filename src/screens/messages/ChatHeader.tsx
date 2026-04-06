import { useTranslation } from "react-i18next";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { uploadConversationAvatarAsync } from "@/lib/redux/features/chatSlice";
import { getChatDisplayInfo } from "./page";
import { Conversation } from "@/lib/services/chat.service";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";
import { useRouter } from "next/navigation"; // <-- 1. THÊM IMPORT NÀY
interface ChatHeaderProps {
    activeChat: Conversation;
    onToggleSidebar: () => void;
    currentUserId: string;
}

const ChatHeader = ({ activeChat, onToggleSidebar, currentUserId }: ChatHeaderProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { name, avatar } = getChatDisplayInfo(activeChat, currentUserId, t);
    const participantsCount = activeChat.participants?.length || 0;
    const router = useRouter(); // <-- 2. KHỞI TẠO ROUTER Ở ĐÂY

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageClick = () => {
        if (true || activeChat.type === 'GROUP') {
            fileInputRef.current?.click();
        } else {
            alert(t('chat.header.changeAvatarOnlyGroup', 'Bạn chỉ có thể đổi ảnh đại diện cho Nhóm trò chuyện!'));
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert(t('chat.header.imageTooLarge', 'Dung lượng ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.'));
            return;
        }

        setIsUploading(true);
        try {
            await dispatch(uploadConversationAvatarAsync({ 
                conversationId: activeChat.id, 
                file: file 
            })).unwrap();
            
            alert(t('chat.header.updateAvatarSuccess', 'Cập nhật ảnh đại diện thành công!'));
        } catch (error) {
            alert(t('chat.header.updateAvatarFail', 'Cập nhật ảnh thất bại. Vui lòng thử lại sau.'));
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

const handleViewProfile = () => {
        if (activeChat.type === 'GROUP') {
            alert(t('chat.header.noGroupProfile', 'Nhóm trò chuyện không có trang cá nhân!'));
            return;
        } else {
            // Tìm thành viên trong cuộc trò chuyện mà KHÔNG PHẢI là chính mình
            const otherParticipant = activeChat.participants?.find(
                (p: any) => p.userId !== currentUserId && p.id !== currentUserId
            );

            // Lấy ID của người đó (tùy thuộc vào cấu trúc backend của bạn trả về userId hay id)
            const targetId = otherParticipant?.userId || otherParticipant?.userId;

            if (targetId) {
                router.push(`/people/${targetId}`);
            } else {
                alert("Không tìm thấy thông tin người dùng này.");
            }
        }
    };

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-3">
                
                <div 
                    className={`relative ${activeChat.type === 'GROUP' ? 'cursor-pointer hover:opacity-80' : ''}`}
                    onClick={handleImageClick}
                    title={activeChat.type === 'GROUP' ? t('chat.header.changeGroupAvatarHint', 'Nhấn để đổi ảnh nhóm') : ""}
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
                    <p className="text-sm text-gray-500 underline cursor-pointer" onClick={handleViewProfile}>
                        {activeChat.type === 'GROUP' ? t('chat.header.members', '{{count}} thành viên', { count: participantsCount }) : t('chat.header.viewProfile', 'Xem hồ sơ')}
                    </p>
                </div>
            </div>
            
            <button 
                onClick={onToggleSidebar}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                title={t('chat.header.toggleSidebar', 'Đóng/Mở danh sách chat')}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
    );
};

export default ChatHeader;