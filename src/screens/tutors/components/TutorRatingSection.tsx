"use client";

import React, { useEffect, useState } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  getTutorRatingSummaryAsync,
  getTutorRatingsAsync,
  getMyTutorRatingAsync, // <-- Khôi phục lại hàm này
  deleteRatingAsync,
  createRatingAsync,
  updateRatingAsync,
} from "@/lib/redux/features/tutorFindingSlice";

// Import các Component con
import RatingSummary from "./RatingSummary";
import RatingForm from "./RatingForm";
import RatingItem from "./RatingItem";
import Pagination from "@/components/ui/Pagination";

interface TutorRatingSectionProps {
  tutorId: string;
}

const TutorRatingSection: React.FC<TutorRatingSectionProps> = ({ tutorId }) => {
  const dispatch = useAppDispatch();

  const {
    tutorRatings,
    tutorRatingSummary,
    myTutorRating, // <-- Đánh giá của chính mình từ Redux state
    loadingRatings,
    isRatingSubmitting,
    ratingsTotalPages,
  } = useAppSelector((state) => state.tutorFinding);

  const currentUser = useAppSelector((state) => state.profile.user);
  const currentUserId = currentUser?.id;

  const displayName = currentUser
    ? `${currentUser.lastName || ""} ${currentUser.firstName || ""}`.trim() ||
      "Bạn"
    : "Bạn";

  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // GỌI API
  useEffect(() => {
    if (tutorId) {
      dispatch(getTutorRatingSummaryAsync(tutorId));

      // Gọi API lấy đánh giá của cá nhân mình
      if (currentUserId) {
        console.log(
          "Fetching my rating for tutorId:",
          tutorId,
          "userId:",
          currentUserId,
        );
        dispatch(getMyTutorRatingAsync({ tutorId, userId: currentUserId }));
      }

      dispatch(getTutorRatingsAsync({ tutorId, page: currentPage, size: 5 }));
    }
  }, [dispatch, tutorId, currentPage, currentUserId]);

  // --- HANDLERS ---
  const handleDeleteRating = async (rating: any) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) {
      await dispatch(
        deleteRatingAsync({ ratingId: String(rating.id), tutorId }),
      );
      setCurrentPage(0); // Reset về trang 1
    }
  };

  const handleSubmitRating = async (score: number, comment: string) => {
    if (myTutorRating && isEditing) {
      await dispatch(
        updateRatingAsync({
          ratingId: String(myTutorRating.id),
          payload: { tutorId, score, comment },
        }),
      );
      setIsEditing(false);
    } else {
      await dispatch(createRatingAsync({ tutorId, score, comment }));
      setCurrentPage(0); // Đăng xong đưa về trang 1
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage - 1);
  };

  return (
    <div className="mt-20 pt-10 border-t border-gray-200">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="text-orange-500" size={28} />
        <h2 className="text-2xl font-bold text-slate-900">
          Đánh giá từ học viên
        </h2>
      </div>

      {/* Component 1: Tổng quan Điểm số */}
      <RatingSummary
        averageScore={tutorRatingSummary?.averageScore}
        totalRatings={tutorRatingSummary?.totalReviews}
      />

      {/* Component 2: Khung Nhập Liệu (Ẩn nếu đã đánh giá và đang không bấm nút Sửa) */}
      {(!myTutorRating || isEditing) && (
        <RatingForm
          isEditing={isEditing}
          initialScore={myTutorRating?.score}
          initialComment={myTutorRating?.comment}
          isSubmitting={isRatingSubmitting}
          onSubmit={handleSubmitRating}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {/* Component 3: Bình luận của cá nhân (Ẩn nếu đang trong chế độ Edit) */}
      {myTutorRating && !isEditing && (
        <RatingItem
          rating={myTutorRating}
          isMine={true}
          displayName={displayName}
          isSubmitting={isRatingSubmitting}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDeleteRating}
        />
      )}

      {/* Component 4: Danh sách Bình luận của những người khác */}
      {loadingRatings ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      ) : tutorRatings.length === 0 && !myTutorRating ? (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          Gia sư này chưa có đánh giá nào.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {tutorRatings.map((rating) => {
            // Tránh render lại đánh giá của mình nếu API danh sách chung cũng trả về
            if (myTutorRating && rating.id === myTutorRating.id) return null;

            return <RatingItem key={rating.id} rating={rating} />;
          })}
        </div>
      )}

      {/* Component 5: Phân trang (Chỉ hiển thị nếu có từ 2 trang trở lên) */}
      {ratingsTotalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={currentPage + 1}
            totalPages={ratingsTotalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default TutorRatingSection;
