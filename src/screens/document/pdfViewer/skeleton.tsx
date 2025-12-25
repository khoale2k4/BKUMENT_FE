import { Loader2 } from "lucide-react";

export const PDFLoadingSkeleton = () => {
    return (
        <div className="w-full flex flex-col items-center gap-4 animate-pulse">
            <div className="w-full max-w-[600px] aspect-[1/1.41] bg-white rounded shadow-lg p-8 flex flex-col gap-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                
                <div className="h-20"></div>

                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
            <div className="text-gray-400 text-sm font-medium flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Đang tải tài liệu...
            </div>
        </div>
    );
};