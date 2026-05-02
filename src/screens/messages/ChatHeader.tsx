import { useTranslation } from "react-i18next";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import {
  uploadConversationAvatarAsync,
  uploadConversationNameAsync,
} from "@/lib/redux/features/chatSlice";
import { getChatDisplayInfo } from "./page";
import { Conversation } from "@/lib/services/chat.service";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";
import { useRouter } from "next/navigation";
import { Check, Pencil, X } from "lucide-react";
import MembersListModal from "./MembersListModal";

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

  // ── Avatar upload ─────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // ── Group rename ──────────────────────────────────────────────
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [isSavingName, setIsSavingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // ── Members modal ─────────────────────────────────────────────
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  // ── Handlers ─────────────────────────────────────────────────

  const handleImageClick = () => {
    if (activeChat.type === "GROUP") {
      fileInputRef.current?.click();
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
        uploadConversationAvatarAsync({ conversationId: activeChat.id, file }),
      ).unwrap();
      alert(
        t(
          "chat.header.updateAvatarSuccess",
          "Cập nhật ảnh đại diện thành công!",
        ),
      );
    } catch {
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

  const handleStartEditName = () => {
    setEditedName(name);
    setIsEditingName(true);
    setTimeout(() => nameInputRef.current?.focus(), 50);
  };

  const handleSaveName = async () => {
    const trimmed = editedName.trim();
    if (!trimmed || trimmed === name || isSavingName) return;

    setIsSavingName(true);
    try {
      await dispatch(
        uploadConversationNameAsync({
          conversationId: activeChat.id,
          name: trimmed,
        }),
      ).unwrap();
    } catch (err) {
      console.error("Rename failed:", err);
    } finally {
      setIsSavingName(false);
      setIsEditingName(false);
    }
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditedName(name);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSaveName();
    if (e.key === "Escape") handleCancelEditName();
  };

  const handleSubtitleClick = () => {
    if (activeChat.type === "GROUP") {
      setIsMembersModalOpen(true);
    } else {
      const other = activeChat.participants?.find(
        (p: any) => p.userId !== currentUserId && p.id !== currentUserId,
      );
      //const targetId = other?.userId || other?.id;
      const targetId = other?.userId;
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
    <>
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 shrink-0 min-w-0 bg-white">
        {/* Avatar + name/subtitle */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
          {/* Avatar */}
          <div
            className={`relative shrink-0 ${activeChat.type === "GROUP" ? "cursor-pointer group" : ""}`}
            onClick={handleImageClick}
            title={
              activeChat.type === "GROUP"
                ? t("chat.header.changeGroupAvatarHint", "Nhấn để đổi ảnh nhóm")
                : ""
            }
          >
            <AuthenticatedImage
              src={avatar}
              alt={name}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover transition-opacity ${isUploading ? "opacity-40" : ""}`}
            />
            {/* Camera overlay on hover - GROUP only */}
            {activeChat.type === "GROUP" && !isUploading && (
              <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/60">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
          />

          {/* Name + subtitle */}
          <div className="min-w-0 flex-1 overflow-hidden">
            {/* ── Editing mode ─────────────────────────────────── */}
            {isEditingName ? (
              <div className="flex items-center gap-1.5 w-full">
                <input
                  ref={nameInputRef}
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={handleNameKeyDown}
                  className="flex-1 min-w-0 text-[15px] sm:text-[17px] font-bold text-gray-900 bg-gray-100 rounded-lg px-2 py-0.5 outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                />
                {/* Confirm */}
                <button
                  onClick={handleSaveName}
                  disabled={
                    isSavingName ||
                    !editedName.trim() ||
                    editedName.trim() === name
                  }
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-200 text-white transition-colors shrink-0"
                >
                  {isSavingName ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check size={12} strokeWidth={3} />
                  )}
                </button>
                {/* Cancel */}
                <button
                  onClick={handleCancelEditName}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors shrink-0"
                >
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            ) : (
              /* ── Display mode ────────────────────────────────── */
              <div className="flex items-center gap-1 min-w-0">
                <h2 className="font-bold text-[15px] sm:text-[17px] text-gray-900 truncate">
                  {name}
                </h2>
                {/* Edit button — GROUP only */}
                {activeChat.type === "GROUP" && (
                  <button
                    onClick={handleStartEditName}
                    className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                    title={t("chat.header.renameGroup", "Đổi tên nhóm")}
                  >
                    <Pencil size={12} />
                  </button>
                )}
              </div>
            )}

            {/* Subtitle */}
            <p
              className="text-[11px] sm:text-xs text-blue-500 hover:text-blue-600 cursor-pointer truncate mt-0.5 font-medium"
              onClick={handleSubtitleClick}
            >
              {activeChat.type === "GROUP"
                ? t("chat.header.members", "{{count}} thành viên", {
                    count: participantsCount,
                  })
                : t("chat.header.viewProfile", "Xem hồ sơ")}
            </p>
          </div>
        </div>

        {/* Hamburger */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 text-gray-500 transition-colors shrink-0"
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
            />
          </svg>
        </button>
      </div>

      {/* Members list modal */}
      <MembersListModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        participants={activeChat.participants || []}
        groupName={name}
        currentUserId={currentUserId}
      />
    </>
  );
};

export default ChatHeader;
