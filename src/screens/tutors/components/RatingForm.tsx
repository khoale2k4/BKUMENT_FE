// import React, { useState, useEffect } from "react";
// import { Loader2, Star } from "lucide-react";

// interface RatingFormProps {
//   isEditing: boolean;
//   initialScore?: number;
//   initialComment?: string;
//   isSubmitting: boolean;
//   onSubmit: (score: number, comment: string) => void;
//   onCancel?: () => void;
// }

// const RatingForm: React.FC<RatingFormProps> = ({
//   isEditing,
//   initialScore = 5,
//   initialComment = "",
//   isSubmitting,
//   onSubmit,
//   onCancel,
// }) => {
//   const [score, setScore] = useState(initialScore);
//   const [comment, setComment] = useState(initialComment);
//   const [hoveredStar, setHoveredStar] = useState<number | null>(null);

//   // Reset form khi prop initial thay đổi (ví dụ: khi bấm nút Sửa)
//   useEffect(() => {
//     setScore(initialScore);
//     setComment(initialComment);
//   }, [initialScore, initialComment]);

//   const handleSubmit = () => {
//     if (!comment.trim()) return;
//     onSubmit(score, comment);
//   };

//   return (
//     <div className="mb-10 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
//       <h3 className="text-lg font-bold text-slate-900 mb-4">
//         {isEditing ? "Chỉnh sửa đánh giá của bạn" : "Thêm đánh giá mới"}
//       </h3>

//       <div className="flex items-center gap-2 mb-4">
//         {[1, 2, 3, 4, 5].map((starIndex) => (
//           <Star
//             key={starIndex}
//             size={32}
//             className={`cursor-pointer transition-colors ${
//               starIndex <= (hoveredStar ?? score)
//                 ? "text-yellow-400 fill-yellow-400"
//                 : "text-gray-300 fill-gray-100"
//             }`}
//             onMouseEnter={() => setHoveredStar(starIndex)}
//             onMouseLeave={() => setHoveredStar(null)}
//             onClick={() => setScore(starIndex)}
//           />
//         ))}
//         <span className="ml-2 font-bold text-gray-600">{score} / 5 Sao</span>
//       </div>

//       <textarea
//         className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
//         rows={4}
//         placeholder="Bạn nghĩ sao về gia sư này? Chia sẻ trải nghiệm của bạn nhé..."
//         value={comment}
//         onChange={(e) => setComment(e.target.value)}
//       ></textarea>

//       <div className="flex justify-end gap-3 mt-4">
//         {isEditing && onCancel && (
//           <button
//             onClick={onCancel}
//             disabled={isSubmitting}
//             className="px-5 py-2.5 font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
//           >
//             Hủy bỏ
//           </button>
//         )}
//         <button
//           onClick={handleSubmit}
//           disabled={isSubmitting || !comment.trim()}
//           className="px-6 py-2.5 font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isSubmitting ? (
//             <>
//               <Loader2 size={18} className="animate-spin" /> Đang xử lý...
//             </>
//           ) : isEditing ? (
//             "Cập nhật đánh giá"
//           ) : (
//             "Gửi đánh giá"
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RatingForm;

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

  useEffect(() => {
    setScore(initialScore);
    setComment(initialComment);
  }, [initialScore, initialComment]);

  const handleSubmit = () => {
    if (!comment.trim()) return;
    onSubmit(score, comment);
  };

  return (
    // CHANGE: p-6 -> p-4 sm:p-6 để giảm padding bên trong trên mobile
    // mb-10 -> mb-6 sm:mb-10
    <div className="mb-6 sm:mb-10 p-4 sm:p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      {/* CHANGE: text-lg -> text-base sm:text-lg */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
        {isEditing ? "Chỉnh sửa đánh giá của bạn" : "Thêm đánh giá mới"}
      </h3>

      {/* CHANGE: gap-2 -> gap-1.5 sm:gap-2; Star size 32 -> 28 trên mobile qua className trick */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <Star
            key={starIndex}
            // CHANGE: size=32 -> dùng className để điều chỉnh: w-7 h-7 sm:w-8 sm:h-8
            className={`cursor-pointer transition-colors w-7 h-7 sm:w-8 sm:h-8 ${
              starIndex <= (hoveredStar ?? score)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 fill-gray-100"
            }`}
            onMouseEnter={() => setHoveredStar(starIndex)}
            onMouseLeave={() => setHoveredStar(null)}
            onClick={() => setScore(starIndex)}
          />
        ))}
        {/* CHANGE: text-gray-600 size -> text-sm sm:text-base */}
        <span className="ml-1 sm:ml-2 font-bold text-sm sm:text-base text-gray-600">
          {score} / 5 Sao
        </span>
      </div>

      {/* CHANGE: p-4 -> p-3 sm:p-4 để giảm padding textarea trên mobile */}
      <textarea
        className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none text-sm sm:text-base"
        rows={4}
        placeholder="Bạn nghĩ sao về gia sư này? Chia sẻ trải nghiệm của bạn nhé..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      {/*
        CHANGE: Trên mobile, các nút chiếm full width (flex-col).
        Trên sm+: flex-row justify-end như cũ.
        mt-4 -> mt-3 sm:mt-4
      */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-3 sm:mt-4">
        {isEditing && onCancel && (
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            // CHANGE: w-full trên mobile, w-auto trên sm+
            className="w-full sm:w-auto px-5 py-2.5 font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 text-sm"
          >
            Hủy bỏ
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !comment.trim()}
          // CHANGE: w-full trên mobile, w-auto trên sm+
          className="w-full sm:w-auto px-6 py-2.5 font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Đang xử lý...
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
