import { memo } from "react";
import { Clapperboard, HandHeart, MessageCircle, MoreHorizontal } from "lucide-react";
import { CommentInput } from "./CommentInput";
import { formatDate } from "@/utils/formatDate";

interface CommentItemProps {
    comment: AppComment;
    currentUser: User;
    isReplying: boolean;
    onReplyClick: (id: string | number, username: string) => void;
    onCancelReply: () => void;
    onSubmitReply: (parentId: string | number, text: string) => void;
}

export const CommentItem = memo(function CommentItem({
    comment,
    currentUser,
    isReplying,
    onReplyClick,
    onCancelReply,
    onSubmitReply
}: CommentItemProps) {
    return (
        <div className="border-b border-gray-100 pb-6 last:border-none">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <img src={comment.avatar} alt={comment.user} className="w-10 h-10 rounded-full" />
                    <div>
                        <div className="font-bold text-gray-900">{comment.user}</div>
                        <div className="text-sm text-gray-500">{formatDate(comment.time)}</div>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <p className="text-gray-800 text-base leading-relaxed mb-4">{comment.content}</p>

            <div className="flex items-center gap-6 text-gray-500">
                <button className="flex items-center gap-2 hover:text-gray-900 transition">
                    <HandHeart size={20} />
                    <span className="text-sm font-medium">
                        {comment.likes > 0 ? `${comment.likes} claps` : 'Clap'}
                    </span>
                </button>
                <button className="flex items-center gap-2 hover:text-gray-900 transition">
                    <MessageCircle size={20} />
                    <span className="text-sm font-medium">6 replies</span>
                </button>
                <button
                    onClick={() => onReplyClick(comment.id, comment.user)}
                    className="text-sm font-medium hover:text-gray-900 transition"
                >
                    Reply
                </button>
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
        </div>
    );
});