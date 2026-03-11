'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
// Import từ slice tutorFinding của bạn
import { getAllStudyingClasses } from '@/lib/redux/features/tutorFindingSlice';
import CourseCard from './ClassCard'; // Dùng chung Card với Teaching Class

const MyStudyingClassTab = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [currentSubTab, setCurrentSubTab] = useState<'active' | 'cancelled'>('active');
  
  // State quản lý trang hiện tại
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Lấy data từ state studying mới tạo ở Bước 1
  const { 
    studyingClasses: classes, 
    studyingTotalPages: totalPages, 
    loadingStudying: loading, 
    errorStudying: error 
  } = useAppSelector((state) => state.tutorFinding);

  // BẢO VỆ DỮ LIỆU CHỐNG CRASH
  const safeClasses = Array.isArray(classes) ? classes : [];

  // Gọi API khi component mount hoặc chuyển trang
  useEffect(() => {
    dispatch(getAllStudyingClasses({ page, size: pageSize }));
  }, [dispatch, page]);

  // Lọc danh sách dựa trên SubTab
  const filteredClasses = useMemo(() => {
    if (currentSubTab === 'active') {
      return safeClasses.filter(c => c.status !== 'CANCELLED');
    }
    return safeClasses.filter(c => c.status === 'CANCELLED');
  }, [safeClasses, currentSubTab]);

  const activeCount = safeClasses.filter(c => c.status !== 'CANCELLED').length;
  const cancelledCount = safeClasses.filter(c => c.status === 'CANCELLED').length;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (totalPages || 1)) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[300px]">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-medium bg-red-50 rounded-2xl border border-red-100">
        <p>Lỗi tải dữ liệu: {error}</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* --- Action Bar & Tabs --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100">
        <div className="flex gap-6 text-sm font-medium">
          <button 
            onClick={() => setCurrentSubTab('active')}
            className={`pb-4 transition-all ${currentSubTab === 'active' ? 'text-black border-b border-black' : 'text-gray-400 hover:text-black'}`}
          >
            Lớp Đang Học ({activeCount})
          </button>
          <button 
            onClick={() => setCurrentSubTab('cancelled')}
            className={`pb-4 transition-all ${currentSubTab === 'cancelled' ? 'text-black border-b border-black' : 'text-gray-400 hover:text-black'}`}
          >
            Đã Hủy ({cancelledCount})
          </button>
        </div>

        {/* Nút Đăng ký học (Dành cho User) */}
        <button 
          onClick={() => router.push('/search')} // Đổi đường dẫn này tới trang tìm kiếm lớp học của bạn
          className="mb-4 md:mb-0 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-sm active:scale-95"
        >
          <Search size={16} strokeWidth={2.5} /> Tìm Lớp Mới
        </button>
      </div>

      {/* --- Danh sách Lớp học --- */}
      {filteredClasses.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <Inbox size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="font-medium text-gray-500">
            {currentSubTab === 'active' 
              ? 'Bạn chưa đăng ký tham gia lớp học nào.' 
              : 'Danh sách lớp học đã hủy trống.'}
          </p>
          {currentSubTab === 'active' && (
            <button 
              onClick={() => router.push('/search')}
              className="text-purple-600 font-bold text-sm mt-3 hover:underline"
            >
              Khám phá các khóa học ngay
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {filteredClasses.map((course) => (
            <CourseCard key={course.id} course={course as any} /> 
          ))}
        </div>
      )}

      {/* --- Phân trang (Pagination) --- */}
      {(totalPages > 1) && (
        <div className="flex justify-center items-center gap-4 mt-12 pt-6 border-t border-gray-100">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          
          <span className="text-sm font-medium text-gray-700">
            Page {page} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MyStudyingClassTab;