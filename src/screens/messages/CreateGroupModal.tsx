"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  createChatAsync,
  fetchConversations,
  setActiveConversation,
} from "@/lib/redux/features/chatSlice";
import { searchProfiles } from "@/lib/redux/features/profileSlice";
import { useTranslation } from "react-i18next";
import { X, Search, Check, Users, ChevronRight, Loader2 } from "lucide-react";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SelectedUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  // Step 1: chọn thành viên | Step 2: đặt tên nhóm
  const [step, setStep] = useState<1 | 2>(1);
  const [searchValue, setSearchValue] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const groupNameRef = useRef<HTMLInputElement>(null);

  const { viewedListProfile, isViewedListProfileLoading } = useSelector(
    (state: RootState) => state.profile,
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue.trim()) {
        dispatch(
          searchProfiles({ keyword: searchValue.trim(), page: 1, size: 10 }),
        );
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchValue, dispatch]);

  // Focus input khi bước thay đổi
  useEffect(() => {
    if (step === 1) setTimeout(() => searchInputRef.current?.focus(), 100);
    if (step === 2) setTimeout(() => groupNameRef.current?.focus(), 100);
  }, [step]);

  // Reset khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setSearchValue("");
        setSelectedUsers([]);
        setGroupName("");
      }, 300);
    }
  }, [isOpen]);

  const toggleUser = (user: {
    id: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string | null;
  }) => {
    const name =
      user.fullName ||
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      "Unknown";
    setSelectedUsers((prev) =>
      prev.find((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [
            ...prev,
            { id: user.id, name, avatarUrl: user.avatarUrl || undefined },
          ],
    );
  };

  const handleCreateGroup = async () => {
    if (selectedUsers.length < 2 || !groupName.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const newChat = await dispatch(
        createChatAsync({
          type: "GROUP",
          name: groupName.trim() || "Nhóm mới",
          userIds: selectedUsers.map((u) => u.id),
        }),
      ).unwrap();

      await dispatch(fetchConversations({ page: 0, size: 10 })).unwrap();

      if (newChat?.id) {
        dispatch(setActiveConversation(newChat.id));
      }
      onClose();
    } catch (err) {
      console.error("Failed to create group:", err);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  const searchResults = viewedListProfile?.data || [];

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal panel */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300 max-h-[90vh]">
        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              {/* back chevron */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          ) : (
            <div className="w-8" />
          )}

          <h2 className="text-[17px] font-bold text-gray-900 text-center flex-1">
            {step === 1
              ? t("chat.createGroup.titleStep1", "Thêm thành viên")
              : t("chat.createGroup.titleStep2", "Đặt tên nhóm")}
          </h2>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── STEP 1 : chọn thành viên ───────────────────────────── */}
        {step === 1 && (
          <>
            {/* Search bar */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3.5 py-2">
                <Search size={15} className="text-gray-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={t(
                    "chat.createGroup.searchPlaceholder",
                    "Tìm tên người dùng...",
                  )}
                  className="flex-1 bg-transparent outline-none text-[14px] text-gray-800 placeholder:text-gray-400"
                />
                {searchValue && (
                  <button
                    onClick={() => setSearchValue("")}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Selected chips */}
            {selectedUsers.length > 0 && (
              <div className="flex gap-2 px-4 py-2.5 overflow-x-auto hide-scrollbar border-b border-gray-50">
                {selectedUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() =>
                      setSelectedUsers((prev) =>
                        prev.filter((x) => x.id !== u.id),
                      )
                    }
                    className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[12px] font-semibold px-2.5 py-1 rounded-full shrink-0 hover:bg-blue-100 transition-colors"
                  >
                    {u.avatarUrl ? (
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-blue-200 flex items-center justify-center text-[9px] font-bold text-blue-700">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {u.name.split(" ").slice(-1)[0]}
                    <X size={11} />
                  </button>
                ))}
              </div>
            )}

            {/* Search results */}
            <div className="flex-1 overflow-y-auto">
              {!searchValue.trim() ? (
                <div className="flex flex-col items-center justify-center py-14 text-gray-400 gap-3">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                    <Users size={24} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-medium">
                    {t(
                      "chat.createGroup.searchHint",
                      "Tìm kiếm để thêm thành viên",
                    )}
                  </p>
                </div>
              ) : isViewedListProfileLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 size={24} className="animate-spin text-gray-400" />
                </div>
              ) : searchResults.length === 0 ? (
                <p className="text-center py-10 text-sm text-gray-400">
                  {t("chat.createGroup.noResults", 'Không tìm thấy "{{q}}"', {
                    q: searchValue,
                  })}
                </p>
              ) : (
                <div className="py-2">
                  {searchResults.map((user) => {
                    const isSelected = selectedUsers.some(
                      (u) => u.id === user.id,
                    );
                    const displayName =
                      user.fullName ||
                      `${user.firstName || ""} ${user.lastName || ""}`.trim();
                    return (
                      <div
                        key={user.id}
                        onClick={() => toggleUser(user)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={displayName}
                              className="w-11 h-11 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-base">
                              {displayName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-semibold text-gray-900 truncate">
                            {displayName}
                          </p>
                          <p className="text-[12px] text-gray-400 truncate">
                            {user.university || "Thành viên"}
                          </p>
                        </div>

                        {/* Checkbox */}
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                            isSelected
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <Check
                              size={13}
                              className="text-white"
                              strokeWidth={3}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer CTA */}
            <div className="px-4 py-4 border-t border-gray-100">
              <button
                onClick={() => setStep(2)}
                disabled={selectedUsers.length < 2}
                className="w-full flex items-center justify-between bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 px-5 rounded-full text-[15px] transition-all disabled:cursor-not-allowed"
              >
                <span>
                  {selectedUsers.length < 2
                    ? t(
                        "chat.createGroup.selectAtLeast2",
                        "Chọn ít nhất 2 người",
                      )
                    : t("chat.createGroup.nextBtn", "Tiếp theo ({{n}} người)", {
                        n: selectedUsers.length,
                      })}
                </span>
                {selectedUsers.length >= 2 && <ChevronRight size={18} />}
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2 : đặt tên nhóm ──────────────────────────────── */}
        {step === 2 && (
          <>
            {/* Group avatar preview + name input */}
            <div className="flex flex-col items-center px-6 py-8 gap-5">
              {/* Generated avatar from initials */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
                <Users size={34} className="text-white" />
              </div>

              {/* Group name input */}
              <div className="w-full">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">
                  {t("chat.createGroup.groupNameLabel", "Tên nhóm")}
                </label>
                <input
                  ref={groupNameRef}
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
                  placeholder={t(
                    "chat.createGroup.groupNamePlaceholder",
                    "Nhập tên nhóm...",
                  )}
                  className="w-full text-center text-[17px] font-semibold text-gray-900 bg-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Selected members preview */}
            <div className="px-5 pb-4">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                {t("chat.createGroup.membersLabel", "Thành viên ({{n}})", {
                  n: selectedUsers.length,
                })}
              </p>
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                {selectedUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex flex-col items-center gap-1 shrink-0 w-14"
                  >
                    {u.avatarUrl ? (
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-[10px] text-gray-500 truncate w-full text-center">
                      {u.name.split(" ").slice(-1)[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer CTA */}
            <div className="px-4 py-4 border-t border-gray-100">
              <button
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || isCreating}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 px-5 rounded-full text-[15px] transition-all disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Users size={17} />
                    {t("chat.createGroup.createBtn", "Tạo nhóm")}
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateGroupModal;
