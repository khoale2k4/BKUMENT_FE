"use client";

import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveConversation,
  createChatAsync,
  fetchConversations,
  setPendingTargetUserId,
  markAsRead,
} from "@/lib/redux/features/chatSlice";
import { searchProfiles } from "@/lib/redux/features/profileSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { formatTimestamp } from "@/lib/utils/formatTimestamp";
import { getChatDisplayInfo } from "./page";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";
import { Loader2, ArrowLeft, Search, X, Users } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";

interface ChatListSidebarProps {
  isOpen: boolean;
  currentUserId: string;
  onClose: () => void;
}

const ChatListSidebar = ({
  isOpen,
  currentUserId,
  onClose,
}: ChatListSidebarProps) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const { conversations, activeConversationId, pendingTargetUserId } =
    useSelector((state: RootState) => state.chat);
  const { viewedListProfile, isViewedListProfileLoading } = useSelector(
    (state: RootState) => state.profile,
  );

  const [searchValue, setSearchValue] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Auto-create chat from profile page
  useEffect(() => {
    const autoCreateChat = async () => {
      if (pendingTargetUserId) {
        setIsCreating(true);
        try {
          const newChat = await dispatch(
            createChatAsync({ type: "DIRECT", userIds: [pendingTargetUserId] }),
          ).unwrap();

          await dispatch(fetchConversations({ page: 0, size: 10 })).unwrap();
          setCurrentPage(0);
          setHasMore(true);

          if (newChat?.id) dispatch(setActiveConversation(newChat.id));
          dispatch(setPendingTargetUserId(null));
        } catch (error) {
          console.error(
            t(
              "chat.sidebar.errorCreateProfile",
              "Error creating conversation.",
            ),
            error,
          );
          dispatch(setPendingTargetUserId(null));
        } finally {
          setIsCreating(false);
        }
      }
    };
    autoCreateChat();
  }, [pendingTargetUserId, dispatch, t]);

  // Debounce user search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue.trim()) {
        dispatch(
          searchProfiles({ keyword: searchValue.trim(), page: 1, size: 10 }),
        );
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue, dispatch]);

  const handleStartChat = async (targetUserId: string) => {
    setIsSearchMode(false);
    setSearchValue("");
    setIsCreating(true);
    try {
      const newChat = await dispatch(
        createChatAsync({ type: "DIRECT", userIds: [targetUserId] }),
      ).unwrap();

      await dispatch(fetchConversations({ page: 0, size: 10 })).unwrap();
      setCurrentPage(0);
      setHasMore(true);

      if (newChat?.id) dispatch(setActiveConversation(newChat.id));
    } catch (error) {
      console.error(
        t("chat.sidebar.errorCreate", "Could not create conversation."),
        error,
      );
      alert(
        t("chat.sidebar.errorCreate", "Đã xảy ra lỗi khi tạo cuộc trò chuyện."),
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    if (isSearchMode) return;
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 20 &&
      !isFetchingMore &&
      hasMore
    ) {
      setIsFetchingMore(true);
      try {
        const nextPage = currentPage + 1;
        const result = await dispatch(
          fetchConversations({ page: nextPage, size: 10 }),
        ).unwrap();
        if (result.items.length < 10) setHasMore(false);
        setCurrentPage(nextPage);
      } catch (err) {
        console.error(
          t("chat.sidebar.errorFetchMore", "Error fetching more."),
          err,
        );
      } finally {
        setIsFetchingMore(false);
      }
    }
  };

  return (
    <>
      {/* ── Sidebar panel ─────────────────────────────────────────── */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 z-30
          w-[85vw] max-w-sm
          bg-white h-full border-l border-gray-200
          flex flex-col shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          md:relative md:top-auto md:right-auto md:bottom-auto
          md:z-auto md:shadow-none
          md:transition-all
          ${!isOpen ? "md:w-0 md:opacity-0 md:border-l-0 md:translate-x-0" : "md:w-80 md:opacity-100 md:translate-x-0"}
        `}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="p-3 sm:p-4 shrink-0 border-b border-gray-100 shadow-sm z-10">
          {/* Title row: "Chats" + icon buttons */}
          {!isSearchMode && (
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-[22px] sm:text-[24px] font-bold text-black">
                {t("chat.sidebar.title", "Chats")}
              </h2>

              {/* Action buttons row */}
              <div className="flex items-center gap-1">
                {/* Create Group button */}
                <button
                  onClick={() => setIsGroupModalOpen(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-600 transition-colors"
                  title={t("chat.sidebar.createGroupBtn", "Tạo nhóm mới")}
                >
                  <Users size={17} />
                </button>
                {/* Close button - mobile only */}
                <button
                  onClick={onClose}
                  className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Search row */}
          <div className="flex items-center gap-2">
            {isSearchMode && (
              <button
                onClick={() => {
                  setIsSearchMode(false);
                  setSearchValue("");
                }}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder={t(
                  "chat.sidebar.searchPlaceholder",
                  "Tìm kiếm trên Messenger",
                )}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearchMode(true)}
                disabled={isCreating}
                className={`w-full bg-[#f3f3f5] text-[14px] rounded-full pl-9 pr-4 py-2 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-400 transition-all ${isCreating ? "opacity-50 cursor-not-allowed" : ""}`}
              />
              {searchValue && (
                <button
                  onClick={() => setSearchValue("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── List area ──────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
          {isCreating && (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin text-blue-500" size={24} />
            </div>
          )}

          {isSearchMode ? (
            /* ── Search results ────────────────────────────────── */
            <div className="py-2">
              {!searchValue.trim() ? (
                <div className="text-center text-sm text-gray-400 mt-10 px-4">
                  {t(
                    "chat.sidebar.searchHint",
                    "Nhập tên để tìm kiếm người dùng...",
                  )}
                </div>
              ) : isViewedListProfileLoading ? (
                <div className="flex justify-center p-6">
                  <Loader2 className="animate-spin text-gray-400" size={24} />
                </div>
              ) : viewedListProfile?.data &&
                viewedListProfile.data.length > 0 ? (
                <>
                  <div className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {t("chat.sidebar.contactsLabel", "Liên hệ trên hệ thống")}
                  </div>
                  {viewedListProfile.data.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleStartChat(user.id)}
                      className="flex items-center gap-3 p-2 mx-2 rounded-xl cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-sm">
                            {user.fullName?.charAt(0) ||
                              user.firstName?.charAt(0) ||
                              "?"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-gray-900 truncate">
                          {user.fullName ||
                            `${user.firstName} ${user.lastName}`}
                        </p>
                        <p className="text-[12px] text-gray-400 truncate">
                          {user.university ||
                            t("chat.sidebar.member", "Thành viên")}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="p-4 text-center text-sm text-gray-400">
                  {t(
                    "chat.sidebar.noResults",
                    'Không tìm thấy kết quả nào cho "{{query}}"',
                    { query: searchValue },
                  )}
                </div>
              )}
            </div>
          ) : (
            /* ── Conversation list ─────────────────────────────── */
            <div className="py-1">
              {conversations && conversations.length > 0 ? (
                <>
                  {conversations.map((chat: any) => {
                    const { name: chatName, avatar: chatAvatar } =
                      getChatDisplayInfo(chat, currentUserId, t);
                    const isActive = chat.id === activeConversationId;
                    const isUnread = chat.isRead === false;
                    const isGroup = chat.type === "GROUP";

                    return (
                      <div
                        key={chat.id}
                        onClick={() => {
                          dispatch(markAsRead(chat.id));
                          dispatch(setActiveConversation(chat.id));
                          onClose();
                        }}
                        className={`flex items-center gap-3 p-2.5 mx-2 mb-0.5 rounded-xl cursor-pointer transition-colors active:bg-gray-200 ${
                          isActive ? "bg-[#eaf3ff]" : "hover:bg-gray-100"
                        }`}
                      >
                        {/* Avatar with GROUP badge */}
                        <div className="relative shrink-0">
                          <AuthenticatedImage
                            src={chatAvatar}
                            alt={chatName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {isGroup && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center">
                              <Users size={10} className="text-white" />
                            </div>
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 overflow-hidden relative min-w-0">
                          <h3
                            className={`text-[15px] truncate ${isUnread ? "font-bold text-gray-900" : "font-medium text-black"}`}
                          >
                            {chatName}
                          </h3>
                          <p
                            className={`text-[12px] truncate pr-4 ${isUnread ? "font-semibold text-black" : "text-gray-500"}`}
                          >
                            {chat.lastMessage &&
                            chat.lastMessage.includes("http") &&
                            chat.lastMessage.includes("asset")
                              ? t("chat.sidebar.image", "Hình ảnh")
                              : chat.lastMessage ||
                                t(
                                  "chat.sidebar.noMessages",
                                  "Chưa có tin nhắn",
                                )}
                            {chat.lastMessageTime &&
                              ` · ${formatTimestamp(chat.lastMessageTime, i18n.language === "en" ? "en-US" : "vi-VN").split(" ")[0]}`}
                          </p>
                          {isUnread && (
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm" />
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {isFetchingMore && (
                    <div className="flex justify-center p-4">
                      <Loader2
                        className="animate-spin text-gray-300"
                        size={20}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center mt-16 text-center px-6">
                  <div className="bg-gray-50 p-5 rounded-full mb-4">
                    <Search className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-gray-800 font-semibold mb-1 text-[15px]">
                    {t("chat.sidebar.noMessages", "Chưa có cuộc trò chuyện")}
                  </h3>
                  <p className="text-[13px] text-gray-400 leading-relaxed">
                    {t(
                      "chat.sidebar.emptyHint",
                      "Tìm kiếm mọi người để bắt đầu trò chuyện.",
                    )}
                  </p>
                  <button
                    onClick={() => setIsGroupModalOpen(true)}
                    className="mt-4 flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-[13px] px-4 py-2 rounded-full transition-colors"
                  >
                    <Users size={15} />
                    {t("chat.sidebar.createGroupBtn", "Tạo nhóm mới")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Create Group Modal ─────────────────────────────────────── */}
      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
    </>
  );
};

export default ChatListSidebar;
