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
    if (
      window.confirm(
        t(
          "tutorCard.confirmApprove",
          "Bạn có chắc chắn muốn DUYỆT hồ sơ của gia sư {{name}}?",
          { name: tutor.name },
        ),
      )
    ) {
      dispatch(approveTutorApplication(tutor.id));
    }
  };

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      alert(t("tutorCard.requireRejectReason", "Vui lòng nhập lý do từ chối!"));
      return;
    }
    dispatch(
      rejectTutorApplication({ tutorId: tutor.id, reason: rejectionReason }),
    );
    setShowRejectModal(false);
  };

  const avatarUrl = tutor.avatar?.startsWith("http")
    ? tutor.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name || t("common.user", "User"))}&background=random&color=fff&bold=true`;

  return (
    <>
      {/* Sử dụng relative để căn các thẻ absolute (như nút Heart). 
        justify-between để đẩy cột thông tin sang trái, cột action sang phải.
      */}
      <div className="relative flex flex-col md:flex-row gap-6 p-6 bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Nút Heart nằm tuyệt đối ở góc trên bên phải */}
        {!isAdminView && (
          <button className="absolute top-6 right-6 text-red-400 hover:text-pink-500 transition-colors">
            <Heart size={24} />
          </button>
        )}

        {/* Khối bên trái: Chứa Avatar và Thông tin (Gộp lại để nằm chung bên trái) */}
        <div className="flex flex-col md:flex-row gap-6 flex-1">
          {/* Cột Avatar */}
          <div className="shrink-0 flex justify-center md:block">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
              <img
                src={avatarUrl}
                alt={tutor.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Cột Thông Tin */}
          <div className="flex-1 mt-2 md:mt-0 pr-12 md:pr-0">
            {" "}
            {/* Thêm pr-12 trên mobile để không đè vào nút Heart */}
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

        {/* Cột bên phải: Chứa Giá (Price) và Các nút bấm hành động (Actions).
          Sử dụng flex-col, justify-end (đẩy nút xuống dưới cùng) và items-end (căn phải).
        */}
        <div className="shrink-0 flex flex-col md:items-end justify-end mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
          {/* Cột Actions (Nút bấm) */}
          {isAdminView ? (
            <div className="flex flex-col gap-2 w-full md:w-40 mt-auto">
              {tutor.status === "PENDING" ? (
                <>
                  <button
                    onClick={handleAcceptApplication}
                    className="w-full flex justify-center items-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-sm"
                  >
                    <CheckCircle size={18} />{" "}
                    {t("tutorCard.approveBtn", "Duyệt hồ sơ")}
                  </button>
                  <button
                    onClick={() => {
                      setRejectionReason("");
                      setShowRejectModal(true);
                    }}
                    className="w-full flex justify-center items-center gap-2 py-2.5 bg-white border-2 border-red-100 hover:bg-red-50 hover:border-red-200 text-red-600 text-sm font-bold rounded-xl transition-all active:scale-95"
                  >
                    <XCircle size={18} /> {t("tutorCard.rejectBtn", "Từ chối")}
                  </button>
                </>
              ) : (
                <button
                  onClick={() =>
                    alert(
                      t(
                        "tutorCard.viewUserDetailAlert",
                        "Xem chi tiết user: {{id}}",
                        { id: tutor.id },
                      ),
                    )
                  }
                  className="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-sm"
                >
                  {t("tutorCard.viewDetailBtn", "Xem chi tiết")}
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full md:w-48 mt-auto">
              <button
                onClick={() => router.push(`/tutors/${tutor.id}`)}
                className="w-full py-2.5 bg-[#ff6b9e] hover:bg-[#ff4d8b] text-white text-sm font-semibold rounded-xl shadow-sm transition-colors border border-transparent"
              >
                {t("tutorCard.viewMoreBtn", "View more")}
              </button>
              <button
                onClick={handleSendMessage}
                className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl border border-gray-300 shadow-sm transition-colors"
              >
                {t("profile.header.messageBtn", "Send a message")}
              </button>
            </div>
          )}
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
