'use client';

import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react'; // Bổ sung ShieldAlert
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getClassNotifications } from '@/lib/redux/features/tutorCourseSlice';

import NotificationTable from './NotificationTable';
import AddNotificationModal from './AddNotificationModal';

interface NotificationsTabProps {
  courseId: string;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ courseId }) => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // 1. LẤY THÔNG TIN ROLE TỪ REDUX
  const { currentClassDetail: currentCourse } = useAppSelector((state) => state.tutorFinding);
  const userStatus = currentCourse?.userStatus || 'NONE';
  
  const isOwner = userStatus === 'OWNER';
  const isApprovedStudent = userStatus === 'APPROVED' || userStatus === 'STUDENT';

  const { 
    notifications, 
    loadingNotifications, 
    notificationsTotalPages 
  } = useAppSelector((state) => state.tutorCourse);

  // 2. CHỈ GỌI API LẤY THÔNG BÁO NẾU CÓ QUYỀN
  useEffect(() => {
    if (courseId && (isOwner || isApprovedStudent)) {
      dispatch(getClassNotifications({ classId: courseId, page, size: pageSize }));
    }
  }, [dispatch, courseId, page, isOwner, isApprovedStudent]);

  const handleNextPage = () => {
    if (page < notificationsTotalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // --- RENDERING BẢO MẬT (CHẶN NGƯỜI NGOÀI) ---
  if (!isOwner && !isApprovedStudent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <ShieldAlert size={64} className="text-gray-300 mb-6" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Truy cập bị từ chối</h3>
        <p className="text-gray-500 text-center max-w-md">
          Chỉ Gia sư và Học viên chính thức của lớp học mới có quyền xem thông báo.
        </p>
      </div>
    );
  }

  // --- RENDERING BÌNH THƯỜNG DÀNH CHO OWNER VÀ APPROVED ---
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm font-sans animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Push notification</h2>
        
        {/* CHỈ GIA SƯ (OWNER) MỚI CÓ QUYỀN THÊM THÔNG BÁO */}
        {isOwner && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-green-500 text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-colors shadow-sm active:scale-95"
          >
            <Plus size={18} />
            Add Push notification
          </button>
        )}
      </div>

      {/* Table Section */}
      <NotificationTable 
        notifications={notifications} 
        isLoading={loadingNotifications} 
        // Tuỳ chọn: Truyền isOwner xuống nếu bạn muốn ẩn cột Action (Edit/Delete) đối với học viên trong NotificationTable
        // isOwner={isOwner} 
      />

      {/* --- UI PHÂN TRANG (PAGINATION) --- */}
      {notificationsTotalPages > 0 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 font-medium">
            Page <span className="font-bold text-gray-900">{page}</span> of {notificationsTotalPages}
          </p>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevPage}
              disabled={page === 1 || loadingNotifications}
              className="flex items-center justify-center p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextPage}
              disabled={page >= notificationsTotalPages || loadingNotifications}
              className="flex items-center justify-center p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Popup Modal tạo thông báo - CHỈ RENDER KHI LÀ OWNER */}
      {isOwner && (
        <AddNotificationModal 
          courseId={courseId} 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setPage(1); // Force về trang 1 để xem thông báo mới nhất vừa tạo
          }} 
        />
      )}

    </div>
  );
};

export default NotificationsTab;