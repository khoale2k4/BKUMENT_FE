'use client';

export default function ArticleCardSkeleton() {
    return (
        <div className="animate-pulse flex gap-4 py-4">
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-24 h-24 bg-gray-200 rounded"></div>
        </div>
    );
}