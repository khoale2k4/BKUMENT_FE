import { AuthenticatedImage } from '@/components/ui/AuthenticatedImage';
import { FileText, User, Calendar } from 'lucide-react';

interface RelatedDocumentProps {
    data: {
        id: string;
        title: string;
        createdAt: string;
        coverImage?: string;
        author?: string;
        onClick: () => void;
    };
}

export default function RelatedDocumentCard({ data }: RelatedDocumentProps) {
    return (
        <div
            onClick={data.onClick}
            className="group min-w-[280px] w-[280px] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex-shrink-0"
        >
            <div className="aspect-[3/4] w-full bg-gray-100 relative overflow-hidden">
                {data.coverImage ? (
                    <AuthenticatedImage src={data.coverImage} alt={data.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FileText size={48} />
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full">
                    PDF
                </div>
            </div>
            <div className="p-4">
                <h4 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition h-10">
                    {data.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1">
                        <User size={12} />
                        <span className="truncate max-w-[80px]">{data.author || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{new Date(data.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
