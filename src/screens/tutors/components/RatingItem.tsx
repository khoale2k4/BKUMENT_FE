import React from "react";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import StarDisplay from "./StarDisplay";

interface RatingItemProps {
  rating: any;
  isMine?: boolean;
  displayName?: string;
  isSubmitting?: boolean;
  onEdit?: (rating: any) => void;
  onDelete?: (rating: any) => void;
}

const RatingItem: React.FC<RatingItemProps> = ({
  rating,
  isMine = false,
  displayName = "Học viên",
  isSubmitting = false,
  onEdit,
  onDelete,
}) => {
  const initial = isMine ? displayName.charAt(0).toUpperCase() : "HV";

  if (isMine) {
    return (
      <div className="mb-8 p-5 bg-blue-50/50 border border-blue-100 rounded-2xl relative group transition-all hover:shadow-md">
        <span className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
          Đánh giá của bạn
        </span>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700">
              {initial}
            </div>
            <div>
              <div className="font-bold text-slate-800">{displayName}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <StarDisplay score={rating.score} />
                <span className="text-xs text-gray-500">
                  {new Date(rating.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-6">
            <button
              onClick={() => onEdit && onEdit(rating)}
              disabled={isSubmitting}
              className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete && onDelete(rating)}
              disabled={isSubmitting}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          </div>
        </div>
        <p className="text-gray-700 font-medium mt-2">{rating.comment}</p>
      </div>
    );
  }

  // --- UI DÀNH CHO NGƯỜI KHÁC ---
  return (
    <div className="pb-6 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 uppercase">
          {initial}
        </div>
        <div>
          <div className="font-bold text-slate-800">{displayName}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarDisplay score={rating.score} />
            <span className="text-xs text-gray-400">
              {new Date(rating.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed pl-[52px]">
        {rating.comment}
      </p>
    </div>
  );
};

export default RatingItem;
