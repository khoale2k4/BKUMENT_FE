'use client'

import { useState, useCallback, useEffect } from "react";
import { fetchComments, submitComment, clearComments } from "@/lib/redux/features/commentSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { CommentInput } from "./CommentInput";
import { CommentItem } from "./CommentItem";
import { useTranslation } from "react-i18next";

export default function CommentSection({ params }: { params: { id: string } }) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const { comments, status, page, totalPages } = useAppSelector((state) => state.comments);

    useEffect(() => {
        dispatch(fetchComments({ resourceId: params.id, page: 0, size: 5 }));
        
        return () => {
            dispatch(clearComments());
        };
    }, [dispatch, params.id]);

    const [replyingToId, setReplyingToId] = useState<string | number | null>(null);

    const currentUser = {
        name: "Ly Thanh Nhat Quang",
        avatar: "https://placehold.co/40x40/orange/white?text=L",
    };

    const handleSendMainComment = useCallback((text: string) => {
        dispatch(submitComment({
            resourceId: params.id,
            content: text,
            replyId: null
        }));
    }, [dispatch, params.id]);

    const handleSendReply = useCallback(async (parentId: string | number, text: string) => {
        const cleanText = text.replace(/^@\S+\s/, '');

        await dispatch(submitComment({
            resourceId: params.id,
            content: cleanText,
            replyId: parentId.toString()
        })).unwrap();

        setReplyingToId(null);
    }, [dispatch, params.id]);

    const handleLoadMore = () => {
        if (status !== 'loading') {
            dispatch(fetchComments({
                resourceId: params.id,
                page: page + 1,
                size: 5
            }));
        }
    };

    if (status === 'loading' && page === 0) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (status === 'failed') {
        return <div className="text-center py-8 text-red-500">{t('common.errors.loadFailed', 'Lỗi khi tải dữ liệu.')}</div>;
    }

    return (
        <div className="mt-12 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-8">{t('documents.detail.comments')} ({comments.length})</h3>

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

            {page < totalPages - 1 && (
                <div className="mt-8 text-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={status === 'loading'}
                        className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? t('common.loading') : t('common.actions.loadMoreComments')}
                    </button>
                </div>
            )}
        </div>
    );
}