"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, CheckCircle2, User, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  getAppNotifications,
  getUnreadNotificationCount,
  markAllAsRead,
  markAsRead,
} from "@/lib/redux/features/modalSlice";
import { AppNotification } from "@/lib/services/notification.service";
import { useTranslation } from "react-i18next";

export default function NotificationDropdown() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isNotiOpen, setIsNotiOpen] = useState(false);

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
    const timeString = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (isToday)
      return t("layout.header.notifications.todayAt", { time: timeString });

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return t("layout.header.notifications.lastAt", {
      day: days[date.getDay()],
      time: timeString,
    });
  };

  const [activeTab, setActiveTab] = useState<"ALL" | "UNREAD">("ALL");
  const notiRef = useRef<HTMLDivElement>(null);
  const {
    data: notifications = [],
    loading,
    unreadCount,
  } = useAppSelector((state) => state.modal.appNotifications) || {};
  const displayedNotifications =
    activeTab === "ALL"
      ? notifications
      : notifications.filter((noti) => !noti.read);

  useEffect(() => {
    dispatch(getUnreadNotificationCount());
  }, [dispatch]);

  useEffect(() => {
    if (isNotiOpen) {
      dispatch(getAppNotifications({ page: 1, size: 10 }));
    }
  }, [isNotiOpen, dispatch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
        setIsNotiOpen(false);
      }
    }
    if (isNotiOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotiOpen]);

  const handleBellButton = () => setIsNotiOpen(!isNotiOpen);
  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(markAllAsRead());
  };
  const handleNotificationClick = (noti: AppNotification) => {
    if (!noti.read) dispatch(markAsRead(noti.id));
  };

  return (
    <div className="relative" ref={notiRef}>
      {/* [SỬA]: Giảm padding của icon trên mobile */}
      <button
        className="p-1.5 sm:p-2 text-gray-500 hover:text-black relative transition-colors"
        onClick={handleBellButton}
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-red-500 text-[9px] sm:text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isNotiOpen && (
        /* [SỬA]: Thay thế w-[380px] cứng bằng position fixed trên mobile (trải dài trừ mép) để không tràn ngang. Lên màn sm mới dùng absolute */
        <div className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-14 sm:top-full mt-0 sm:mt-2 sm:w-[380px] bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden flex flex-col z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2 sm:gap-3">
              <h3 className="font-bold text-sm sm:text-base text-gray-900">
                {t("layout.header.notifications.title")}
              </h3>
              <div className="flex items-center bg-gray-200/80 p-0.5 rounded-full">
                <button
                  onClick={() => setActiveTab("ALL")}
                  className={`text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-1 rounded-full transition-all ${activeTab === "ALL" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {t("layout.header.notifications.all")}
                </button>
                <button
                  onClick={() => setActiveTab("UNREAD")}
                  className={`text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-1 rounded-full transition-all ${activeTab === "UNREAD" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {t("layout.header.notifications.unread")}
                </button>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-[13px] text-gray-600 hover:text-gray-900 transition-colors"
                title={t("layout.header.notifications.markAllAsRead")}
              >
                <CheckCircle2
                  className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                  strokeWidth={2}
                />
              </button>
            )}
          </div>

          <div className="max-h-[60vh] sm:max-h-[420px] overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : displayedNotifications.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm">
                {activeTab === "UNREAD"
                  ? t("layout.header.notifications.emptyUnread")
                  : t("layout.header.notifications.empty")}
              </div>
            ) : (
              displayedNotifications.map((noti) => (
                <div
                  key={noti.id}
                  onClick={() => handleNotificationClick(noti)}
                  className={`relative flex gap-2.5 sm:gap-3 p-3 sm:p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!noti.read ? "bg-[#f4f7fc]/50" : "bg-white"}`}
                >
                  {!noti.read && (
                    <div className="absolute left-1.5 sm:left-2 top-5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full" />
                  )}

                  <div className="shrink-0 mt-0.5 ml-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {noti.metadata?.studentId ? (
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(noti.title.replace(t("chat.header_extra.joinRequest"), t("chat.header_extra.sv")))}&background=random`}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] sm:text-[14px] text-gray-900 leading-snug">
                      <span className="font-semibold">{noti.title}</span> <br />
                      <span className="text-gray-600 line-clamp-2 sm:line-clamp-none">
                        {noti.message}
                      </span>
                    </p>
                    <span className="text-[11px] sm:text-[12px] text-gray-400 font-medium mt-1 sm:mt-1.5 inline-block">
                      {formatTime(noti.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
            <Link
              href="/notifications"
              onClick={() => setIsNotiOpen(false)}
              className="text-[12px] sm:text-[13px] text-blue-600 font-semibold hover:underline"
            >
              {t("layout.header.notifications.viewAll")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
