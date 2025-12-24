'use client';

import { formatTimeAgo } from "@/utils/format_time_ago";
import { CardProp } from "./props";

export default function ArticleCard({ data }: { data: CardProp }) {
    const timeRead = Math.ceil(data.content.split(" ").length / 200);

    return (
        <div className="py-8 border-b border-gray-100 last:border-none">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img
                        src="https://placehold.co/100x100/3b82f6/white?text=A"
                        alt="avatar"
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="text-sm font-medium text-gray-900">{data.author}</span>
                <span className="text-sm text-gray-400">· {formatTimeAgo(data.time)}</span>
            </div>

            <div className="flex justify-between gap-6 md:gap-12 mb-4">
                <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight cursor-pointer hover:underline decoration-1 underline-offset-2">
                        {data.title}
                    </h2>
                    <p className="text-gray-500 text-base line-clamp-2 md:line-clamp-3 leading-relaxed">
                        {data.content}
                    </p>
                </div>

                <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                    <img
                        src={data.assets[0]}
                        alt={data.title}
                        className="w-full h-full object-cover rounded-md bg-gray-100"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium hover:bg-gray-200 cursor-pointer transition">
                        {data.tags[0]}
                    </span>

                    <span className="text-xs text-gray-500">{timeRead} minute{timeRead > 1 ? "s" : ""}</span>

                    <span className="text-[10px] text-gray-400">•</span>

                    <span className="text-xs text-gray-500 hidden sm:block">Selected for you</span>
                </div>

                {/* <div className="flex items-center gap-3 text-gray-400">
                    <button className="hover:text-black transition">
                        <BookmarkPlus size={20} strokeWidth={1.5} />
                    </button>
                    <button className="hover:text-black transition">
                        <MoreHorizontal size={20} />
                    </button>
                </div> */}
            </div>
        </div>
    );
}