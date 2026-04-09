"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Clock, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next"; // Import hook dịch ngôn ngữ
// Import interface từ slice của bạn (Nhớ đổi đường dẫn nếu cần)
import { Course } from "../../../../types/course";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const router = useRouter();
  const { t } = useTranslation(); // Khởi tạo hàm t()

  // Đếm số buổi học 1 tuần một cách an toàn
  const sessionsPerWeek = course.schedules ? course.schedules.length : 0;

  return (
    <div className="flex flex-col md:flex-row border border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow bg-white">
      {/* Thumbnail */}
      <div className="w-full md:w-72 h-48 flex-shrink-0 relative bg-gray-100">
        <AuthenticatedImage
          src={course.coverImageUrl || "/images/course_img.png"}
          alt={course.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1 italic">
            {t("by")} {course.tutorName}
          </p>
          <h3
            onClick={() => router.push(`/courses/${course.id}`)}
            className={`text-xl font-bold mb-3 cursor-pointer line-clamp-2 ${
              course.status === "CANCELLED"
                ? "text-gray-400 line-through"
                : "text-slate-900 hover:text-orange-500"
            }`}
          >
            {course.name}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-[#7294ff] text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
              {course.subjectName}
            </span>
            <span className="px-3 py-1 bg-[#ff7272] text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
              {course.topicName}
            </span>
          </div>

          {/* Meta Stats */}
          <div className="flex flex-wrap gap-4 text-[11px] font-bold text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={14} className="text-orange-500" />
              {course.startDate} {course.endDate ? ` - ${course.endDate}` : ""}
            </span>
            <span className="flex items-center gap-1 uppercase">
              <BarChart3 size={14} className="text-orange-500" />
              {sessionsPerWeek} {t("sessionsPerWeek")}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end mt-4">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              course.status === "ENROLLING"
                ? "bg-green-100 text-green-600"
                : course.status === "CANCELLED"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {/* Bạn cũng có thể dùng t(`status.${course.status}`) nếu muốn dịch trạng thái */}
            {course.status}
          </span>

          {/* Ẩn nút View And Update nếu lớp đã bị hủy */}
          {course.status !== "CANCELLED" && (
            <button
              onClick={() => router.push(`/courses/${course.id}`)}
              className="text-sm font-bold text-slate-900 hover:underline"
            >
              {t("viewAndUpdate")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
