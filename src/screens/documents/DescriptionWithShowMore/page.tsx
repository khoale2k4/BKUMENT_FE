import { ChevronUp, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export const DescriptionWithShowMore = ({ description }: { description?: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        if (description && description.length > 300) {
            setIsOverflowing(true);
        }
    }, [description]);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    if (!description) return <p className="text-gray-400 italic">Chưa có mô tả.</p>;

    return (
        <div className="relative">
            <p className={`text-gray-600 leading-relaxed text-justify transition-all duration-300 ${!isExpanded && isOverflowing ? 'line-clamp-4' : ''}`}>
                {description}
            </p>
            {isOverflowing && (
                <button
                    onClick={toggleExpand}
                    className="mt-2 text-blue-600 font-medium text-sm flex items-center gap-1 hover:underline"
                >
                    {isExpanded ? (
                        <>Thu gọn <ChevronUp size={16} /></>
                    ) : (
                        <>Xem thêm <ChevronDown size={16} /></>
                    )}
                </button>
            )}
        </div>
    );
};