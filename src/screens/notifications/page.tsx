"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { 
    getAppNotifications, 
    getUnreadNotificationCount, 
    markAsRead, 
    markAllAsRead 
} from "@/lib/redux/features/modalSlice";
import { Loader2, Bell, CheckCheck, Inbox } from "lucide-react";
import { AppNotification } from "@/lib/services/notification.service";
import Pagination from "@/components/ui/Pagination"; // <-- Thay đổi đường dẫn cho đúng với dự án của bạn

const timeAgo = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const days = Math.floor(seconds / (3600 * 24));
    if (days > 0) return `${days} ngày trước`;
    const hours = Math.floor(seconds / 3600);
    if (hours > 0) return `${hours} giờ trước`;
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) return `${minutes} phút trước`;
    return "Vừa xong";
};

const NotificationsPage = () => {
    const dispatch = useAppDispatch();
    
    // Lấy dữ liệu từ Redux
    const { 
        data: notifications = [], 
        loading, 
        unreadCount,
        currentPage = 1, // Mặc định là 1 (nếu API base-1)
        totalPages = 1
    } = useAppSelector((state) => state.modal.appNotifications) || {};

    const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD'>('ALL');

    useEffect(() => {
        // Load mặc định trang đầu tiên (index 1) khi mới vào
        dispatch(getAppNotifications({ page: 1, size: 5 }));
        dispatch(getUnreadNotificationCount());
    }, [dispatch]);

    const handleMarkAsRead = (noti: AppNotification) => {
        if (!noti.read) {
            dispatch(markAsRead(noti.id));
        }
    };

    const handleMarkAllRead = () => {
        dispatch(markAllAsRead());
    };

    // Lọc data hiển thị theo Tab
    const displayedNotifications = activeTab === 'ALL' 
        ? notifications 
        : notifications.filter(noti => !noti.read);

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 font-sans">
            <div className="max-w-3xl mx-auto">
                
                {/* Header Container */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Thông báo</h1>
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm animate-in zoom-in">
                                {unreadCount} mới
                            </span>
                        )}
                    </div>
                    
                    {unreadCount > 0 && (
                        <button 
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-all active:scale-95"
                        >
                            <CheckCheck size={16} strokeWidth={2.5} />
                            Đánh dấu tất cả đã đọc
                        </button>
                    )}
                </div>

                {/* --- KHU VỰC TABS --- */}
                <div className="flex items-center gap-2 mb-4 bg-gray-200/60 p-1 rounded-xl w-fit">
                    <button 
                        onClick={() => setActiveTab('ALL')}
                        className={`text-sm font-semibold px-5 py-2 rounded-lg transition-all ${activeTab === 'ALL' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Tất cả
                    </button>
                    <button 
                        onClick={() => setActiveTab('UNREAD')}
                        className={`text-sm font-semibold px-5 py-2 rounded-lg transition-all ${activeTab === 'UNREAD' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Chưa đọc
                    </button>
                </div>

                {/* Notifications Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                    <div className="flex flex-col">
                        
                        {/* LOADING STATE */}
                        {loading && notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                                <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
                                <span className="text-sm font-medium">Đang tải thông báo...</span>
                            </div>
                        ) : displayedNotifications.length === 0 ? (
                            
                            // EMPTY STATE
                            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                                    <Inbox size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">
                                    {activeTab === 'UNREAD' ? 'Không có thông báo chưa đọc' : 'Bạn đã xem hết thông báo'}
                                </h3>
                                <p className="text-sm text-slate-500 max-w-sm">
                                    {activeTab === 'UNREAD' 
                                        ? 'Bạn đã đọc tất cả thông báo trên trang này.' 
                                        : 'Hiện tại không có tin tức hay yêu cầu mới nào. Khi có cập nhật mới, chúng tôi sẽ báo cho bạn ngay!'}
                                </p>
                            </div>

                        ) : (
                            
                            // DANH SÁCH THÔNG BÁO
                            displayedNotifications.map((noti) => (
                                <div 
                                    key={noti.id} 
                                    onClick={() => handleMarkAsRead(noti)}
                                    className={`flex gap-4 p-5 border-b border-slate-100 cursor-pointer transition-all duration-300 hover:bg-slate-50 group
                                        ${!noti.read ? 'bg-blue-50/40' : 'bg-white'}
                                    `}
                                >
                                    <div className="shrink-0 mt-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm border
                                            ${!noti.read ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-100 border-slate-200 text-slate-500'}
                                        `}>
                                            <Bell size={18} strokeWidth={!noti.read ? 2.5 : 2} />
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h2 className={`text-[15px] mb-1.5 leading-snug truncate 
                                                ${!noti.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}
                                            `}>
                                                {noti.title}
                                            </h2>
                                            <span className="text-slate-300 text-xs">•</span>
                                            <span className="text-xs font-medium text-slate-400">
                                                {timeAgo(noti.timestamp)}
                                            </span>
                                            {!noti.read && (
                                                <span className="w-2 h-2 rounded-full bg-blue-600 ml-1"></span>
                                            )}
                                        </div>
                                        
                                        <p className={`text-sm leading-relaxed line-clamp-2
                                            ${!noti.read ? 'text-slate-700 font-medium' : 'text-slate-500'}
                                        `}>
                                            {noti.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* --- COMPONENT PAGINATION --- */}
                {totalPages > 1 && !loading && (
                    <Pagination
                        currentPage={currentPage } // Biến đổi hệ 0-based của Redux sang hệ 1-based của Component Pagination
                        totalPages={totalPages}
                    onPageChange={(newPage) => {
                            dispatch(getAppNotifications({ 
                                page: newPage , // Trả lại hệ 0-based khi gọi API
                                size: 5 
                            }));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    />
                )}

            </div>
        </div>
    );
};

export default NotificationsPage;