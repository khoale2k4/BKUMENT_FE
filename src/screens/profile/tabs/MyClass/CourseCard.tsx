"use client";

import React, { useState, useEffect } from "react"; // 👉 Thêm useState, useEffect
import { useRouter } from "next/navigation";
import { Clock, BarChart3, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Course } from "../../../../types/course";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";
// 👉 Import ratingService để gọi API lấy tổng số sao
import * as ratingService from "@/lib/services/rating.service"; 

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const router = useRouter();
  const { t } = useTranslation();

  // 👉 1. Khai báo local state để lưu thông tin rating của riêng lớp học này
  const [ratingData, setRatingData] = useState<{
    averageScore: number;
    totalReviews: number;
  } | null>(null);
  const [isLoadingRating, setIsLoadingRating] = useState(false);

  // 👉 2. Gọi API lấy dữ liệu khi component được mount hoặc course.id thay đổi
  useEffect(() => {
    if (course.id) {
      setIsLoadingRating(true);
      ratingService
        .getClassesRatingSummary(course.id)
        .then((res) => {
          setRatingData({
            // Lưu ý: API trong rating.service.ts trả về là averageScore chứ không phải averageRating
            averageScore: res?.averageScore || 0,
            totalReviews: res?.totalReviews || 0,
          });
        })
        .catch((err) => {
          console.error("Lỗi khi lấy rating cho lớp:", course.id, err);
        })
        .finally(() => {
          setIsLoadingRating(false);
        });
    }
  }, [course.id]);

  const sessionsPerWeek = course.schedules ? course.schedules.length : 0;

  return (
    <div className="flex flex-col md:flex-row border border-gray-200 rounded-2xl md:rounded-3xl overflow-hidden hover:shadow-lg transition-shadow bg-white">
      {/* Thumbnail */}
      <div className="w-full h-44 md:w-72 md:h-48 flex-shrink-0 relative bg-gray-100">
        <AuthenticatedImage
          src={course.coverImageUrl || "/images/course_img.png"}
          alt={course.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 flex-grow flex flex-col justify-between">
        <div>
          <p className="text-[11px] sm:text-xs text-gray-500 mb-1 italic">
            {t("profile.classes.by")} {course.tutorName}
          </p>
          <h3
            onClick={() => router.push(`/courses/${course.id}`)}
            className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 cursor-pointer line-clamp-2 active:opacity-70 ${
              course.status === "CANCELLED"
                ? "text-gray-400 line-through"
                : "text-slate-900 hover:text-orange-500"
            }`}
          >
            {course.name}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#7294ff] text-white text-[9px] sm:text-[10px] font-bold rounded-md uppercase tracking-wider">
              {course.subjectName}
            </span>
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#ff7272] text-white text-[9px] sm:text-[10px] font-bold rounded-md uppercase tracking-wider">
              {course.topicName}
            </span>
          </div>

          {/* Meta Stats */}
          <div className="flex flex-wrap gap-2 sm:gap-4 text-[10px] sm:text-[11px] font-bold text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-orange-500 shrink-0" />
              <span className="truncate max-w-[160px]">
                {course.startDate}
                {course.endDate ? ` - ${course.endDate}` : ""}
              </span>
            </span>
            <span className="flex items-center gap-1 uppercase">
              <BarChart3 size={12} className="text-orange-500 shrink-0" />
              {course.schedules.length} {t("profile.classes.sessionsPerWeek")}
            </span>

            {/* 👉 3. Thay đổi phần hiển thị Rating dựa trên Local State */}
            <span className="flex items-center gap-1 uppercase">
              {isLoadingRating ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                `${ratingData?.averageScore?.toFixed(1) || "0.0"} ⭐`
              )}
            </span>

            {/* 👉 4. Thay đổi phần hiển thị số lượng Reviews dựa trên Local State */}
            <span className="flex items-center gap-1 uppercase">
              {isLoadingRating ? (
                "..."
              ) : (
                `${ratingData?.totalReviews || 0} ${t("profile.classes.reviews")}`
              )}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-3 sm:mt-4 pt-3 border-t border-gray-50">
          <span
            className={`text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full ${
              course.status === "ENROLLING"
                ? "bg-green-100 text-green-600"
                : course.status === "CANCELLED"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {t(`profile.status.${course.status}`)}
          </span>

          {course.status !== "CANCELLED" && (
            <button
              onClick={() => router.push(`/courses/${course.id}`)}
              className="text-xs sm:text-sm font-bold text-slate-900 hover:underline active:opacity-70"
            >
              {t("profile.classes.viewAndUpdate")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;