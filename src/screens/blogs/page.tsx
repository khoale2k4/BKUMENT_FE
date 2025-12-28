"use client";
import clsx from 'clsx';
import { Badge, ActionIcon } from '@mantine/core';
import { IconArrowLeft, IconEye, IconCalendar, IconUser, IconShare3 } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
// 1. Import Redux hooks
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect } from 'react';
import { fetchPost } from '@/lib/redux/features/blogSlice';

interface PageProps {
    params: {
        id: string;
    };

}

export default function BlogDetailPage(params: PageProps) {
    console.log(params);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { title, contentHTML, coverImage, visibility, authorId, createdAt, status } = useAppSelector(
        (state) => state.blogs
    );

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
                        <span className="text-sm font-medium">Quay lại</span>
                    </button>

                    <div className="flex gap-2">
                        <ActionIcon variant="subtle" color="gray" radius="xl">
                            <IconShare3 size={20} stroke={1.5} />
                        </ActionIcon>
                    </div>
                </div>
            </div>

            <article className="max-w-3xl mx-auto px-4 mt-8 sm:mt-12">
                <div className="flex items-center gap-3 mb-6">
                    <Badge
                        color={visibility === "PUBLIC" ? "green" : "red"}
                        variant="light"
                        size="sm"
                    >
                        {visibility}
                    </Badge>
                    <span className="text-gray-400 text-xs uppercase tracking-wide font-semibold">
                        •
                    </span>
                    <span className="text-gray-500 text-sm font-medium">
                        {createdAt
                            ? new Date(createdAt).toLocaleDateString("vi-VN")
                            : 'Đang tải'}
                    </span>
                    <span className="text-gray-400 text-xs uppercase tracking-wide font-semibold">
                        •
                    </span>
                    <span className="text-gray-500 text-sm font-medium">
                        Vừa cập nhật
                    </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-8">
                    {title}
                </h1>

                <div className="flex items-center justify-between border-t border-b border-gray-100 py-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            <img
                                src="https://images2.thanhnien.vn/zoom/80_80/528068263637045248/2023/7/8/img6578-16888121214401842466449.jpg"
                                alt="Author"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <div className="font-bold text-gray-900 text-sm">Lý Thanh Nhật Quang</div>
                            <div className="text-xs text-gray-500">lythanhnhatquangthongnhat2004@gmail.com</div>
                        </div>
                    </div>

                    <div className="flex gap-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                            <IconEye size={16} /> 0
                        </div>
                    </div>
                </div>

                {coverImage && (
                    <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-10 shadow-sm border border-gray-100">
                        <img
                            src={coverImage}
                            onError={(e) => {
                                e.currentTarget.src =
                                    "https://images2.thanhnien.vn/528068263637045248/2025/12/16/u23-vietnam-2-17658561303842145453005.jpg";
                            }}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
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
                    dangerouslySetInnerHTML={{ __html: contentHTML }}
                />

                <div className="mt-12 pt-8 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 uppercase mb-4">
                        Tags
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
            </article>
        </div>
    );
}
