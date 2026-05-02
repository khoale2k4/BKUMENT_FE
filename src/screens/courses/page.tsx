"use client";

import React, { useState, useEffect } from "react";
// [Mobile UI:] Thêm useRouter để xử lý nút Back
import { useParams, useRouter } from "next/navigation";
// [Mobile UI:] Thêm icon ArrowLeft cho nút Back
import { Loader2, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

import {
  getClassDetailsById,
  clearClassDetail,
} from "@/lib/redux/features/tutorFindingSlice";

import CourseHeader from "./components/CourseHeader";
import OverviewTab from "./tabs/OverviewTab";
import MembersTab from "./tabs/MemberTabs/MembersTabs";
import ResourcesTab from "./tabs/ResoursesTabs";
import NotificationsTab from "./tabs/NotificationTabs/NotificationTabs";

const CoursePage = () => {
  const { t } = useTranslation();
  const params = useParams();
  // [Mobile UI:] Khởi tạo router
  const router = useRouter();
  const courseId = params.id as string;

  const dispatch = useAppDispatch();

  const { currentClassDetail, loadingClassDetail, errorClassDetail } =
    useAppSelector((state) => state.tutorFinding);

  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    {
      id: "Overview",
      labelKey: "classroom.tabs.overview",
      labelDefault: "Overview",
    },
    {
      id: "Members",
      labelKey: "classroom.tabs.members",
      labelDefault: "Members",
    },
    {
      id: "Resources",
      labelKey: "classroom.tabs.resources",
      labelDefault: "Resources",
    },
    {
      id: "Notification",
      labelKey: "classroom.tabs.notification",
      labelDefault: "Notification",
    },
  ];

  useEffect(() => {
    if (courseId) {
      dispatch(getClassDetailsById(courseId));
    } else {
      console.error("Course ID is missing in URL parameters.");
    }

    return () => {
      dispatch(clearClassDetail());
    };
  }, [dispatch, courseId]);

  if (loadingClassDetail) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">
          {t("classroom.loading", "Loading classroom data...")}
        </p>
      </div>
    );
  }

  if (errorClassDetail) {
    return (
      // [Mobile UI:] Căn lề padding px-4 để hộp lỗi không bị sát mép trên mobile
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="bg-red-50 text-red-500 p-6 sm:p-8 rounded-2xl border border-red-100 max-w-lg w-full text-center font-medium shadow-sm">
          <p>{t("classroom.errorLoad", "Could not load this classroom.")}</p>
          <p className="text-sm mt-2 opacity-80 break-words">
            {t("errors.details", "Error details")}: {errorClassDetail}
          </p>
        </div>
      </div>
    );
  }

  if (!currentClassDetail) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">
          {t("classroom.notFound", "Classroom information not found.")}
        </p>
      </div>
    );
  }

  return (
    // [Mobile UI:] Giảm padding trên mobile (px-3 py-6 thay vì px-6 py-10) để tận dụng không gian
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10 bg-white min-h-screen animate-in fade-in duration-500">
      {/* [Mobile UI:] Thêm nút Trở về trang trước */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-black font-medium transition-colors w-fit px-3 py-1.5 rounded-full hover:bg-gray-100 mb-4 sm:mb-6"
      >
        <ArrowLeft size={18} />
        <span className="text-sm sm:text-base">
          {t("common.back", "Trở lại")}
        </span>
      </button>

      <CourseHeader courseId={courseId} />

      {/* [Mobile UI:] Thêm overflow-x-auto, whitespace-nowrap để vuốt ngang trên mobile nếu tên Tab quá dài */}
      <div className="flex overflow-x-auto overflow-y-hidden border border-gray-200 rounded-xl mb-6 sm:mb-8 shadow-sm [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            // [Mobile UI:] Thu nhỏ text và padding trên mobile, thêm min-w để tránh button bị bóp méo
            className={`flex-1 min-w-[110px] sm:min-w-0 py-3 sm:py-4 px-2 text-center font-bold text-sm sm:text-base transition-all whitespace-nowrap
              ${
                activeTab === tab.id
                  ? "text-orange-500 bg-white border-b-2 border-orange-500"
                  : "text-gray-700 bg-white hover:bg-gray-50 border-r border-gray-100 last:border-r-0"
              }`}
          >
            {t(tab.labelKey, tab.labelDefault)}
          </button>
        ))}
      </div>

      <div className="min-h-[300px]">
        {activeTab === "Overview" && <OverviewTab courseId={courseId} />}
        {activeTab === "Members" && <MembersTab courseId={courseId} />}
        {activeTab === "Resources" && <ResourcesTab />}
        {activeTab === "Notification" && NotificationsTab && (
          <NotificationsTab courseId={courseId} />
        )}
      </div>
    </div>
  );
};

export default CoursePage;
