"use client";

import { useTranslation } from 'react-i18next';
import { formatTimeAgo } from "@/lib/utils/formatTimeAgo";
import { CardProp } from "./props";
import { BookmarkPlus, MoreHorizontal } from "lucide-react";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { openConfirmModal, openReportModal } from "@/lib/redux/features/modalSlice";
import { showToast } from "@/lib/redux/features/toastSlice";
import { deleteDocumentAsync } from "@/lib/redux/features/myDocumentSlice";
import { Flag, Share2, Trash2 } from "lucide-react";
import { clsx } from "clsx";

export default function ContentCard({ data }: { data: CardProp }) {
    const { t } = useTranslation();
    const timeRead = Math.ceil((data?.content?.split(" ")?.length || 0) / 200) || 1;

    const authorName = 'Unknown';

    const avatarUrl = "https://placehold.co/100x100/3b82f6/white?text=A";

    return (
        <div className="py-6 border-b border-gray-100 last:border-none w-full max-w-3xl cursor-pointer" onClick={() => data?.onClick?.(data.id)}>
            <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    {data.author.avatarUrl && <AuthenticatedImage src={data.author.avatarUrl} className="w-full h-full object-cover" />}
                    {!data.author.avatarUrl && <img
                        src={data.author.avatarUrl}
                        alt="avatar"
                        className="w-full h-full object-cover"
                    />}
                </div>
                <div className="flex items-center text-[13px] leading-none">
                    <span className="font-medium text-gray-900">{data.author.name}</span>
                    <span className="mx-1 text-gray-400">·</span>
                    <span className="text-gray-500">{data?.time ? formatTimeAgo(data.time, t) : ''}</span>
                </div>
            </div>

            <div className="flex justify-between gap-8 mb-8">
                <div className="flex-1 flex flex-col justify-center">
                    <h2 className="text-[22px] font-bold text-gray-900 mb-1 leading-snug hover:underline decoration-1 underline-offset-2">
                        {data?.title}
                    </h2>
                    <p className="text-gray-500 text-base line-clamp-2 leading-relaxed font-normal font-sans">
                        {data?.content}
                    </p>
                </div>

                {data?.coverImage && (
                    <div className="w-28 h-28 sm:w-36 sm:h-28 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                        <AuthenticatedImage src={data.coverImage} alt={data.title || 'cover'} className="w-full h-full object-cover" />
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    {data?.tags?.[0] && (
                        <span className="bg-[#F2F2F2] text-gray-700 text-[13px] px-3 py-1 rounded-full hover:bg-gray-200 transition">
                            {data.tags[0]}
                        </span>
                    )}

                    <span className="text-[13px] text-gray-500">{t('home.contentCard.minRead', '{{count}} min read', { count: timeRead })}</span>
                </div>

                <div className="flex items-center gap-4 text-gray-500 relative">
                    <button 
                        className="hover:text-gray-900 transition flex items-center justify-center p-1.5 hover:bg-gray-100 rounded-full"
                        onClick={(e) => { e.stopPropagation(); }}
                    >
                        <BookmarkPlus size={20} strokeWidth={1.5} />
                    </button>
                    
                    <ActionsMenu data={data} />
                </div>
            </div>
        </div>
    );
}

function ActionsMenu({ data }: { data: CardProp }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(state => state.profile.user);
    const isOwner = currentUser?.id === data.author.id;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        const url = `${window.location.origin}/documents/${data.id}`;
        navigator.clipboard.writeText(url);
        dispatch(showToast({
            type: 'success',
            title: 'Thành công',
            message: 'Đã sao chép đường dẫn!'
        }));
    };

    const handleReport = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        dispatch(openReportModal({ targetId: data.id, type: 'DOCUMENT' }));
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        dispatch(openConfirmModal({
            title: "Xóa tài liệu",
            message: `Bạn có chắc chắn muốn xóa "${data.title}"? Hành động này không thể hoàn tác.`,
            confirmText: "Xóa",
            cancelText: "Hủy",
            onConfirm: () => {
                dispatch(deleteDocumentAsync(data.id));
            }
        }));
    };

    return (
        <div className="relative" ref={menuRef}>
            <button 
                className={clsx(
                    "hover:text-gray-900 transition flex items-center justify-center p-1.5 hover:bg-gray-100 rounded-full cursor-pointer",
                    isOpen && "bg-gray-100 text-gray-900"
                )}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
            >
                <MoreHorizontal size={20} strokeWidth={1.5} />
            </button>

            {isOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <button
                        onClick={handleShare}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Share2 size={16} />
                        Chia sẻ
                    </button>
                    
                    <button
                        onClick={handleReport}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Flag size={16} />
                        Báo cáo
                    </button>

                    {isOwner && (
                        <>
                            <div className="h-px bg-gray-100 my-1 mx-2" />
                            <button
                                onClick={handleDelete}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                            >
                                <Trash2 size={16} />
                                Xóa tài liệu
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}