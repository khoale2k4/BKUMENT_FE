
import React from "react";
import {
  Calendar,
  Briefcase,
  FileText,
  BookOpen,
  Star,
  Users,
  PlayCircle,
  MessageSquare,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { TutorData } from "@/lib/redux/features/tutorFindingSlice";

const RenderStatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const { t } = useTranslation();
  switch (status) {
    case "PENDING":
      return (
        <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
          {t("tutors.status.pending")}
        </span>
      );
    case "APPROVED":
      return (
        <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
          {t("tutors.status.approved")}
        </span>
      );
    case "REJECTED":
      return (
        <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
          {t("tutors.status.rejected")}
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
          {status}
        </span>
      );
  }
};

export const AdminTutorInfo: React.FC<{ tutor: TutorData["tutor"] }> = ({
  tutor,
}) => {
  const { t } = useTranslation();
  return (
    <>
      {/* CHANGE: flex-wrap để badge xuống hàng nếu tên dài trên mobile */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {/* CHANGE: text-xl -> text-base sm:text-xl để giảm cỡ chữ tên trên mobile */}
        <h3 className="text-base sm:text-xl font-bold text-gray-900">
          {tutor.name}
        </h3>
        {tutor.status && <RenderStatusBadge status={tutor.status} />}
      </div>

      {/* CHANGE: space-y-2 -> space-y-1.5 sm:space-y-2 để compact hơn trên mobile */}
      <div className="space-y-1.5 sm:space-y-2 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
        {tutor.createdAt && (
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400 shrink-0" />
            <span>
              <strong>{t("tutors.info.registrationDate")}</strong>{" "}
              {new Date(tutor.createdAt).toLocaleDateString()}
            </span>
          </div>
        )}
        <div className="flex items-start gap-2">
          <Briefcase size={14} className="text-gray-400 mt-0.5 shrink-0" />
          <span>
            <strong>{t("tutors.info.experience")}:</strong>{" "}
            {tutor.experience || t("profile.user.notUpdated")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-gray-400 shrink-0" />
          <span>
            <strong>CV:</strong>{" "}
          </span>
          {tutor.cvUrl && tutor.cvUrl.startsWith("http") ? (
            <a
              href={tutor.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              {t("tutors.info.viewCV")}
            </a>
          ) : (
            <span className="text-gray-400 italic">
              {t("tutors.info.noCV")}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
        {/* CHANGE: text-sm -> text-xs sm:text-sm để giảm cỡ chữ giới thiệu trên mobile */}
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          <strong>{t("tutors.info.intro")}:</strong>{" "}
          {tutor.introduction || t("tutors.info.noIntro")}
        </p>
      </div>

      {tutor.status === "REJECTED" && tutor.rejectionReason && (
        <div className="mt-3 p-3 bg-red-50 text-red-600 text-xs sm:text-sm rounded-lg border border-red-100">
          <strong>{t("tutors.status.rejectionReason")}</strong>{" "}
          {tutor.rejectionReason}
        </div>
      )}
    </>
  );
};

export const UserTutorInfo: React.FC<{
  tutor: TutorData["tutor"];
  matchingClasses: TutorData["matchingClasses"];
  totalMatchingClasses: number;
}> = ({ tutor, matchingClasses, totalMatchingClasses }) => {
  const { t } = useTranslation();
  const subject =
    matchingClasses && matchingClasses.length > 0
      ? matchingClasses[0].subjectName
      : t("tutors.info.multiSubject");

  return (
    <>
      <div className="mb-3 sm:mb-4">
        {/* CHANGE: text-xl -> text-base sm:text-xl để tên vừa màn hình nhỏ */}
        <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 leading-snug">
          {tutor.name}
        </h3>

        {/* CHANGE: text-sm -> text-xs sm:text-sm cho followers text */}
        <p className="text-xs sm:text-sm text-gray-500 mb-1">
          88K {t("tutors.info.followers")} • 1 {t("tutors.info.following")}
        </p>

        <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-gray-900 mt-2 sm:mt-3">
          <BookOpen size={15} className="text-gray-800 shrink-0" />
          <span className="truncate">{subject}</span>
        </div>
      </div>

      {/*
        CHANGE: Hàng chỉ số stats.
        text-sm -> text-xs để các badge vừa trên 1-2 hàng ở iPhone 12 Pro.
        gap-4 -> gap-x-3 gap-y-1.5 sm:gap-4 để compact hơn trên mobile.
        flex-wrap vẫn giữ để tự xuống hàng.
      */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Star size={13} className="text-amber-500 fill-amber-500 shrink-0" />
          <span>
            <strong>{tutor.averageRating?.toFixed(1) || "0.0"}</strong> Rating
          </span>
        </div>

        <div className="flex items-center gap-1 text-gray-600">
          <MessageSquare size={13} className="text-green-500 shrink-0" />
          <span>
            <strong>{tutor.ratingCount || "0"}</strong>{" "}
            {t("tutors.info.reviews")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Users size={13} className="text-blue-600 shrink-0" />
          <span>
            <strong>{"0"}</strong> {t("tutors.info.students")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <PlayCircle
            size={13}
            className="text-rose-500 fill-rose-100 shrink-0"
          />
          <span>
            <strong>{totalMatchingClasses}</strong> {t("tutors.info.courses")}
          </span>
        </div>
      </div>

      {/* CHANGE: text-sm -> text-xs sm:text-sm; pr-4 -> pr-0 vì layout đã tự xử lý padding */}
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
        {tutor.introduction || t("tutors.info.noIntro")}
      </p>
    </>
  );
};
