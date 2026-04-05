'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ChevronLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getClassesByTutorId } from '@/lib/redux/features/tutorCourseSlice';

import CourseCard from '../../profile/tabs/MyClass/CourseCard'; 
// Nhớ import Component Pagination của bạn nhé
import Pagination from '@/components/ui/Pagination'; 

const TutorDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const tutorId = params.id as string;
  const dispatch = useAppDispatch();
  
  // LẤY DỮ LIỆU VÀ STATE PHÂN TRANG TỪ REDUX
  const { 
    viewedTutorClasses, 
    loadingViewedClasses, 
    error,
    currentPage, // <-- Thêm currentPage
    totalPages   // <-- Thêm totalPages
  } = useAppSelector(state => state.tutorCourse);

  console.log(" totalPages in TutorDetailPage:", totalPages);

  // GỌI API LẦN ĐẦU KHI VÀO TRANG
  useEffect(() => {
    if (tutorId) {
      // Mặc định gọi trang 0 (do Backend hệ 0-based) và hiển thị 5 item mỗi trang
      dispatch(getClassesByTutorId({tutorId, page: 0, size: 5}));
      console.log("Fetching classes for tutor ID:", tutorId);
    }
  }, [dispatch, tutorId]);

  // HÀM XỬ LÝ CHUYỂN TRANG
  const handlePageChange = (newPage: number) => {
    // newPage từ component Pagination là hệ 1-based (1, 2, 3...)
    // Chuyển lại thành hệ 0-based (newPage - 1) để gửi xuống Backend
      dispatch(getClassesByTutorId({tutorId, page: newPage -1 , size: 5}));

    // Cuộn mượt mà lên trên cùng sau khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // UI Loading
  if (loadingViewedClasses) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-orange-500">
        <Loader2 size={40} className="animate-spin mb-4" />
        <p className="font-medium text-gray-600">Đang tải danh sách khóa học...</p>
      </div>
    );
  }

  // UI Error
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-10 text-red-600 bg-red-50 border border-red-200 rounded-xl text-center font-medium">
        Đã xảy ra lỗi: {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 font-sans text-gray-800 animate-in fade-in duration-500">
      
      {/* Nút Quay lại */}
      <button 
        onClick={() => router.back()} 
        className="mb-8 flex items-center gap-2 text-gray-500 hover:text-orange-500 font-medium transition-colors"
      >
        <ChevronLeft size={20} /> Quay lại danh sách Gia sư
      </button>

      {/* Tiêu đề trang */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Các khóa học của Gia sư
        </h1>
        <p className="text-gray-500">
          Hiện đang có <span className="font-bold text-orange-500">{viewedTutorClasses.length}</span> khóa học đang được mở trên trang này.
        </p>
      </div>
      
      {/* Danh sách Khóa học */}
      {viewedTutorClasses.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 text-gray-500">
          <p className="text-lg font-bold mb-2 text-gray-700">Gia sư này hiện chưa có khóa học nào.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {viewedTutorClasses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {/* COMPONENT PHÂN TRANG */}
      {totalPages >= 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={currentPage +1 } // Chuyển từ 0-based của Redux sang 1-based cho Component UI
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

    </div>
  );
};

export default TutorDetailPage;