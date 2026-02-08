'use client';

import { formatTimeAgo } from "@/utils/formatTimeAgo";
import { CardProp } from "./props";
import { BookmarkPlus, MoreHorizontal } from "lucide-react";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";

export default function ContentCard({ data }: { data: CardProp }) {
    const timeRead = Math.ceil(data.content.split(" ").length / 200);

    return (
        <div className="py-6 border-b border-gray-100 last:border-none w-full max-w-3xl" onClick={() => data.onClick(data.id)}>
            <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    <img
                        src="https://placehold.co/100x100/3b82f6/white?text=A"
                        alt="avatar"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex items-center text-[13px] leading-none">
                    <span className="font-medium text-gray-900">{data.author}</span>
                    <span className="mx-1 text-gray-400">·</span>
                    <span className="text-gray-500">{formatTimeAgo(data.time)}</span>
                </div>
            </div>

            <div className="flex justify-between gap-8 mb-8">
                <div className="flex-1 flex flex-col justify-center">
                    <h2 className="text-[22px] font-bold text-gray-900 mb-1 leading-snug cursor-pointer hover:underline decoration-1 underline-offset-2">
                        {data.title}
                    </h2>
                    <p className="text-gray-500 text-base line-clamp-2 leading-relaxed font-normal font-sans">
                        {data.content}
                    </p>
                </div>

                <div className="w-28 h-28 sm:w-36 sm:h-28 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                    <AuthenticatedImage src={data.coverImage} alt={data.title} className="w-full h-full object-cover" />
                </div>

            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="bg-[#F2F2F2] text-gray-700 text-[13px] px-3 py-1 rounded-full hover:bg-gray-200 cursor-pointer transition">
                        {data.tags[0]}
                    </span>

                    <span className="text-[13px] text-gray-500">{timeRead} min read</span>

                    <span className="text-[10px] text-gray-400 mx-[-2px]">•</span>

                    <span className="text-[13px] text-gray-500 hidden sm:block">Selected for you</span>
                </div>

                <div className="flex items-center gap-4 text-gray-500">
                    <button className="hover:text-gray-900 transition flex items-center justify-center">
                        <BookmarkPlus size={22} strokeWidth={1.5} />
                    </button>
                    <button className="hover:text-gray-900 transition flex items-center justify-center">
                        <MoreHorizontal size={22} strokeWidth={1.5} />
                    </button>
                </div>
            </div>
        </div>
    );
}