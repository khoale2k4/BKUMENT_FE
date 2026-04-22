"use client";

import { useTranslation } from 'react-i18next';
import { formatTimeAgo } from "@/lib/utils/formatTimeAgo";
import { CardProp } from "./props";
import { BookmarkPlus, MoreHorizontal, Eye } from "lucide-react";
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

    return (
        <div 
            className="group relative bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 mb-4 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-gray-200 hover:-translate-y-0.5 active:scale-[0.99]" 
            onClick={() => data?.onClick?.(data.id)}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-50 group-hover:ring-blue-50 transition-all">
                        {data.author.avatarUrl ? (
                            <AuthenticatedImage 
                                src={data.author.avatarUrl} 
                                className="w-full h-full object-cover" 
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                {data.author.name?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-gray-900 leading-tight">
                            {data.author.name}
                        </div>
                        <div className="text-[12px] text-gray-400 mt-0.5 flex items-center gap-1.5">
                            <span>{data?.time ? formatTimeAgo(data.time, t) : ''}</span>
                            <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span>
                            <span>{t('home.contentCard.minRead', { count: timeRead })}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-1">
                     <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full text-gray-500 transition-colors">
                        <Eye size={14} />
                        <span className="text-[12px] font-medium leading-none">{data.views || 0}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between gap-5 mb-5">
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-snug transition-colors line-clamp-2">
                        {data?.title}
                    </h2>
                    <p className="text-gray-500 text-[15px] line-clamp-3 leading-relaxed font-normal">
                        {data?.content}
                    </p>
                </div>

                {data?.coverImage && (
                    <div className="w-full sm:w-40 h-44 sm:h-28 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100 shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
                        <AuthenticatedImage 
                            src={data.coverImage} 
                            alt={data.title || 'cover'} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {data?.tags?.slice(0, 3).map((tag, idx) => (
                        <span 
                            key={idx}
                            className="bg-gray-50 text-gray-600 text-[12px] px-3 py-1 rounded-lg border border-gray-100 whitespace-nowrap hover:bg-white hover:border-gray-200 transition-colors"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        className="text-gray-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-xl transition-all"
                        title={t('home.contentCard.save')}
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
    const { t } = useTranslation();
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
            title: t('common.toast.success'),
            message: t('documents.detail.shareSuccess')
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
            title: t('documents.detail.deleteTitle'),
            message: t('documents.detail.deleteMsg', { title: data.title }),
            confirmText: t('documents.detail.deleteBtn'),
            cancelText: t('common.confirm.cancel'),
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
                        {t('documents.detail.actions.share')}
                    </button>
                    
                    <button
                        onClick={handleReport}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Flag size={16} />
                        {t('documents.detail.actions.report')}
                    </button>

                    {isOwner && (
                        <>
                            <div className="h-px bg-gray-100 my-1 mx-2" />
                            <button
                                onClick={handleDelete}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                            >
                                <Trash2 size={16} />
                                {t('documents.detail.actions.delete')}
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}