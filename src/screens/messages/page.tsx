"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  fetchConversations,
  fetchMessagesByConversationId,
} from "@/lib/redux/features/chatSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { Conversation } from "@/lib/services/chat.service";
import ChatHeader from "./ChatHeader";
import MessageGroup from "./MessageGroup";
import { formatTimestamp } from "@/lib/utils/formatTimestamp";
import ChatInput from "./ChatInput";
import ChatListSidebar from "./ChatListSidebar";

export const getChatDisplayInfo = (
  chat: Conversation,
  currentUserId: string,
  t: any,
) => {
  if (chat.type === "GROUP") {
    console.log("Chat info:", chat);
    return {
      name: chat.conversationName || t("chat.header.groupChat", "Group Chat"),
      avatar:
        chat.conversationAvatar ||
        "https://ui-avatars.com/api/?name=Group&background=random",
    };
  }
  const otherUser =
    chat.participants.find((p) => p.userId !== currentUserId) ||
    chat.participants[0];
  if (!otherUser)
    return { name: t("chat.main.unknownUser", "Unknown User"), avatar: "" };

  return {
    name:
      `${otherUser.lastName} ${otherUser.firstName}`.trim() ||
      otherUser.username,
    avatar: otherUser.avatar || chat.conversationAvatar,
  };
};

const MessagesPage = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isFetchingOlder, setIsFetchingOlder] = useState(false);

  const {
    conversations,
    activeConversationId,
    currentMessages,
    messagesStatus,
    messagesPage,
    hasMoreMessages,
  } = useSelector((state: RootState) => state.chat);

  const { user } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    dispatch(fetchConversations({ page: 0, size: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (activeConversationId) {
      dispatch(
        fetchMessagesByConversationId({
          conversationId: activeConversationId,
          page: 0,
          size: 20,
        }),
      );
    }
  }, [dispatch, activeConversationId]);

  const activeChat = (conversations || []).find(
    (c) => c.id === activeConversationId,
  );

  const groupedMessages = useMemo(() => {
    if (!currentMessages || currentMessages.length === 0) return [];

    const groups: any[] = [];
    let currentGroup: any = null;

    currentMessages.forEach((msg: any) => {
      const isSelf =
        msg.sender.userId === user?.id ||
        msg.sender.userId === "OPTIMISTIC_SELF";
      const msgTime = new Date(msg.createdDate).getTime();

      if (currentGroup && currentGroup.senderId === msg.sender.userId) {
        const prevTime = new Date(currentGroup.lastMsgTime).getTime();
        const diffInMinutes = (msgTime - prevTime) / (1000 * 60);

        if (diffInMinutes <= 30) {
          currentGroup.messages.push({
            type: msg.type,
            content: msg.message,
            id: msg.id,
            status: msg.status || "sent",
          });
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
          name:
            `${msg.sender.lastName} ${msg.sender.firstName}`.trim() ||
            msg.sender.username,
          avatar: msg.sender.avatar,
        },
        messages: [
          {
            type: msg.type,
            content: msg.message,
            id: msg.id,
            status: msg.status || "sent",
          },
        ],
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

  useEffect(() => {
    if (groupedMessages.length > 0 && !isFetchingOlder && messagesPage === 0) {
      scrollToBottom();
    }
  }, [groupedMessages, messagesPage, isFetchingOlder]);

  const handleScroll = async () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (
      container.scrollTop <= 10 &&
      hasMoreMessages &&
      !isFetchingOlder &&
      messagesStatus !== "loading"
    ) {
      setIsFetchingOlder(true);

      const previousScrollHeight = container.scrollHeight;

      await dispatch(
        fetchMessagesByConversationId({
          conversationId: activeConversationId!,
          page: messagesPage + 1,
          size: 20,
        }),
      );

      setTimeout(() => {
        if (scrollContainerRef.current) {
          const newScrollHeight = scrollContainerRef.current.scrollHeight;
          scrollContainerRef.current.scrollTop =
            newScrollHeight - previousScrollHeight;
        }
        setIsFetchingOlder(false);
      }, 50);
    }
  };

  if (!user) {
    return (
      <div className="flex h-[calc(100vh-70px)] w-full items-center justify-center bg-white/50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    // [THAY ĐỔI] Thêm `relative` để làm anchor cho overlay sidebar trên mobile
    <div className="relative flex h-[calc(100vh-70px)] w-full bg-white font-sans text-gray-800 overflow-hidden">
      {/* Khung chat chính - luôn chiếm full width, sidebar sẽ overlay lên trên mobile */}
      <div className="flex flex-col flex-1 h-full min-w-0 bg-white">
        {!activeConversationId ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 px-4">
            <div className="bg-blue-50 p-6 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
              {t("chat.main.noActiveChatTitle", "Looking empty here...")}
            </h3>
            <p className="text-gray-500 text-center text-sm">
              {t(
                "chat.main.noActiveChatDesc",
                "Select a conversation to start messaging.",
              )}
            </p>
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

            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col"
            >
              {isFetchingOlder && (
                <div className="flex justify-center py-2">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {messagesStatus === "loading" ? (
                <div className="flex-1 flex justify-center items-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : groupedMessages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                  <div className="bg-blue-50 p-6 rounded-full mb-4">
                    <svg
                      className="w-12 h-12 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                    {t("chat.main.noMessagesTitle", "No messages yet")}
                  </h3>
                  <p className="text-gray-500 text-center text-sm">
                    {t(
                      "chat.main.noMessagesDesc",
                      "Be the first to send a message.",
                    )}
                  </p>
                </div>
              ) : (
                groupedMessages.map((group, index) => {
                  let showTime = false;

                  if (index === 0) {
                    showTime = true;
                  } else {
                    const prevGroup = groupedMessages[index - 1];
                    const currentTimestamp = new Date(
                      group.timestamp,
                    ).getTime();
                    const prevTimestamp = new Date(
                      prevGroup.timestamp,
                    ).getTime();
                    const diffInMinutes =
                      (currentTimestamp - prevTimestamp) / (1000 * 60);

                    if (diffInMinutes > 30) {
                      showTime = true;
                    }
                  }

                  return (
                    <React.Fragment key={group.id}>
                      {showTime && (
                        <div className="text-center text-xs font-medium text-gray-400 my-4 uppercase tracking-wide">
                          {formatTimestamp(
                            group.timestamp,
                            i18n.language === "en" ? "en-US" : "vi-VN",
                          )}
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
              <div ref={messagesEndRef} />
            </div>

            <ChatInput />
          </>
        )}
      </div>

      {/*
        [THAY ĐỔI CHÍNH] Overlay backdrop - chỉ hiện trên mobile khi sidebar mở.
        Click vào backdrop sẽ đóng sidebar.
        - Trên md+ : ẩn hoàn toàn (hidden md:hidden), sidebar dùng layout bình thường
      */}
      {isSidebarOpen && (
        <div
          className="absolute inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/*
        [THAY ĐỔI CHÍNH] Sidebar:
        - Mobile (< md): absolute, chiếm full màn hình hoặc w-[85vw] max-w-sm,
          trượt từ phải vào, z-index cao hơn backdrop
        - Desktop (md+): relative, inline, w-80 như cũ
      */}
      <ChatListSidebar
        isOpen={isSidebarOpen}
        currentUserId={user?.id ?? ""}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};

export default MessagesPage;
