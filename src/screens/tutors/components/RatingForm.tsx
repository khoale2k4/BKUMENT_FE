import React, { useState, useEffect } from "react";
import { Loader2, Star } from "lucide-react";

interface RatingFormProps {
  isEditing: boolean;
  initialScore?: number;
  initialComment?: string;
  isSubmitting: boolean;
  onSubmit: (score: number, comment: string) => void;
  onCancel?: () => void;
}

const RatingForm: React.FC<RatingFormProps> = ({
  isEditing,
  initialScore = 5,
  initialComment = "",
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const [score, setScore] = useState(initialScore);
  const [comment, setComment] = useState(initialComment);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  // Reset form khi prop initial thay đổi (ví dụ: khi bấm nút Sửa)
  useEffect(() => {
    setScore(initialScore);
    setComment(initialComment);
  }, [initialScore, initialComment]);

  const handleSubmit = () => {
    if (!comment.trim()) return;
    onSubmit(score, comment);
  };

  return (
    <div className="mb-10 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        {isEditing ? "Chỉnh sửa đánh giá của bạn" : "Thêm đánh giá mới"}
      </h3>

      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <Star
            key={starIndex}
            size={32}
            className={`cursor-pointer transition-colors ${
              starIndex <= (hoveredStar ?? score)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 fill-gray-100"
            }`}
            onMouseEnter={() => setHoveredStar(starIndex)}
            onMouseLeave={() => setHoveredStar(null)}
            onClick={() => setScore(starIndex)}
          />
        ))}
        <span className="ml-2 font-bold text-gray-600">{score} / 5 Sao</span>
      </div>

      <textarea
        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
        rows={4}
        placeholder="Bạn nghĩ sao về gia sư này? Chia sẻ trải nghiệm của bạn nhé..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      <div className="flex justify-end gap-3 mt-4">
        {isEditing && onCancel && (
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !comment.trim()}
          className="px-6 py-2.5 font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Đang xử lý...
            </>
          ) : isEditing ? (
            "Cập nhật đánh giá"
          ) : (
            "Gửi đánh giá"
          )}
        </button>
      </div>
    </div>
  );
};

export default RatingForm;
