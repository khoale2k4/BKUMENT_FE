
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
      // CHANGE: p-5 -> p-4 sm:p-5 để giảm padding trên mobile
      // mb-8 -> mb-6 sm:mb-8
      <div className="mb-6 sm:mb-8 p-4 sm:p-5 bg-blue-50/50 border border-blue-100 rounded-2xl relative group transition-all hover:shadow-md">
        <span className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
          Đánh giá của bạn
        </span>

        <div className="flex items-start justify-between">
          {/* CHANGE: gap-3 -> gap-2.5 sm:gap-3 */}
          <div className="flex items-center gap-2.5 mb-3 pr-16 sm:pr-0">
            {/* CHANGE: w-10 h-10 vẫn giữ vì đây là kích thước tối thiểu cho touch */}
            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700 shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              {/* CHANGE: text-sm để tên vừa màn hình nhỏ */}
              <div className="font-bold text-slate-800 text-sm sm:text-base truncate">
                {displayName}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <StarDisplay score={rating.score} />
                <span className="text-xs text-gray-500">
                  {new Date(rating.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </div>

          {/* CHANGE: mt-6 -> mt-1 sm:mt-6 để nút edit/delete không bị đẩy quá xa trên mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-6 absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto">
            <button
              onClick={() => onEdit && onEdit(rating)}
              disabled={isSubmitting}
              className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete && onDelete(rating)}
              disabled={isSubmitting}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
        </div>
        {/* CHANGE: text-sm -> text-xs sm:text-sm để comment vừa hơn trên mobile */}
        <p className="text-xs sm:text-sm text-gray-700 font-medium mt-2 leading-relaxed">
          {rating.comment}
        </p>
      </div>
    );
  }

  // --- UI DÀNH CHO NGƯỜI KHÁC ---
  return (
    // CHANGE: pb-6 -> pb-4 sm:pb-6 để compact hơn trên mobile
    <div className="pb-4 sm:pb-6 border-b border-gray-100 last:border-0">
      {/* CHANGE: gap-3 -> gap-2.5 sm:gap-3; mb-3 -> mb-2 sm:mb-3 */}
      <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 uppercase shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          {/* CHANGE: text-sm font-bold, truncate để không tràn */}
          <div className="font-bold text-slate-800 text-sm truncate">
            {displayName}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarDisplay score={rating.score} />
            <span className="text-xs text-gray-400">
              {new Date(rating.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>
      </div>
      {/*
        CHANGE: pl-[52px] -> pl-[46px] sm:pl-[52px] để khớp với avatar nhỏ hơn trên mobile
        text-sm -> text-xs sm:text-sm cho comment text
      */}
      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pl-[46px] sm:pl-[52px]">
        {rating.comment}
      </p>
    </div>
  );
};

export default RatingItem;
