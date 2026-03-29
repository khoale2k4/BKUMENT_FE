"use client";

import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";
import { AlertCircle } from "lucide-react";
import React from "react";

export interface MessageItem {
    id: string;
    type: string;
    content: string;
    status?: 'sending' | 'sent' | 'error'; 
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
    
    const renderMessageContent = (msg: MessageItem, index: number, isSelf: boolean) => {
        const isSending = msg.status === 'sending';
        const isError = msg.status === 'error';
        
        const opacityClass = isSending ? "opacity-60" : "opacity-100";
        const errorBorderClass = isError ? "border-2 border-red-500" : "";

        if (msg.type === 'image' || msg.type === 'IMAGE') {
            return (
                <div key={msg.id || index} className={`mb-1 flex items-end gap-2 ${isSelf ? 'flex-row-reverse' : ''}`}>
                    <AuthenticatedImage 
                        src={msg.content} 
                        alt="Shared image" 
                        className={`rounded-2xl max-w-[280px] sm:max-w-md object-cover border border-gray-200 transition-opacity ${opacityClass} ${errorBorderClass}`} 
                    />
                    {isError && <span className="text-xs text-red-500 font-medium whitespace-nowrap"><AlertCircle size={14} className="inline mr-1"/>Lỗi</span>}
                    {isSending && <span className="text-xs text-gray-400 whitespace-nowrap">Đang gửi...</span>}
                </div>
            );
        }
        
        return (
            <div key={msg.id || index} className={`flex items-end gap-2 mb-1 ${isSelf ? 'flex-row-reverse' : ''}`}>
                <div 
                    className={`${isSelf ? 'bg-gray-200 text-gray-900' : 'bg-gray-50 text-gray-900'} 
                    px-4 py-2 rounded-2xl w-fit text-[15px] break-words max-w-[85%] md:max-w-md transition-opacity ${opacityClass} ${errorBorderClass}`}
                >
                    {msg.content}
                </div>
                
                {isSelf && isError && (
                    <span className="text-xs text-red-500 font-medium whitespace-nowrap flex items-center">
                        <AlertCircle size={14} className="mr-1"/> Lỗi
                    </span>
                )}
                {isSelf && isSending && (
                    <span className="text-xs text-gray-400 whitespace-nowrap">Đang gửi...</span>
                )}
            </div>
        );
    };

    if (isSelf) {
        return (
            <div className="flex flex-col items-end gap-1 mb-4">
                {messages.map((msg, index) => renderMessageContent(msg, index, true))}
            </div>
        );
    }

    return (
        <div className="flex gap-3 mb-4 max-w-lg">
            <AuthenticatedImage src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover mt-6 shrink-0" />
            <div className="flex flex-col gap-1 w-full min-w-0 items-start">
                <span className="text-sm text-gray-500 ml-1">{user.name}</span>
                {messages.map((msg, index) => renderMessageContent(msg, index, false))}
            </div>
        </div>
    );
};

export default MessageGroup;