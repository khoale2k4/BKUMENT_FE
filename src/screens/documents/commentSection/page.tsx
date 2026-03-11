'use client'

import { useState, useCallback } from "react";
import { fetchCommentsByDocId, submitCommentAsync } from "@/lib/redux/features/documentSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { CommentInput } from "./CommentInput";
import { CommentItem } from "./CommentItem";

export default function CommentSection({ params }: { params: { id: string } }) {
    const dispatch = useAppDispatch();

    const { comments, commentsStatus, commentsPage, commentsTotalPages } = useAppSelector((state) => state.documents);

    const [replyingToId, setReplyingToId] = useState<string | number | null>(null);

    const currentUser = {
        name: "Ly Thanh Nhat Quang",
        avatar: "https://placehold.co/40x40/orange/white?text=L",
    };

    const handleSendMainComment = useCallback((text: string) => {
        dispatch(submitCommentAsync({
            resourceId: params.id,
            content: text,
            replyId: null
        }));
    }, [dispatch, params.id]);

    const handleSendReply = useCallback(async (parentId: string | number, text: string) => {
        const cleanText = text.replace(/^@\S+\s/, '');

        await dispatch(submitCommentAsync({
            resourceId: params.id,
            content: cleanText,
            replyId: parentId.toString()
        })).unwrap();

        setReplyingToId(null);
    }, [dispatch, params.id]);

    const handleLoadMore = () => {
        if (commentsStatus !== 'loading') {
            dispatch(fetchCommentsByDocId({
                documentId: params.id,
                page: commentsPage + 1,
                size: 5
            }));
        }
    };

    if (commentsStatus === 'loading' && commentsPage === 0) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (commentsStatus === 'failed') {
        return <div className="text-center py-8 text-red-500">Failed to load comments.</div>;
    }

    return (
        <div className="mt-12 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-8">Responses ({comments.length})</h3>

            <div className="bg-white mb-8 border-b border-gray-100 pb-6">
                <CommentInput
                    currentUser={currentUser}
                    onSubmit={handleSendMainComment}
                />
            </div>

            <div className="space-y-8">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        currentUser={currentUser}
                        numberOfChildComment={comment.numberOfChildComment}
                        isReplying={replyingToId === comment.id}
                        onReplyClick={(id) => setReplyingToId(id)}
                        onCancelReply={() => setReplyingToId(null)}
                        onSubmitReply={handleSendReply}
                    />
                ))}
            </div>

            {commentsPage < commentsTotalPages - 1 && (
                <div className="mt-8 text-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={commentsStatus === 'loading'}
                        className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {commentsStatus === 'loading' ? 'Đang tải...' : 'Xem thêm bình luận'}
                    </button>
                </div>
            )}
        </div>
    );
}