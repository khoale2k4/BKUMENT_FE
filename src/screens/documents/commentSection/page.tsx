'use client'

import { useEffect, useState, useCallback } from "react";
import { fetchCommentsByDocId } from "@/lib/redux/features/documentSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { CommentInput } from "./CommentInput";
import { CommentItem } from "./CommentItem";

export default function CommentSection({ params }: { params: { id: string } }) {
    const dispatch = useAppDispatch();
    const { comments, detailStatus } = useAppSelector((state) => state.documents);
    
    const [replyingToId, setReplyingToId] = useState<string | number | null>(null);

    const currentUser = {
        name: "Ly Thanh Nhat Quang",
        avatar: "https://placehold.co/40x40/orange/white?text=L",
    };

    useEffect(() => {
        if (params.id) {
            dispatch(fetchCommentsByDocId(params.id));
        }
    }, [params.id, dispatch]);

    const handleSendMainComment = useCallback((text: string) => {
        console.log("Sending main comment:", text);
        dispatch(fetchCommentsByDocId(params.id));
    }, [dispatch, params.id]);

    const handleSendReply = useCallback((parentId: string | number, text: string) => {
        console.log(`Sending reply to ${parentId}:`, text);
        dispatch(fetchCommentsByDocId(params.id));
        setReplyingToId(null);
    }, [dispatch, params.id]);

    if (detailStatus === 'loading') {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (detailStatus === 'failed') {
        return <div className="text-center py-8 text-red-500">Failed to load comments.</div>;
    }

    return (
        <div className="mt-12 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-8">Responses({comments.length})</h3>

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
                        isReplying={replyingToId === comment.id}
                        onReplyClick={(id) => setReplyingToId(id)}
                        onCancelReply={() => setReplyingToId(null)}
                        onSubmitReply={handleSendReply}
                    />
                ))}
            </div>

            {comments.length > 0 && (
                <div className="mt-8">
                    <button className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-gray-400 transition">
                        See all responses
                    </button>
                </div>
            )}
        </div>
    );
}