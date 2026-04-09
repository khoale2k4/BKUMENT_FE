import { memo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { CommentInput } from "./CommentInput";
import { formatDate } from "@/lib/utils/formatDate";
import { Comment } from "@/lib/services/comment.service";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";
import { useAppDispatch } from "@/lib/redux/hooks";
import { fetchReplies } from "@/lib/redux/features/commentSlice";

interface User {
    name: string;
    avatar: string;
}

interface CommentItemProps {
    comment: Comment;
    currentUser: User;
    isReplying: boolean;
    onReplyClick: (id: string | number, username: string) => void;
    onCancelReply: () => void;
    numberOfChildComment: number;
    onSubmitReply: (parentId: string | number, text: string) => void;
    isChild?: boolean; 
}

import { useTranslation } from "react-i18next";

export const CommentItem = memo(function CommentItem({
    comment,
    currentUser,
    isReplying,
    onReplyClick,
    onCancelReply,
    numberOfChildComment,
    onSubmitReply,
    isChild = false
}: CommentItemProps) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    
    const [showReplies, setShowReplies] = useState(false);

    const replies = comment.replies || [];
    const repliesPage = comment.repliesPage || 0;
    const repliesTotalPages = comment.repliesTotalPages || 0;
    const isLoadingReplies = comment.isLoadingReplies || false;

    const handleToggleReplies = () => {
        if (!showReplies && (replies.length === 0 || repliesPage === 0)) {
            dispatch(fetchReplies({ parentId: comment.id.toString(), page: 0, size: 5 }));
        }
        setShowReplies(!showReplies);
    };
    
    const handleLoadMoreReplies = () => {
        dispatch(fetchReplies({ parentId: comment.id.toString(), page: repliesPage + 1, size: 5 }));
    }

    return (
        <div className={`pb-6 ${!isChild ? 'border-b border-gray-100 last:border-none' : 'mt-4'}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    {comment.avatar && <AuthenticatedImage src={comment.avatar} alt={comment.user} className="w-10 h-10 rounded-full object-cover" />}
                    {!comment.avatar && <img src={comment.avatar} alt={comment.user} className="w-10 h-10 rounded-full object-cover" />}
                    <div>
                        <div className="font-bold text-gray-900">{comment.user}</div>
                        <div className="text-sm text-gray-500">{formatDate(comment.time)}</div>
                    </div>
                </div>
            </div>

            <p className="text-gray-800 text-base leading-relaxed mb-4">{comment.content}</p>

            <div className="flex items-center gap-6 text-gray-500">
                {!isChild && (
                    <button 
                        onClick={handleToggleReplies}
                        className="flex items-center gap-2 hover:text-gray-900 transition"
                    >
                        <MessageCircle size={20} />
                        <span className="text-sm font-medium">
                            {showReplies ? t('common.actions.hideReplies') : t('common.actions.viewReplies', { count: numberOfChildComment })}
                        </span>
                    </button>
                )}
                
                {!isChild && <button
                    onClick={() => onReplyClick(comment.id, comment.user)}
                    className="text-sm font-medium hover:text-gray-900 transition"
                >
                    {t('common.actions.reply')}
                </button>}
            </div>

            {isReplying && (
                <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200">
                    <CommentInput
                        currentUser={currentUser}
                        isReply={true}
                        autoFocus={true}
                        initialValue={`@${comment.user} `}
                        onCancel={onCancelReply}
                        onSubmit={(text) => onSubmitReply(comment.id, text)}
                    />
                </div>
            )}

            {!isChild && showReplies && (
                <div className="mt-4 ml-4 md:ml-12 pl-4 border-l-2 border-gray-100 space-y-2">
                    {isLoadingReplies && repliesPage === 0 ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                            {t('common.loading')}
                        </div>
                    ) : replies.length > 0 ? (
                        <>
                            {replies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    currentUser={currentUser}
                                    isReplying={false}
                                    onReplyClick={onReplyClick} 
                                    numberOfChildComment={reply.numberOfChildComment || 0} // Hoặc 0
                                    onCancelReply={onCancelReply}
                                    onSubmitReply={onSubmitReply}
                                    isChild={true} 
                                />
                            ))}
                            
                            {repliesPage < repliesTotalPages - 1 && (
                                <button
                                    onClick={handleLoadMoreReplies}
                                    disabled={isLoadingReplies}
                                    className="text-sm text-blue-600 font-medium hover:underline disabled:opacity-50 mt-2"
                                >
                                    {isLoadingReplies ? t('common.loading') : t('common.actions.loadMoreReplies')}
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="text-sm text-gray-500 py-2">
                            {t('layout.header.notifications.noReplies')}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});