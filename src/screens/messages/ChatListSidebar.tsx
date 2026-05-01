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
import { Loader2, ArrowLeft, Search, X } from "lucide-react";

interface ChatListSidebarProps {
  isOpen: boolean;
  currentUserId: string;
  // [THÊM MỚI] Callback để MessagesPage có thể đóng sidebar từ nút X trên mobile
  onClose: () => void;
}

const ChatListSidebar = ({
  isOpen,
  currentUserId,
  onClose,
}: ChatListSidebarProps) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  // Redux States
  const { conversations, activeConversationId, pendingTargetUserId } =
    useSelector((state: RootState) => state.chat);
  const { viewedListProfile, isViewedListProfileLoading } = useSelector(
    (state: RootState) => state.profile,
  );

  // Local States
  const [searchValue, setSearchValue] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 1. Tự động tạo chat từ trang Profile
  useEffect(() => {
    const autoCreateChat = async () => {
      if (pendingTargetUserId) {
        setIsCreating(true);
        try {
          const newChat = await dispatch(
            createChatAsync({
              type: "DIRECT",
              userIds: [pendingTargetUserId],
            }),
          ).unwrap();

          await dispatch(fetchConversations({ page: 0, size: 10 })).unwrap();
          setCurrentPage(0);
          setHasMore(true);

          if (newChat?.id) {
            dispatch(setActiveConversation(newChat.id));
          }
          dispatch(setPendingTargetUserId(null));
        } catch (error) {
          console.error(
            t(
              "chat.sidebar.errorCreateProfile",
              "Error creating conversation from Profile.",
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

  // 2. Debounce API Tìm kiếm người dùng
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

  // 3. Xử lý tạo Chat khi click vào kết quả tìm kiếm
  const handleStartChat = async (targetUserId: string) => {
    setIsSearchMode(false);
    setSearchValue("");
    setIsCreating(true);

    try {
      const newChat = await dispatch(
        createChatAsync({
          type: "DIRECT",
          userIds: [targetUserId],
        }),
      ).unwrap();

      await dispatch(fetchConversations({ page: 0, size: 10 })).unwrap();
      setCurrentPage(0);
      setHasMore(true);

      if (newChat?.id) {
        dispatch(setActiveConversation(newChat.id));
      }
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

  // 4. Scroll load more
  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    if (isSearchMode) return;

    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 20) {
      if (!isFetchingMore && hasMore) {
        setIsFetchingMore(true);
        try {
          const nextPage = currentPage + 1;
          const actionResult = await dispatch(
            fetchConversations({ page: nextPage, size: 10 }),
          ).unwrap();

          if (actionResult.items.length < 10) {
            setHasMore(false);
          }
          setCurrentPage(nextPage);
        } catch (error) {
          console.error(
            t(
              "chat.sidebar.errorFetchMore",
              "Error fetching more conversations:",
            ),
            error,
          );
        } finally {
          setIsFetchingMore(false);
        }
      }
    }
  };

  return (
    /*
      [THAY ĐỔI CHÍNH] Responsive sidebar:
      - Mobile (< md):
        · `fixed` + `top-0 right-0 bottom-0` → chiếm toàn bộ chiều cao vùng nhìn thấy
        · `w-[85vw] max-w-sm` → chiếm 85% màn hình, tối đa 384px
        · `z-30` → cao hơn backdrop (z-20) trong MessagesPage
        · `translate-x-full` khi đóng, `translate-x-0` khi mở → hiệu ứng trượt từ phải
        · `shadow-2xl` → nổi bật trên nền mờ
      - Desktop (md+):
        · `md:relative md:translate-x-0` → quay về layout inline bình thường
        · `md:w-80` → chiều rộng cố định như trước
        · `md:shadow-none md:z-auto`
    */
    <div
      className={`
        fixed top-0 right-0 bottom-0 z-30
        w-[85vw] max-w-sm
        bg-white h-full border-l border-gray-200
        flex flex-col
        shadow-2xl
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        md:relative md:top-auto md:right-auto md:bottom-auto
        md:z-auto md:shadow-none
        md:w-80
        md:transition-all
        ${!isOpen ? "md:w-0 md:opacity-0 md:border-l-0 md:translate-x-0" : "md:opacity-100 md:translate-x-0"}
      `}
    >
      {/* --- PHẦN HEADER & TÌM KIẾM --- */}
      <div className="p-3 sm:p-4 shrink-0 border-b border-transparent shadow-sm z-10">
        {/* Header row: title + nút đóng (chỉ hiện trên mobile) */}
        {!isSearchMode && (
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-[22px] sm:text-[24px] font-bold text-black">
              {t("chat.sidebar.title", "Chats")}
            </h2>
            {/* [THÊM MỚI] Nút X để đóng sidebar - chỉ hiện trên mobile */}
            <button
              onClick={onClose}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              aria-label={t("chat.sidebar.close", "Close")}
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Nút Back xuất hiện khi bật Search Mode */}
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
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
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
              className={`w-full bg-[#f3f3f5] text-[15px] rounded-full pl-9 pr-4 py-2 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all ${isCreating ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>
        </div>
      </div>

      {/* --- PHẦN DANH SÁCH --- */}
      <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
        {isCreating && (
          <div className="flex justify-center p-4">
            <Loader2 className="animate-spin text-blue-500" size={24} />
          </div>
        )}

        {isSearchMode ? (
          /* ======== GIAO DIỆN TÌM KIẾM NGƯỜI DÙNG ======== */
          <div className="py-2">
            {!searchValue.trim() ? (
              <div className="text-center text-sm text-gray-500 mt-10 px-4">
                {t(
                  "chat.sidebar.searchHint",
                  "Nhập tên để tìm kiếm người dùng...",
                )}
              </div>
            ) : isViewedListProfileLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="animate-spin text-gray-400" size={24} />
              </div>
            ) : viewedListProfile?.data && viewedListProfile.data.length > 0 ? (
              <>
                <div className="px-4 py-2 text-[13px] font-semibold text-gray-500 uppercase tracking-wide">
                  {t("chat.sidebar.contactsLabel", "Liên hệ trên hệ thống")}
                </div>
                {viewedListProfile.data.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleStartChat(user.id)}
                    className="flex items-center gap-3 p-2 mx-2 rounded-xl cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  >
                    {/* [THAY ĐỔI] Avatar cố định kích thước để không bị méo */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">
                          {user.fullName?.charAt(0) ||
                            user.firstName?.charAt(0) ||
                            "?"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* [THAY ĐỔI] truncate để không vỡ layout */}
                      <p className="text-[15px] font-medium text-gray-900 truncate">
                        {user.fullName || `${user.firstName} ${user.lastName}`}
                      </p>
                      <p className="text-[13px] text-gray-500 truncate">
                        {user.university ||
                          t("chat.sidebar.member", "Thành viên")}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                {t(
                  "chat.sidebar.noResults",
                  'Không tìm thấy kết quả nào cho "{{query}}"',
                  { query: searchValue },
                )}
              </div>
            )}
          </div>
        ) : (
          /* ======== GIAO DIỆN DANH SÁCH CHAT GỐC ======== */
          <div className="py-1">
            {conversations && conversations.length > 0 ? (
              <>
                {conversations.map((chat: any) => {
                  const { name, avatar } = getChatDisplayInfo(
                    chat,
                    currentUserId,
                    t,
                  );
                  const isActive = chat.id === activeConversationId;
                  const isUnread = chat.isRead === false;

                  return (
                    <div
                      key={chat.id}
                      onClick={() => {
                        dispatch(markAsRead(chat.id));
                        dispatch(setActiveConversation(chat.id));

                        // [THÊM MỚI] Chỉ đóng sidebar nếu bề ngang màn hình nhỏ hơn 768px (Mobile/Tablet nhỏ)
                        if (
                          typeof window !== "undefined" &&
                          window.innerWidth < 768
                        ) {
                          // Gọi hàm đóng sidebar của bạn ở đây (onClose hoặc setIsOpen(false) tuỳ cách bạn truyền props)
                          if (onClose) {
                            onClose();
                          }
                        }
                      }}
                      className={`flex items-center gap-3 p-2.5 mx-2 mb-1 rounded-xl cursor-pointer transition-colors active:bg-gray-200 ${isActive ? "bg-[#eaf3ff]" : "hover:bg-gray-100"}`}
                    >
                      <AuthenticatedImage
                        src={avatar}
                        alt={name}
                        // [THAY ĐỔI] shrink-0 để avatar không bị bóp
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 overflow-hidden relative min-w-0">
                        <h3
                          className={`text-[15px] truncate ${isUnread ? "font-bold text-gray-900" : "font-medium text-black"}`}
                        >
                          {name}
                        </h3>

                        <p
                          className={`text-[13px] truncate pr-4 ${isUnread ? "font-semibold text-black" : "text-gray-500"}`}
                        >
                          {chat.lastMessage &&
                          chat.lastMessage.includes("http") &&
                          chat.lastMessage.includes("asset")
                            ? t("chat.sidebar.image", "Hình ảnh")
                            : chat.lastMessage ||
                              t("chat.sidebar.noMessages", "Chưa có tin nhắn")}
                          {chat.lastMessageTime &&
                            ` · ${formatTimestamp(chat.lastMessageTime, i18n.language === "en" ? "en-US" : "vi-VN").split(" ")[0]}`}
                        </p>

                        {isUnread && (
                          <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm"></div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isFetchingMore && (
                  <div className="flex justify-center p-4">
                    <Loader2 className="animate-spin text-gray-400" size={24} />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center mt-20 text-center px-6">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-medium mb-1">
                  {t("chat.sidebar.noMessages", "Chưa có cuộc trò chuyện")}
                </h3>
                <p className="text-[13px] text-gray-500">
                  {t(
                    "chat.sidebar.emptyHint",
                    "Tìm kiếm mọi người trên hệ thống để bắt đầu trò chuyện.",
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatListSidebar;
