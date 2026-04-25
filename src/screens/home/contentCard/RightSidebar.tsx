"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Star, BookOpen, Calendar, UserCircle } from "lucide-react";
import clsx from "clsx";
import { AppRoute } from "@/lib/appRoutes";
import { PersonMayKnow } from "@/lib/services/article.service";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
interface RightSidebarProps {
  peopleMayKnow: PersonMayKnow[];
  tutors: any; // Thay 'any' bằng interface Tutor thực tế của bạn
  followingIds: string[];
  followingLoading: Set<string>;
  onFollow: (person: PersonMayKnow) => void;
  onPersonClick: (person: PersonMayKnow) => void;
  onTabChange: (tab: string) => void;
}

export default function RightSidebar({
  peopleMayKnow,
  tutors,
  followingIds,
  followingLoading,
  onFollow,
  onPersonClick,
  onTabChange,
}: RightSidebarProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const promoCourses = [...(tutors.data || tutors)]
    .flatMap((item: any) => item.matchingClasses || [])
    .filter(Boolean) // Lọc bỏ các giá trị null/undefined
    .slice(0, 5); // Lấy tối đa 5 khóa học để chạy quảng cáo

  console.log("🚀 ~ file: RightSidebar.tsx:34 ~ promoCourses:", promoCourses);

  return (
    <aside className="hidden xl:block w-80 pl-10 py-8 border-l border-gray-100">
      {/* 1. RECOMMENDED TOPICS */}
      <div>
        <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
          {t("home.sidebar.recommended")}
        </h3>
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            "Technology",
            "Money",
            "Business",
            "Productivity",
            "Art",
            "Mindfulness",
          ].map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-700 cursor-pointer hover:bg-gray-200 transition"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 2. WHO TO FOLLOW */}
      <div className="mb-10">
        <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
          <UserCircle size={20} className="text-gray-500" />
          Who to follow
        </h3>
        <div className="flex flex-col gap-5">
          {peopleMayKnow.slice(0, 3).map((user) => {
            const isFollowed = followingIds.includes(user.id);
            const isLoading = followingLoading.has(user.id);

            return (
              <div key={user.id} className="flex items-start gap-3">
                {user.avatarUrl ? (
                  <AuthenticatedImage
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shrink-0">
                    <span className="font-semibold text-gray-600">
                      {user.fullName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h4
                    className="text-[15px] font-bold text-gray-900 truncate cursor-pointer hover:underline"
                    onClick={() => onPersonClick(user)}
                  >
                    {user.fullName}
                  </h4>
                  <p className="text-[13px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                    {user.university || "Sinh viên HCMUT"}
                  </p>
                </div>

                <button
                  onClick={() => onFollow(user)}
                  disabled={isFollowed || isLoading}
                  className={clsx(
                    "shrink-0 px-4 py-1.5 rounded-full border text-[13px] font-medium transition",
                    isFollowed
                      ? "bg-gray-100 text-gray-400 border-gray-200"
                      : "border-gray-900 text-gray-900 hover:bg-gray-50 hover:shadow-sm",
                  )}
                >
                  {isFollowed ? "Following" : "Follow"}
                </button>
              </div>
            );
          })}
        </div>
        <button
          className="text-[13px] text-gray-500 hover:text-gray-900 mt-5 transition"
          onClick={() => onTabChange("People")}
        >
          See more suggestions
        </button>
      </div>

      {/* 3. TOP RATED TUTORS */}
      <div>
        <h3 className="font-bold text-gray-900 mb-5  flex items-center gap-2">
          <Star size={16} className="fill-orange-500 text-orange-500" />
          Top-rated tutors
        </h3>
        {/* <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <Star size={16} className="fill-orange-500 text-orange-500" />
            Khóa học nổi bật
          </h3> */}
        <div className="flex flex-col gap-5">
          {[...(tutors.data || tutors)]
            .sort((a: any, b: any) => {
              const ratingA = a.tutor?.averageRating || 0;
              const ratingB = b.tutor?.averageRating || 0;
              return ratingB - ratingA;
            })
            .slice(0, 3)
            .map((item: any) => {
              const tutorInfo = item.tutor;
              const isValidAvatar =
                tutorInfo.avatar && tutorInfo.avatar.startsWith("http");
              const fallbackAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                tutorInfo.name || t("common.unknownAuthor"),
              )}&background=random&color=fff&bold=true`;

              return (
                <div key={tutorInfo.id} className="flex items-center gap-3">
                  {isValidAvatar ? (
                    <AuthenticatedImage
                      src={tutorInfo.avatar}
                      alt={tutorInfo.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <img
                      src={fallbackAvatarUrl}
                      alt={tutorInfo.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-bold text-gray-900 truncate">
                      {tutorInfo.name.slice(7, 20)}{" "}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[13px] text-gray-500 mt-0.5">
                      <span className="truncate">
                        {tutorInfo.introduction || "Gia sư"}
                      </span>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center text-orange-500 font-medium">
                        <Star size={13} className="fill-orange-500 mr-0.5" />
                        {tutorInfo.averageRating
                          ? tutorInfo.averageRating.toFixed(1)
                          : "5.0"}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/tutors/${tutorInfo.id}`)}
                    className="shrink-0 px-4 py-1.5 rounded-full border border-orange-500 text-[13px] font-medium text-orange-600 hover:bg-orange-50 transition"
                  >
                    View
                  </button>
                </div>
              );
            })}
        </div>
        <button
          onClick={() => router.push(AppRoute.tutors)}
          className="text-[13px] text-gray-500 hover:text-gray-900 mt-5 transition"
        >
          Find more tutors
        </button>
      </div>

      {promoCourses.length > 0 && (
        <div className="mt-10">
          {/* Tiêu đề nằm ngoài, đồng bộ style với Top-rated tutors */}
          <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <Star size={16} className="fill-orange-500 text-orange-500" />
            Khóa học nổi bật
          </h3>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            loop={promoCourses.length > 1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            // Thêm padding bottom để nhường chỗ cho dấu chấm
            className="w-full pb-8 promo-slider"
          >
            {promoCourses.map((course: any) => {
              // Xử lý avatar gia sư dự phòng trong thẻ khóa học
              const isValidTutorAvatar =
                course.tutorAvatar && course.tutorAvatar.startsWith("http");
              const fallbackTutorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                course.tutorName || "Gia Sư",
              )}&background=random&color=fff&bold=true`;

              // Nếu khóa học không có ảnh cover, dùng 1 ảnh mặc định về học tập
              const coverImage =
                course.coverImageUrl ||
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop";

              return (
                <SwiperSlide key={course.id}>
                  <div
                    onClick={() => router.push(`/courses/${course.id}`)}
                    className="relative w-full h-[220px] rounded-2xl overflow-hidden cursor-pointer group shadow-sm border border-gray-100"
                  >
                    {/* Ảnh Nền Khóa Học */}
                    <AuthenticatedImage
                      src={coverImage}
                      alt={course.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Lớp phủ Gradient (Làm mờ/tối ảnh để chữ nổi lên) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>

                    {/* Nội dung đè lên trên ảnh */}
                    <div className="absolute inset-0 p-5 flex flex-col justify-end">
                      {/* Tên môn học (Tag) */}
                      <span className="w-fit bg-orange-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-md mb-2.5 shadow-sm">
                        {course.subjectName}
                      </span>

                      {/* Tên khóa học */}
                      <h4 className="font-bold text-[16px] text-white leading-snug mb-3 line-clamp-2 group-hover:text-orange-300 transition-colors">
                        {course.name}
                      </h4>

                      {/* Thông tin Gia sư & Ngày khai giảng */}
                      <div className="flex items-center justify-between border-t border-white/20 pt-3 mt-auto">
                        {/* Gia sư */}
                        <div className="flex items-center gap-2 text-gray-200 text-[12px] font-medium min-w-0">
                          <img
                            src={
                              isValidTutorAvatar
                                ? course.tutorAvatar
                                : fallbackTutorAvatar
                            }
                            alt={course.tutorName}
                            className="w-5 h-5 rounded-full object-cover border border-white/30 shrink-0"
                          />
                          <span className="truncate">{course.tutorName}</span>
                        </div>

                        {/* Ngày tháng */}
                        <div className="flex items-center gap-1.5 text-gray-300 text-[11px] shrink-0">
                          <Calendar size={12} />
                          <span>
                            {new Date(course.startDate).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* CSS tùy chỉnh dấu chấm để hợp với nền trắng */}
          <style jsx global>{`
            .promo-slider .swiper-pagination-bullet {
              background-color: #d1d5db; /* Xám nhạt */
              opacity: 1;
              width: 6px;
              height: 6px;
              transition: all 0.3s ease;
            }
            .promo-slider .swiper-pagination-bullet-active {
              background-color: #f97316; /* Cam nổi bật */
              width: 16px; /* Kéo dài dấu chấm active ra một chút cho hiện đại */
              border-radius: 4px;
            }
          `}</style>
        </div>
      )}
    </aside>
  );
}
