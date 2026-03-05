"use client";

import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { sendImageMessageAsync, sendMessageAsync } from "@/lib/redux/features/chatSlice";

const ChatInput = () => {
    const [text, setText] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const activeConversationId = useSelector((state: RootState) => state.chat.activeConversationId);

    const handleSendMessage = () => {
        if (!text.trim() || !activeConversationId) return;

        dispatch(sendMessageAsync({
            conversationId: activeConversationId,
            message: text.trim(),
            type: 'TEXT'
        }));

        setText("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing) {
            return;
        }

        if (e.key === 'Enter') {
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

        if (!file.type.startsWith('image/')) {
            alert("Vui lòng chọn định dạng ảnh!");
            return;
        }

        setIsUploading(true);
        try {
            await dispatch(sendImageMessageAsync({
                conversationId: activeConversationId,
                file: file
            })).unwrap();
        } catch (error) {
            alert("Gửi ảnh thất bại!");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="p-4 bg-white border-t border-gray-100 shrink-0"><input 
                type="file" 
                ref={fileInputRef} 
                hidden 
                accept="image/*" 
                onChange={handleFileChange} 
            />

            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                
                <button 
                    onClick={handleImageBtnClick}
                    disabled={isUploading}
                    className="text-gray-500 hover:text-blue-500 transition-colors disabled:opacity-50"
                >
                    {isUploading ? (
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    )}
                </button>
                
                <input
                    type="text"
                    placeholder="Aa"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent outline-none py-1 text-gray-800"
                />
                
                <button 
                    onClick={handleSendMessage}
                    disabled={!text.trim()} 
                    className={`ml-2 transition-colors ${text.trim() ? "text-gray-500 hover:text-gray-700" : "text-gray-300"}`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                </button>
                
            </div>
        </div>
    );
};

export default ChatInput;