"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { X, ChevronRight, Users } from "lucide-react";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";

interface Participant {
  userId: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string;
}

interface MembersListModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  groupName: string;
  currentUserId: string;
}

const MembersListModal: React.FC<MembersListModalProps> = ({
  isOpen,
  onClose,
  participants,
  groupName,
  currentUserId,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleViewProfile = (userId: string) => {
    onClose();
    router.push(`/people/${userId}`);
  };

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Panel */}
      <div className="relative w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300 max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="w-8" />
          <div className="flex-1 text-center">
            <h2 className="text-[17px] font-bold text-gray-900 truncate max-w-[200px] mx-auto">
              {groupName}
            </h2>
            <p className="text-[12px] text-gray-400 mt-0.5">
              {t("chat.members.count", "{{n}} thành viên", {
                n: participants.length,
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Members list */}
        <div className="flex-1 overflow-y-auto py-2">
          {participants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
              <Users size={32} className="text-gray-200" />
              <p className="text-sm">
                {t("chat.members.empty", "Không có thành viên")}
              </p>
            </div>
          ) : (
            participants.map((p) => {
              const uid = p.userId || p.id || "";
              const fullName =
                `${p.lastName || ""} ${p.firstName || ""}`.trim() ||
                p.username ||
                "Unknown";
              const isSelf = uid === currentUserId;

              return (
                <div
                  key={uid}
                  onClick={() => !isSelf && handleViewProfile(uid)}
                  className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                    isSelf
                      ? "cursor-default"
                      : "hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
                  }`}
                >
                  {/* Avatar */}
                  <div className="shrink-0 relative">
                    <AuthenticatedImage
                      src={p.avatar || ""}
                      alt={fullName}
                      className="w-11 h-11 rounded-full object-cover bg-gray-200"
                    />
                    {isSelf && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-gray-900 truncate">
                      {fullName}
                      {isSelf && (
                        <span className="ml-1.5 text-[11px] font-normal text-gray-400">
                          ({t("chat.members.you", "Bạn")})
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Chevron for non-self members */}
                  {!isSelf && (
                    <ChevronRight
                      size={16}
                      className="text-gray-300 shrink-0"
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-semibold text-[14px] transition-colors"
          >
            {t("common.close", "Đóng")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembersListModal;
