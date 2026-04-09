"use client";

import React, { useState } from "react";
import { Trash2, Loader2, UserPlus, Clock, CheckCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { cancelClass } from "@/lib/redux/features/tutorCourseSlice";
import { enrollInClass } from "@/lib/redux/features/tutorFindingSlice";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

// 1. Import thư viện parser và component AuthenticatedImage
import parse, { Element, HTMLReactParserOptions } from "html-react-parser";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage"; // <-- Điều chỉnh đường dẫn này nếu cần

interface OverviewTabProps {
  courseId: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ courseId }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isCanceling, setIsCanceling] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Lấy User ID hiện tại để so sánh xem họ có phải là Gia sư của lớp không
  const tutorId = useAppSelector((state) => state.profile.tutor?.id);
  console.log("Tutor ID từ Redux:", tutorId);

  // Lấy dữ liệu chi tiết khóa học
  const { currentClassDetail: currentCourse } = useAppSelector(
    (state) => state.tutorFinding,
  );
  console.log("Chi tiết lớp học từ Redux:", currentCourse);
  console.log("userStatus từ Redux:", currentCourse?.userStatus);

  const handleCancel = async (id: string) => {
    if (
      window.confirm(
        t(
          "classroom.overview.cancelConfirm",
          "Are you sure you want to cancel this class? This action cannot be undone.",
        ),
      )
    ) {
      setIsCanceling(true);
      const result = await dispatch(cancelClass(id));
      setIsCanceling(false);

      if (cancelClass.fulfilled.match(result)) {
        alert(
          t(
            "classroom.overview.cancelSuccess",
            "Class cancelled successfully!",
          ),
        );
        router.push("/profile");
      } else {
        alert(t("common.error", "Error") + ": " + result.payload);
      }
    }
  };

  const handleEnroll = async () => {
    setIsEnrolling(true);
    const result = await dispatch(enrollInClass(courseId));
    setIsEnrolling(false);

    if (enrollInClass.fulfilled.match(result)) {
      alert(
        t(
          "classroom.overview.enrollSuccess",
          "Enrollment request sent successfully! Please wait for tutor approval.",
        ),
      );
    } else {
      alert(
        t("classroom.overview.enrollFail", "Enrollment failed: ") +
          result.payload,
      );
    }
  };

  if (!currentCourse) {
    return <div className="bg-gray-100 rounded-2xl h-64 animate-pulse"></div>;
  }

  const isAlreadyCancelled = currentCourse.status === "CANCELLED";
  const isEnrollingStatus = currentCourse.status === "ENROLLING";

  console.log("userstatus của lớp:", currentCourse.userStatus);
  console.log("mo ta lop hoc truoc khi render:", currentCourse.description);

  // 2. Cấu hình Parser để "bắt" thẻ img và thay bằng AuthenticatedImage
  const parseOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === "img") {
        return (
          <AuthenticatedImage
            src={domNode.attribs.src}
            alt={domNode.attribs.alt || "Hình ảnh khóa học"}
            className="w-full h-auto rounded-lg my-6 object-cover shadow-sm border border-gray-100"
          />
        );
      }
    },
  };

  return (
    <div className="bg-[#f9f9f9] rounded-2xl p-8 border border-gray-100 shadow-sm animate-in fade-in duration-500 flex flex-col min-h-[400px] justify-between">
      {/* 3. Render HTML bằng html-react-parser */}
      <div className="space-y-9 text-gray-700 leading-relaxed text-[16px] prose max-w-none">
        {parse(
          currentCourse.description ||
            "<p>Chưa có mô tả chi tiết cho lớp học này.</p>",
          parseOptions,
        )}
      </div>

      <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
        {currentCourse.userStatus == "OWNER" && (
          <>
            {" "}
            <button
              onClick={() => handleCancel(courseId)}
              disabled={isCanceling || isAlreadyCancelled}
              className={`flex items-center gap-2 px-6 py-2.5 font-bold text-sm rounded-full transition-all shadow-sm 
              ${
                isAlreadyCancelled
                  ? "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-500 active:scale-95"
              }`}
            >
              {isCanceling ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              {isAlreadyCancelled ? "Lớp Đã Hủy" : "Hủy Lớp Học"}
            </button>
          </>
        )}

        {(currentCourse.userStatus == "NONE" ||
          currentCourse.userStatus == "REJECTED") && (
          <>
            {" "}
            <button
              onClick={handleEnroll}
              disabled={isEnrolling || isAlreadyCancelled || !isEnrollingStatus}
              className={`flex items-center gap-2 px-6 py-2.5 font-bold text-sm rounded-full transition-all shadow-sm 
              ${
                isAlreadyCancelled || !isEnrollingStatus
                  ? "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-orange-500 border border-orange-500 text-white hover:bg-orange-600 active:scale-95"
              }`}
            >
              {isEnrolling ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <UserPlus size={16} />
              )}
              {isAlreadyCancelled
                ? "Lớp Đã Hủy"
                : !isEnrollingStatus
                  ? "Đã Đóng Đăng Ký"
                  : "Đăng Ký Tham Gia"}
            </button>
          </>
        )}

        {/* --- THIẾT KẾ MỚI CHO TRẠNG THÁI APPROVED --- */}
        {currentCourse.userStatus == "APPROVED" && (
          <div className="flex items-center gap-2.5 px-6 py-2.5 bg-green-50 border border-green-200 text-green-700 rounded-full font-semibold text-sm shadow-sm cursor-default">
            <CheckCircle size={18} className="text-green-600" />
            <span>
              {t(
                "classroom.overview.status.member",
                "You are a member of this class",
              )}
            </span>
          </div>
        )}

        {/* --- THIẾT KẾ MỚI CHO TRẠNG THÁI PENDING --- */}
        {currentCourse.userStatus == "PENDING" && (
          <div className="flex items-center gap-2.5 px-6 py-2.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full font-semibold text-sm shadow-sm cursor-wait">
            <Clock size={18} className="text-amber-600 animate-pulse" />
            <span>
              {t(
                "classroom.overview.status.pending",
                "Waiting for tutor approval...",
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;
