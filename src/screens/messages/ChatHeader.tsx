import { useTranslation } from "react-i18next";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { uploadConversationAvatarAsync } from "@/lib/redux/features/chatSlice";
import { getChatDisplayInfo } from "./page";
import { Conversation } from "@/lib/services/chat.service";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";
import { useRouter } from "next/navigation";

interface ChatHeaderProps {
  activeChat: Conversation;
  onToggleSidebar: () => void;
  currentUserId: string;
}

const ChatHeader = ({
  activeChat,
  onToggleSidebar,
  currentUserId,
}: ChatHeaderProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { name, avatar } = getChatDisplayInfo(activeChat, currentUserId, t);
  const participantsCount = activeChat.participants?.length || 0;
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageClick = () => {
    if (true || activeChat.type === "GROUP") {
      fileInputRef.current?.click();
    } else {
      alert(
        t(
          "chat.header.changeAvatarOnlyGroup",
          "Bạn chỉ có thể đổi ảnh đại diện cho Nhóm trò chuyện!",
        ),
      );
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(
        t(
          "chat.header.imageTooLarge",
          "Dung lượng ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.",
        ),
      );
      return;
    }

    setIsUploading(true);
    try {
      await dispatch(
        uploadConversationAvatarAsync({
          conversationId: activeChat.id,
          file: file,
        }),
      ).unwrap();

      alert(
        t(
          "chat.header.updateAvatarSuccess",
          "Cập nhật ảnh đại diện thành công!",
        ),
      );
    } catch (error) {
      alert(
        t(
          "chat.header.updateAvatarFail",
          "Cập nhật ảnh thất bại. Vui lòng thử lại sau.",
        ),
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleViewProfile = () => {
    if (activeChat.type === "GROUP") {
      alert(
        t(
          "chat.header.noGroupProfile",
          "Nhóm trò chuyện không có trang cá nhân!",
        ),
      );
      return;
    } else {
      const otherParticipant = activeChat.participants?.find(
        (p: any) => p.userId !== currentUserId && p.id !== currentUserId,
      );

      const targetId = otherParticipant?.userId || otherParticipant?.userId;

      if (targetId) {
        router.push(`/people/${targetId}`);
      } else {
        alert(
          t(
            "chat.header.errorFindUser",
            "Could not find information for this user.",
          ),
        );
      }
    }
  };

  return (
    /*
          [THAY ĐỔI] Padding responsive: p-3 trên mobile, p-4 trên desktop.
          `min-w-0` trên flex container để cho phép truncate hoạt động đúng.
        */
    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 shrink-0 min-w-0">
      {/* Left group: avatar + name — min-w-0 để truncate hoạt động */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
        {/* [THAY ĐỔI] Avatar: shrink-0 để không bị bóp trên mobile */}
        <div
          className={`relative shrink-0 ${activeChat.type === "GROUP" ? "cursor-pointer hover:opacity-80" : ""}`}
          onClick={handleImageClick}
          title={
            activeChat.type === "GROUP"
              ? t("chat.header.changeGroupAvatarHint", "Nhấn để đổi ảnh nhóm")
              : ""
          }
        >
          {/* [THAY ĐỔI] Avatar nhỏ hơn trên mobile: w-10 h-10, lớn hơn trên sm+: w-12 h-12 */}
          <AuthenticatedImage
            src={avatar}
            alt={name}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover transition-opacity ${isUploading ? "opacity-40" : ""}`}
          />

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

        {/*
                  [THAY ĐỔI] min-w-0 + overflow-hidden để truncate hoạt động
                  trong flex container.
                */}
        <div className="min-w-0 overflow-hidden">
          {/*
                      [THAY ĐỔI] Thêm `truncate` để cắt tên quá dài.
                      Font size nhỏ hơn trên mobile: text-base, lớn hơn trên sm+: text-xl.
                    */}
          <h2 className="font-bold text-base sm:text-xl text-gray-900 truncate">
            {name}
          </h2>
          {/*
                      [THAY ĐỔI] Thêm `truncate` cho subtitle phòng trường hợp
                      tên nhóm thành viên cũng quá dài.
                    */}
          <p
            className="text-xs sm:text-sm text-gray-500 underline cursor-pointer truncate"
            onClick={handleViewProfile}
          >
            {activeChat.type === "GROUP"
              ? t("chat.header.members", "{{count}} thành viên", {
                  count: participantsCount,
                })
              : t("chat.header.viewProfile", "Xem hồ sơ")}
          </p>
        </div>
      </div>

      {/* [THAY ĐỔI] shrink-0 để nút hamburger không bị thu nhỏ */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 text-gray-600 transition-colors shrink-0"
        title={t("chat.header.toggleSidebar", "Đóng/Mở danh sách chat")}
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default ChatHeader;
