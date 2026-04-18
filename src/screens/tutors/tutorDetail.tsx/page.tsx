"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ChevronLeft, Star, MessageSquare } from "lucide-react"; // <-- Thêm Star và MessageSquare
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getClassesByTutorId } from "@/lib/redux/features/tutorCourseSlice";
import {
  getTutorRatingSummaryAsync,
  getTutorRatingsAsync,
} from "@/lib/redux/features/tutorFindingSlice";
import CourseCard from "../../profile/tabs/MyClass/CourseCard";
import Pagination from "@/components/ui/Pagination";
import TutorRatingSection from "../components/TutorRatingSection";
import { useTranslation } from "react-i18next";

const TutorDetailPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const tutorId = params.id as string;
  const dispatch = useAppDispatch();

  // LẤY DỮ LIỆU VÀ STATE TỪ REDUX
  const {
    viewedTutorClasses,
    loadingViewedClasses,
    error,
    currentPage,
    totalPages,
  } = useAppSelector((state) => state.tutorCourse);

  const { tutorRatings, tutorRatingSummary, myTutorRating, loadingRatings } =
    useAppSelector((state) => state.tutorFinding);

  // GỌI API LẦN ĐẦU KHI VÀO TRANG
  useEffect(() => {
    if (tutorId) {
      dispatch(getClassesByTutorId({ tutorId, page: 0, size: 5 }));
    }
  }, [dispatch, tutorId]);

  // HÀM XỬ LÝ CHUYỂN TRANG KHÓA HỌC
  const handlePageChange = (newPage: number) => {
    dispatch(getClassesByTutorId({ tutorId, page: newPage - 1, size: 5 }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

    // UI Loading
    if (loadingViewedClasses) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-orange-500">
                <Loader2 size={40} className="animate-spin mb-4" />
                <p className="font-medium text-gray-600">{t("tutors.detail.loading")}</p>
            </div>
        );
    }

    // UI Error
    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6 mt-10 text-red-600 bg-red-50 border border-red-200 rounded-xl text-center font-medium">
                {t("common.error.prefix")} {error}
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 font-sans text-gray-800 animate-in fade-in duration-500">
            {/* Nút Quay lại */}
            <button
                onClick={() => router.back()}
                className="mb-8 flex items-center gap-2 text-gray-500 hover:text-orange-500 font-medium transition-colors"
            >
                <ChevronLeft size={20} /> {t("tutors.detail.back")}
            </button>

            {/* --- PHẦN 1: DANH SÁCH KHÓA HỌC --- */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {t("tutors.detail.title")}
                </h1>
                <p className="text-gray-500">
                    {t("tutors.detail.currently")}{" "}
                    <span className="font-bold text-orange-500">
                        {viewedTutorClasses.length}
                    </span>{" "}
                    {t("tutors.detail.coursesOpen")}
                </p>
            </div>

            {viewedTutorClasses.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 text-gray-500">
                    <p className="text-lg font-bold mb-2 text-gray-700">
                        {t("tutors.detail.empty")}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {viewedTutorClasses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}

            {totalPages >= 1 && (
                <div className="mt-10 flex justify-center">
                    <Pagination
                        currentPage={currentPage + 1}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {/* --- PHẦN 2: ĐÁNH GIÁ TỪ HỌC VIÊN --- */}
            <TutorRatingSection tutorId={tutorId} />
        </div>
    );
};

export default TutorDetailPage;
