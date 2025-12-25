import { useState } from "react";

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
    placeholder = "What are your thoughts?",
    initialValue = "",
    isReply = false,
    autoFocus = false,
    onCancel,
    onSubmit
}: CommentInputProps) {
    const [text, setText] = useState(initialValue);

    const handleSubmit = () => {
        if (!text.trim()) return;
        onSubmit(text);
        setText(""); 
    };

    return (
        <div className={`w-full ${isReply ? 'animate-in fade-in slide-in-from-top-2 duration-200' : ''}`}>
            <div className="flex items-start gap-3">
                {isReply && <img src={currentUser.avatar} alt="Me" className="w-8 h-8 rounded-full mt-1" />}

                <div className="w-full">
                    {!isReply && (
                        <div className="flex items-center gap-3 mb-4">
                            <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
                            <div className="font-bold text-gray-900">{currentUser.name}</div>
                        </div>
                    )}

                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={placeholder}
                        autoFocus={autoFocus}
                        className={`w-full bg-gray-100 border-none rounded-xl p-4 resize-none text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 text-base ${isReply ? 'h-20 text-sm p-3 mb-2' : 'h-24 mb-2'}`}
                    />

                    <div className={`flex items-center gap-2 ${isReply ? 'justify-end' : 'justify-end'}`}>
                        {isReply && onCancel && (
                            <button
                                onClick={onCancel}
                                className="px-3 py-1.5 text-gray-500 text-sm font-medium hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
                            >
                                Cancel
                            </button>
                        )}
                        {text.trim() && (
                            <button
                                onClick={handleSubmit}
                                className={`bg-black text-white rounded-full font-medium hover:bg-gray-800 transition ${isReply ? 'px-4 py-1.5 text-sm' : 'px-4 py-2 text-sm'}`}
                            >
                                {isReply ? 'Reply' : 'Respond'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}