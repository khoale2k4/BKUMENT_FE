'use client';

export default function ContentCardSkeleton() {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 mb-4 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-100 rounded w-24" />
                        <div className="h-2 bg-gray-50 rounded w-16" />
                    </div>
                </div>
                <div className="w-12 h-6 bg-gray-50 rounded-full" />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between gap-5 mb-5">
                <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-100 rounded w-full" />
                    <div className="h-5 bg-gray-100 rounded w-4/5" />
                    <div className="space-y-2 pt-2">
                        <div className="h-3 bg-gray-50 rounded w-full" />
                        <div className="h-3 bg-gray-50 rounded w-full" />
                        <div className="h-3 bg-gray-50 rounded w-2/3" />
                    </div>
                </div>
                <div className="w-full sm:w-40 h-44 sm:h-28 bg-gray-100 rounded-xl flex-shrink-0" />
            </div>

            <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                    <div className="w-16 h-6 bg-gray-50 rounded-lg" />
                    <div className="w-16 h-6 bg-gray-50 rounded-lg" />
                </div>
                <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-50 rounded-xl" />
                    <div className="w-8 h-8 bg-gray-50 rounded-full" />
                </div>
            </div>
        </div>
    );
}