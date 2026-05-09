"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Heart, CheckCircle, XCircle, MessageCircle } from "lucide-react";
import {
  TutorData,
  approveTutorApplication,
  rejectTutorApplication,
} from "@/lib/redux/features/tutorFindingSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setPendingTargetUserId } from "@/lib/redux/features/chatSlice";

import { RejectModal } from "./RejectModal";
import { AdminTutorInfo, UserTutorInfo } from "./TutorInfor";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";

interface TutorCardProps {
  data: TutorData;
}

const TutorCard: React.FC<TutorCardProps> = ({ data }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { tutor, matchingClasses, totalMatchingClasses } = data;
  const { currentRole } = useAppSelector((state) => state.auth);
  const isAdminView = currentRole === "ADMIN" || currentRole === "MODERATOR";

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleSendMessage = () => {
    dispatch(setPendingTargetUserId(tutor.id));
    router.push("/messages");
  };

  const handleAcceptApplication = () => {
    if (window.confirm(t("tutors.card.confirmApprove", { name: tutor.name }))) {
      dispatch(approveTutorApplication(tutor.id));
    }
  };

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      alert(t("tutors.card.requireRejectReason"));
      return;
    }
    dispatch(
      rejectTutorApplication({ tutorId: tutor.id, reason: rejectionReason }),
    );
    setShowRejectModal(false);
  };

  // CHANGE: Sử dụng Pravatar để tạo ảnh chân dung người thật ngẫu nhiên
  // u=${tutor.id} giúp mỗi gia sư luôn có một ảnh cố định không bị đổi khi reload
  const fallbackAvatar = `https://i.pravatar.cc/256?u=${tutor.id || "default"}`;

  const avatarUrl = tutor.avatar?.startsWith("http")
    ? tutor.avatar
    : fallbackAvatar;

  return (
    <>
      <div className="relative p-4 sm:p-6 bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Nút Heart — vẫn ở góc trên phải */}
        {!isAdminView && (
          <button className="absolute top-4 right-4 sm:top-6 sm:right-6 text-red-400 hover:text-pink-500 transition-colors z-10">
            <Heart size={22} />
          </button>
        )}

        <div className="flex flex-col md:flex-row md:gap-6">
          {/* === PHẦN TRÊN (MOBILE): Avatar + Info nằm ngang === */}
          <div className="flex flex-row gap-4 md:gap-6 flex-1">
            {/* Cột Avatar */}
            <div className="shrink-0">
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
                <AuthenticatedImage
                  src={avatarUrl}
                  alt={tutor.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Cột Thông Tin */}
            <div className="flex-1 min-w-0 pr-8 sm:pr-2 md:pr-0 mt-1 md:mt-2">
              {isAdminView ? (
                <AdminTutorInfo tutor={tutor} />
              ) : (
                <UserTutorInfo
                  tutor={tutor}
                  matchingClasses={matchingClasses}
                  totalMatchingClasses={totalMatchingClasses ?? 0}
                />
              )}
            </div>
          </div>

          {/* === PHẦN DƯỚI (MOBILE): Action buttons === */}
          <div className="shrink-0 flex flex-col md:items-end md:justify-end mt-4 pt-4 border-t border-gray-100 md:border-t-0 md:mt-0 md:pt-0">
            {isAdminView ? (
              <div className="flex flex-row md:flex-col gap-2 w-full md:w-40 mt-auto">
                {tutor.status === "PENDING" ? (
                  <>
                    <button
                      onClick={handleAcceptApplication}
                      className="flex-1 md:flex-none md:w-full flex justify-center items-center gap-1.5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all active:scale-95 shadow-sm"
                    >
                      <CheckCircle size={16} /> {t("tutors.card.approveBtn")}
                    </button>
                    <button
                      onClick={() => {
                        setRejectionReason("");
                        setShowRejectModal(true);
                      }}
                      className="flex-1 md:flex-none md:w-full flex justify-center items-center gap-1.5 py-2.5 bg-white border-2 border-red-100 hover:bg-red-50 hover:border-red-200 text-red-600 text-xs sm:text-sm font-bold rounded-xl transition-all active:scale-95"
                    >
                      <XCircle size={16} /> {t("tutors.card.rejectBtn")}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() =>
                      alert(
                        t("tutors.card.viewUserDetailAlert", { id: tutor.id }),
                      )
                    }
                    className="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl transition-all active:scale-95 shadow-sm"
                  >
                    {t("tutors.card.viewDetailBtn")}
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-row md:flex-col gap-2 md:gap-3 w-full md:w-48 mt-auto">
                <button
                  onClick={() => router.push(`/tutors/${tutor.id}`)}
                  className="flex-1 md:flex-none py-2.5 bg-[#ff6b9e] hover:bg-[#ff4d8b] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors border border-transparent"
                >
                  {t("tutors.card.viewMoreBtn")}
                </button>
                <button
                  onClick={handleSendMessage}
                  className="flex-1 md:flex-none py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold rounded-xl border border-gray-300 shadow-sm transition-colors"
                >
                  {t("tutors.card.messageBtn")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <RejectModal
        isOpen={showRejectModal}
        tutorName={tutor.name || ""}
        reason={rejectionReason}
        onReasonChange={setRejectionReason}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleConfirmReject}
      />
    </>
  );
};

export default TutorCard;
