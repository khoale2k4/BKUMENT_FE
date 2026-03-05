"use client";

import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";
import React from "react";

export interface MessageItem {
    id: string;
    type: string;
    content: string;
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
        if (msg.type === 'image') {
            return (
                <div key={msg.id || index} className="mb-1">
                    <AuthenticatedImage src={msg.content} alt="Shared image" className="rounded-2xl max-w-[280px] sm:max-w-md object-cover border border-gray-200" />
                </div>
            );
        }
        
        return (
            <div key={msg.id || index} className={`${isSelf ? 'bg-gray-200 text-gray-900' : 'bg-gray-50 text-gray-900'} px-4 py-2 rounded-2xl w-fit text-[15px] break-words max-w-[85%] md:max-w-md mb-1`}>
                {msg.content}
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
            <div className="flex flex-col gap-1 w-full min-w-0">
                <span className="text-sm text-gray-500 ml-1">{user.name}</span>
                {messages.map((msg, index) => renderMessageContent(msg, index, false))}
            </div>
        </div>
    );
};

export default MessageGroup;