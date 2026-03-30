"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, CheckCircle2, User, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { 
  getAppNotifications, 
  getUnreadNotificationCount, 
  markAllAsRead, 
  markAsRead 
} from "@/lib/redux/features/modalSlice";
import { AppNotification } from "@/lib/services/notification.service";

// Hàm format thời gian 
const formatTime = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  
  const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  
  if (isToday) return `Today at ${timeString}`;
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return `Last ${days[date.getDay()]} at ${timeString}`;
};

export default function NotificationDropdown() {
  const dispatch = useAppDispatch();
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  
  // THÊM STATE ĐỂ LƯU TAB ĐANG CHỌN (Tất cả / Chưa đọc)
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD'>('ALL');
  
  const notiRef = useRef<HTMLDivElement>(null);

  // Lấy dữ liệu từ Redux Store
  const { data: notifications = [], loading, unreadCount } = useAppSelector((state) => state.modal.appNotifications) || {};

  // LỌC DANH SÁCH THÔNG BÁO DỰA TRÊN TAB ĐANG CHỌN
  const displayedNotifications = activeTab === 'ALL' 
    ? notifications 
    : notifications.filter(noti => !noti.read);

// 1. Chỉ lấy số lượng chưa đọc khi Component mới mount
  useEffect(() => {
    dispatch(getUnreadNotificationCount());
  }, [dispatch]);

  // 2. Lấy danh sách thông báo KHI VÀ CHỈ KHI Dropdown được mở ra
  useEffect(() => {
    if (isNotiOpen) {
      dispatch(getAppNotifications({ page: 1, size: 10 })); // Hoặc size 20 tùy ý bạn cho Dropdown
    }
  }, [isNotiOpen, dispatch]);
  
  // Xử lý click ra ngoài để đóng Dropdown
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

  const handleBellButton = () => {
    setIsNotiOpen(!isNotiOpen);
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(markAllAsRead());
  };

  const handleNotificationClick = (noti: AppNotification) => {
    if (!noti.read) {
      dispatch(markAsRead(noti.id));
    }
  };

  return (
    <div className="relative" ref={notiRef}>

      <button 
        className="p-2 text-gray-500 hover:text-black relative transition-colors" 
        onClick={handleBellButton}
      >
        <Bell className="w-6 h-6" strokeWidth={1.5} />
        {/* Badge đỏ hiển thị số lượng chưa đọc */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN THÔNG BÁO */}
      {isNotiOpen && (
        <div className="absolute right-0 mt-2 w-[380px] bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden flex flex-col z-50 animate-in fade-in slide-in-from-top-2">
          
          {/* Header của Dropdown */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-gray-900">Notifications</h3>
              
              {/* --- KHU VỰC TAB CHUYỂN ĐỔI --- */}
              <div className="flex items-center bg-gray-200/80 p-0.5 rounded-full">
                <button 
                  onClick={() => setActiveTab('ALL')}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all ${activeTab === 'ALL' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setActiveTab('UNREAD')}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all ${activeTab === 'UNREAD' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Unread
                </button>
              </div>
              {/* ----------------------------- */}

            </div>
            
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-[13px] text-gray-600 hover:text-gray-900 transition-colors"
                title="Mark all as read"
              >
                <CheckCircle2 className="w-[18px] h-[18px]" strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Danh sách thông báo */}
          <div className="max-h-[420px] overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : displayedNotifications.length === 0 ? (
              // Empty State linh hoạt theo Tab
              <div className="text-center py-10 text-gray-500 text-sm">
                {activeTab === 'UNREAD' ? "You have no unread notifications." : "You have no new notifications."}
              </div>
            ) : (
              // Map qua displayedNotifications thay vì notifications
              displayedNotifications.map((noti) => (
                <div 
                  key={noti.id}
                  onClick={() => handleNotificationClick(noti)}
                  className={`relative flex gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!noti.read ? 'bg-[#f4f7fc]/50' : 'bg-white'}`}
                >
                  {/* Dấu chấm xanh (Unread indicator) */}
                  {!noti.read && (
                    <div className="absolute left-2 top-5 w-2 h-2 bg-blue-500 rounded-full" />
                  )}

                  {/* Avatar */}
                  <div className="shrink-0 mt-0.5 ml-2">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {noti.metadata?.studentId ? (
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(noti.title.replace('Yêu cầu tham gia lớp mới', 'SV'))}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {/* Nội dung */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-gray-900 leading-snug">
                      <span className="font-semibold">{noti.title}</span> <br/>
                      <span className="text-gray-600">{noti.message}</span>
                    </p>

                    {/* Thời gian */}
                    <span className="text-[12px] text-gray-400 font-medium mt-1.5 inline-block">
                      {formatTime(noti.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer của Dropdown */}
          <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
            <Link 
              href="/notifications" 
              onClick={() => setIsNotiOpen(false)} 
              className="text-[13px] text-blue-600 font-semibold hover:underline"
            >
              View all notifications
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}