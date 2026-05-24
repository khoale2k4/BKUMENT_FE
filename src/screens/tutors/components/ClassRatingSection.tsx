"use client";

import React, { useEffect, useState } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  getClassRatingSummaryAsync,
  getClassRatingsAsync,
  getMyClassRatingAsync, // <-- Khôi phục lại hàm này
  deleteRatingAsync,
  createRatingAsync,
  updateRatingAsync,
  clearClassRatings,
} from "@/lib/redux/features/tutorCourseSlice";

// Import các Component con
import RatingSummary from "./RatingSummary";
import RatingForm from "./RatingForm";
import RatingItem from "./RatingItem";
import Pagination from "@/components/ui/Pagination";

interface ClassRatingSectionProps {
  classId: string;
}

const ClassRatingSection: React.FC<ClassRatingSectionProps> = ({ classId }) => {
  const dispatch = useAppDispatch();

  const {
    classRatings,
    classRatingSummary,
    myClassRating, // <-- Đánh giá của chính mình từ Redux state
    loadingRatings,
    isRatingSubmitting,
    ratingsTotalPages,
  } = useAppSelector((state) => state.tutorCourse);

  const currentUser = useAppSelector((state) => state.profile.user);
  const currentUserId = currentUser?.id;

  const displayName = currentUser
    ? `${currentUser.lastName || ""} ${currentUser.firstName || ""}`.trim() ||
      "Bạn"
    : "Bạn";

  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  
  // EFFECT 1: Fetch tổng quan và Đánh giá của mình (Chạy khi classId đổi)
  useEffect(() => {
    if (classId) {
      // 1. Dọn dẹp data của lớp cũ trước khi lấy lớp mới (Giải quyết Vấn đề 1)
      dispatch(clearClassRatings());

      // 2. Fetch data mới
      dispatch(getClassRatingSummaryAsync(classId));

      if (currentUserId) {
        dispatch(getMyClassRatingAsync({ classId: classId, userId: currentUserId }));
      }
    }

    // Hàm Cleanup: Sẽ tự động chạy khi component bị hủy (người dùng rời khỏi trang)
    return () => {
      dispatch(clearClassRatings());
    };
  }, [dispatch, classId, currentUserId]);

  // EFFECT 2: Fetch danh sách đánh giá chung (Chạy khi classId HOẶC trang thay đổi)
  useEffect(() => {
    if (classId) {
      dispatch(getClassRatingsAsync({ classId: classId, page: currentPage, size: 5 }));
    }
  }, [dispatch, classId, currentPage]);

  // --- HANDLERS ---
  const handleDeleteRating = async (rating: any) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) {
      await dispatch(
        deleteRatingAsync({ ratingId: String(rating.id), classId }),
      );
      setCurrentPage(0); // Reset về trang 1
    }
  };

  const handleSubmitRating = async (score: number, comment: string) => {
    if (myClassRating && isEditing) {
      await dispatch(
        updateRatingAsync({
          ratingId: String(myClassRating.id),
          payload: { classId, score, comment },
        }),
      );
      setIsEditing(false);
    } else {
      await dispatch(createRatingAsync({ classId, score, comment }));
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
        averageScore={classRatingSummary?.averageScore}
        totalRatings={classRatingSummary?.totalReviews}
      />

      {/* Component 2: Khung Nhập Liệu (Ẩn nếu đã đánh giá và đang không bấm nút Sửa) */}
      {(!myClassRating || isEditing) && (
        <RatingForm
          isEditing={isEditing}
          initialScore={myClassRating?.score}
          initialComment={myClassRating?.comment}
          isSubmitting={isRatingSubmitting}
          onSubmit={handleSubmitRating}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {/* Component 3: Bình luận của cá nhân (Ẩn nếu đang trong chế độ Edit) */}
      {myClassRating && !isEditing && (
        <RatingItem
          rating={myClassRating}
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
      ) : classRatings.length === 0 && !myClassRating ? (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          Lớp học này chưa có đánh giá nào.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {classRatings.map((rating) => {
            // Tránh render lại đánh giá của mình nếu API danh sách chung cũng trả về
            if (myClassRating && rating.id === myClassRating.id) return null;

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

export default ClassRatingSection;
