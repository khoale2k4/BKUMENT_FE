"use client";
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Badge, ActionIcon } from '@mantine/core';
import { IconArrowLeft, IconEye, IconCalendar, IconUser, IconShare3 } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
// 1. Import Redux hooks
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect } from 'react';
import { fetchPost, rateBlog } from '@/lib/redux/features/blogSlice';
import { AuthenticatedImage } from '@/components/ui/AuthenticatedImage';
import { openConfirmModal, openReportModal } from '@/lib/redux/features/modalSlice';
import { deleteBlogAsync } from '@/lib/redux/features/myBlogSlice';
import { showToast } from '@/lib/redux/features/toastSlice';
import { IconDots, IconTrash, IconFlag, IconShare } from '@tabler/icons-react';
import { Eye } from 'lucide-react';
import { AppRoute } from '@/lib/appRoutes';
import { useState, useRef } from 'react';
import StarRating from '@/components/ui/StarRating';
import CommentSection from '../documents/commentSection/page';

import parse, { HTMLReactParserOptions, Element } from 'html-react-parser';

interface PageProps {
    params: {
        id: string;
    };

}

export default function BlogDetailPage(params: PageProps) {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { 
        id, 
        title, 
        contentHTML, 
        coverImage, 
        visibility, 
        author, 
        createdAt, 
        status, 
        averageRating, 
        myRating,
        views
    } = useAppSelector(
        (state) => state.blogs
    );
    const currentUser = useAppSelector(state => state.profile.user);
    const isOwner = currentUser?.id === author?.id;

    const handleRate = (rating: number) => {
        if (!id) return;
        dispatch(rateBlog({ resourceId: id, rating }));
    };

    const parseOptions: HTMLReactParserOptions = {
        replace(domNode) {
            if (domNode instanceof Element && domNode.name === 'img') {
                const { src, alt, className } = domNode.attribs;
                
                return (
                    <AuthenticatedImage 
                        src={src} 
                        alt={alt || t('blogs.detail.imageAlt', 'Post content image')} 
                        className={className} 
                        onError={(e: any) => {
                            e.currentTarget.src = "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";
                        }}
                    />
                );
            }
        }
    };

    useEffect(() => {
        dispatch(fetchPost(params.params.id));
    }, [dispatch]);

    if (status === 'getting' || status === 'idle') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-3 text-gray-500">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                    <span className="text-sm font-medium">Đang tải bài viết...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans pb-20">
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
                    >
                        <IconArrowLeft size={20} stroke={1.5} />
                        <span className="text-sm font-medium">{t('blogs.detail.back', 'Back')}</span>
                    </button>

                    <div className="flex gap-2">
                        <BlogActionsMenu 
                            onShare={() => {
                                navigator.clipboard.writeText(window.location.href);
                                dispatch(showToast({ type: 'success', title: 'Thành công', message: 'Đã sao chép đường dẫn!' }));
                            }}
                            onReport={() => {
                                if (id) dispatch(openReportModal({ targetId: id, type: 'BLOG' }));
                            }}
                            onDelete={() => {
                                if (id) {
                                    dispatch(openConfirmModal({
                                        title: "Xóa bài viết",
                                        message: `Bạn có chắc chắn muốn xóa "${title}"? Hành động này không thể hoàn tác.`,
                                        confirmText: "Xóa",
                                        cancelText: "Hủy",
                                        onConfirm: async () => {
                                            try {
                                                await dispatch(deleteBlogAsync(id)).unwrap();
                                                router.push(AppRoute.home);
                                            } catch (error) {
                                                console.error("Xóa thất bại:", error);
                                            }
                                        }
                                    }));
                                }
                            }}
                            isOwner={isOwner}
                        />
                    </div>
                </div>
            </div>

            <article className="max-w-3xl mx-auto px-4 mt-8 sm:mt-12">
                <div className="flex items-center gap-3 mb-6">
                    <Badge
                        color="black"
                        variant="light"
                        size="sm"
                    >
                        {visibility === 'PUBLIC' ? t('blogs.write.header.public', 'Public') : t('blogs.write.header.private', 'Private')}
                    </Badge>
                    <span className="text-gray-400 text-xs uppercase tracking-wide font-semibold">
                        •
                    </span>
                    <span className="text-gray-500 text-sm font-medium">
                        {createdAt
                            ? new Date(createdAt).toLocaleDateString(i18n.language === 'vi' ? "vi-VN" : "en-US")
                            : t('blogs.detail.loading', 'Loading')}
                    </span>
                    <span className="text-gray-400 text-xs uppercase tracking-wide font-semibold">
                        •
                    </span>
                    <span className="text-gray-500 text-sm font-medium">
                        {t('blogs.detail.updatedJustNow', 'Updated just now')}
                    </span>
                    <span className="text-gray-400 text-xs uppercase tracking-wide font-semibold">
                        •
                    </span>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                        <Eye size={16} strokeWidth={2} />
                        <span>{views || 0}</span>
                    </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-black tracking-tight leading-[1.1] mb-6">
                    {title}
                </h1>
                <div className="mb-8">
                    <StarRating 
                        rating={myRating} 
                        averageRating={averageRating} 
                        onRate={handleRate}
                        readonly={!!myRating && myRating > 0}
                        size="lg"
                    />
                </div>

                <div className="flex items-center justify-between border-t border-b border-gray-100 py-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            {author?.avatarUrl ? (
                                <img
                                    src={author.avatarUrl}
                                    alt="Author"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                    <IconUser size={20} />
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="font-bold text-gray-900 text-sm">{author?.name || 'Author Name'}</div>
                            <div className="text-xs text-gray-500">lythanhnhatquangthongnhat2004@gmail.com</div>
                        </div>
                    </div>

                    <div className="flex gap-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                            <IconEye size={16} /> 0 {t('blogs.detail.views', 'views')}
                        </div>
                    </div>
                </div>

                {coverImage && (
                    <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-10 shadow-sm border border-gray-100">
                        <AuthenticatedImage src={coverImage} onError={(e) => {
                                e.currentTarget.src =
                                    "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";
                            }} className="w-full h-full object-cover" />
                    </div>
                )}

                <div
                    className={clsx(
                        "prose prose-lg prose-slate max-w-none",
                        "prose-headings:font-bold prose-headings:text-gray-900",
                        "prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6",
                        "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline",
                        "prose-img:rounded-xl prose-img:shadow-sm prose-img:my-8 prose-img:w-full",
                        "prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:pl-4 prose-blockquote:italic",
                        "first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-gray-900"
                    )}
                >
                    {contentHTML ? parse(contentHTML, parseOptions) : <p className="text-gray-400 italic">{t('blogs.detail.noContent', 'No content available')}</p>}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 uppercase mb-4">
                        {t('blogs.detail.tags', 'Tags')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {["Preview", "Draft"].map((tag) => (
                            <span
                                key={tag}
                                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 cursor-pointer transition"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
                
                <CommentSection params={{ id: params.params.id }} />
            </article>
        </div>
    );
}

function BlogActionsMenu({ onShare, onReport, onDelete, isOwner }: { 
    onShare: () => void, 
    onReport: () => void, 
    onDelete: () => void, 
    isOwner: boolean 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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

    return (
        <div className="relative" ref={menuRef}>
            <ActionIcon 
                variant="subtle" 
                color="gray" 
                radius="xl"
                onClick={() => setIsOpen(!isOpen)}
            >
                <IconDots size={20} stroke={1.5} />
            </ActionIcon>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <button
                        onClick={() => { setIsOpen(false); onShare(); }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <IconShare size={16} />
                        Chia sẻ
                    </button>
                    
                    <button
                        onClick={() => { setIsOpen(false); onReport(); }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <IconFlag size={16} />
                        Báo cáo
                    </button>

                    {isOwner && (
                        <>
                            <div className="h-px bg-gray-100 my-1 mx-2" />
                            <button
                                onClick={() => { setIsOpen(false); onDelete(); }}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                            >
                                <IconTrash size={16} />
                                Xóa bài viết
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
