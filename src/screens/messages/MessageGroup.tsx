"use client";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import React from "react";

export interface MessageItem {
  id: string;
  type: string;
  content: string;
  status?: "sending" | "sent" | "error";
}

interface UserInfo {
  name: string;
  avatar: string;
}

interface MessageGroupProps {
  isSelf: boolean;
  user: UserInfo;
  messages: MessageItem[];
}

const MessageGroup = ({ isSelf, user, messages }: MessageGroupProps) => {
  const { t } = useTranslation();

  const renderMessageContent = (
    msg: MessageItem,
    index: number,
    isSelf: boolean,
  ) => {
    const isSending = msg.status === "sending";
    const isError = msg.status === "error";

    const opacityClass = isSending ? "opacity-60" : "opacity-100";
    const errorBorderClass = isError ? "border-2 border-red-500" : "";

    // --- LOGIC BO GÓC CHUẨN MESSENGER ---
    const isFirst = index === 0;
    const isLast = index === messages.length - 1;

    let bubbleShape = "rounded-2xl"; // Mặc định bo tròn đều nếu chỉ có 1 tin nhắn
    if (messages.length > 1) {
      if (isSelf) {
        if (isFirst) bubbleShape = "rounded-2xl rounded-br-[4px]";
        else if (isLast) bubbleShape = "rounded-2xl rounded-tr-[4px]";
        else bubbleShape = "rounded-2xl rounded-r-[4px]";
      } else {
        if (isFirst) bubbleShape = "rounded-2xl rounded-bl-[4px]";
        else if (isLast) bubbleShape = "rounded-2xl rounded-tl-[4px]";
        else bubbleShape = "rounded-2xl rounded-l-[4px]";
      }
    }

    if (msg.type === "image" || msg.type === "IMAGE") {
      return (
        // [SỬA]: mb-[2px] để các ảnh sát nhau hơn
        <div
          key={msg.id || index}
          className={`mb-[2px] flex items-end gap-2 ${isSelf ? "flex-row-reverse" : ""}`}
        >
          <AuthenticatedImage
            src={msg.content}
            alt={t("chat.message.sharedImage", "Shared image")}
            className={`rounded-2xl max-w-[200px] sm:max-w-xs object-cover border border-gray-100 transition-opacity ${opacityClass} ${errorBorderClass} ${bubbleShape}`}
          />
          {isError && (
            <span className="text-xs text-red-500 font-medium whitespace-nowrap">
              <AlertCircle size={14} className="inline mr-1" />
              {t("chat.message.error", "Error")}
            </span>
          )}
          {isSending && (
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {t("chat.message.sending", "Sending...")}
            </span>
          )}
        </div>
      );
    }

    return (
      // [SỬA]: Đổi mb-1 thành mb-[2px] để các tin nhắn liền mạch
      <div
        key={msg.id || index}
        className={`flex items-end gap-2 mb-[2px] ${isSelf ? "flex-row-reverse" : ""}`}
      >
        <div
          className={`${isSelf ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"} 
                px-4 py-2 rounded-2xl w-fit text-[15px] break-words 
                /* [SỬA ĐỔI Ở ĐÂY]: Tăng từ md:max-w-md lên md:max-w-xl hoặc md:max-w-[70%] */
                max-w-[90%] md:max-w-xl 
                transition-opacity ${opacityClass} ${errorBorderClass}`}
        >
          {msg.content}
        </div>

        {isSelf && isError && (
          <span className="text-xs text-red-500 font-medium whitespace-nowrap flex items-center">
            <AlertCircle size={14} className="mr-1" />{" "}
            {t("chat.message.error", "Error")}
          </span>
        )}
        {isSelf && isSending && (
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {t("chat.message.sending", "Sending...")}
          </span>
        )}
      </div>
    );
  };

  if (isSelf) {
    return (
      // [SỬA]: Bỏ gap-1, dùng mb-4 để cách nhóm tin nhắn này với nhóm tin nhắn khác
      <div className="flex flex-col items-end mb-4">
        {messages.map((msg, index) => renderMessageContent(msg, index, true))}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 mb-4 max-w-lg">
      {/* [SỬA]: Avatar căn dưới cùng (items-end) giống Messenger thay vì mt-6 */}
      <AuthenticatedImage
        src={user.avatar}
        alt={user.name}
        className="w-7 h-7 rounded-full object-cover shrink-0 mb-[2px]"
      />
      <div className="flex flex-col w-full min-w-0 items-start">
        <span className="text-[12px] text-gray-500 ml-1 mb-1">{user.name}</span>
        {messages.map((msg, index) => renderMessageContent(msg, index, false))}
      </div>
    </div>
  );
};

export default MessageGroup;
