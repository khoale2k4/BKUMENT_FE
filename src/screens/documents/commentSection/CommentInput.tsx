import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";
import { useAppSelector } from "@/lib/redux/hooks";
import { useState, useRef, useEffect } from "react";

import { useTranslation } from "react-i18next";

interface CommentInputProps {
    currentUser: User;
    placeholder?: string;
    initialValue?: string;
    isReply?: boolean;
    autoFocus?: boolean;
    onCancel?: () => void;
    onSubmit: (text: string) => void;
}

export function CommentInput({
    currentUser,
    placeholder,
    initialValue = "",
    isReply = false,
    autoFocus = false,
    onCancel,
    onSubmit
}: CommentInputProps) {
    const { t } = useTranslation();
    const [text, setText] = useState(initialValue);
    const { user } = useAppSelector((state) => state.profile);
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.focus();
            
            const textLength = textarea.value.length;
            textarea.setSelectionRange(textLength, textLength);
        }
    }, [autoFocus]);

    const handleSubmit = () => {
        if (!text.trim()) return;
        onSubmit(text);
        setText(""); 
    };

    const displayName = user ? `${user.lastName || ''} ${user.firstName || ''}`.trim() || user.fullName : currentUser.name;
    const avatarUrl = user?.avatarUrl;

    return (
        <div className={`w-full ${isReply ? 'animate-in fade-in slide-in-from-top-2 duration-200' : ''}`}>
            <div className="flex items-start gap-3">
                
                {isReply && (
                    avatarUrl 
                        ? <AuthenticatedImage src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full mt-1 object-cover" />
                        : <img src={currentUser.avatar} alt={displayName} className="w-8 h-8 rounded-full mt-1 object-cover" />
                )}

                <div className="w-full">
                    {!isReply && (
                        <div className="flex items-center gap-3 mb-4">
                            {avatarUrl 
                                ? <AuthenticatedImage src={avatarUrl} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
                                : <img src={currentUser.avatar} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
                            }
                            <div className="font-bold text-gray-900">{displayName}</div>
                        </div>
                    )}

                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={placeholder || t('common.placeholders.comment')}
                        className={`w-full bg-gray-100 border-none rounded-xl p-4 resize-none text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 text-base ${isReply ? 'h-20 text-sm p-3 mb-2' : 'h-24 mb-2'}`}
                    />

                    <div className={`flex items-center gap-2 justify-end`}>
                        {isReply && onCancel && (
                            <button
                                onClick={onCancel}
                                className="px-3 py-1.5 text-gray-500 text-sm font-medium hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
                            >
                                {t('common.confirm.cancel')}
                            </button>
                        )}
                        {text.trim() && (
                            <button
                                onClick={handleSubmit}
                                className={`bg-black text-white rounded-full font-medium hover:bg-gray-800 transition ${isReply ? 'px-4 py-1.5 text-sm' : 'px-4 py-2 text-sm'}`}
                            >
                                {isReply ? t('common.actions.reply') : t('common.actions.postComment')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}