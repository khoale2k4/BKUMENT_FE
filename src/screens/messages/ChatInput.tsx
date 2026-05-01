import { useTranslation } from "react-i18next";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  sendImageMessageAsync,
  sendMessageAsync,
} from "@/lib/redux/features/chatSlice";
import { DateTime } from "luxon";

const ChatInput = () => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const activeConversationId = useSelector(
    (state: RootState) => state.chat.activeConversationId,
  );

  const handleSendMessage = () => {
    if (!text.trim() || !activeConversationId) return;

    dispatch(
      sendMessageAsync({
        conversationId: activeConversationId,
        message: text.trim(),
        type: "TEXT",
        tempId: DateTime.now().toString(),
      }),
    );

    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageBtnClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeConversationId) return;

    if (!file.type.startsWith("image/")) {
      alert(t("chat.input.imageFormatError", "Please select an image format!"));
      return;
    }

    setIsUploading(true);
    try {
      await dispatch(
        sendImageMessageAsync({
          conversationId: activeConversationId,
          file: file,
        }),
      ).unwrap();
    } catch (error) {
      alert(t("chat.input.sendImageFail", "Failed to send image!"));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    /*
          [THAY ĐỔI] Padding responsive: p-3 trên mobile, p-4 trên sm+.
          Thêm `safe-area` mental note: padding-bottom tự nhiên qua p-3.
        */
    <div className="p-3 sm:p-4 bg-white border-t border-gray-100 shrink-0">
      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*"
        onChange={handleFileChange}
      />

      {/*
              [THAY ĐỔI] `gap-2` trên mobile thay vì gap-3 để tận dụng không gian 390px.
              `min-w-0` trên wrapper để flex child không overflow.
              Không đặt padding quá lớn trên mobile.
            */}
      <div className="flex items-center gap-2 sm:gap-3 bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-2 shadow-sm min-w-0">
        {/*
                  [THAY ĐỔI] shrink-0 để icon không bị thu nhỏ/méo trên màn hình nhỏ.
                  Bỏ `ml-` margin thừa, dùng gap của flex parent thay thế.
                */}
        <button
          onClick={handleImageBtnClick}
          disabled={isUploading}
          className="shrink-0 text-gray-500 hover:text-blue-500 active:text-blue-600 transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          )}
        </button>

        {/*
                  [THAY ĐỔI] `min-w-0` để input text co giãn đúng trong flex container,
                  không bị tràn ngang trên iPhone 12 Pro.
                  Font size text-sm trên mobile để vừa hơn, text-[15px] trên sm+.
                */}
        <input
          type="text"
          placeholder={t("chat.input.placeholder", "Type a message...")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 bg-transparent outline-none py-1 text-sm sm:text-[15px] text-gray-800 placeholder:text-gray-400"
        />

        {/*
                  [THAY ĐỔI] shrink-0 để nút send không bị bóp.
                  Bỏ `ml-2` vì đã có gap từ flex parent.
                  Icon nhỏ hơn trên mobile: w-5 h-5.
                */}
        <button
          onClick={handleSendMessage}
          disabled={!text.trim()}
          className={`shrink-0 transition-colors ${text.trim() ? "text-blue-500 hover:text-blue-600 active:text-blue-700" : "text-gray-300"}`}
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
              strokeWidth="1.5"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
