'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
// Import hooks và action từ Redux
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getAllClasses } from '@/lib/redux/features/tutorCourseSlice';
import CourseCard from './CourseCard';

const MyClassTab = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Lấy state từ tutorCourseSlice
  const { classes, loading, error } = useAppSelector((state) => state.tutorCourse);

  // Gọi API khi tab được mount
  useEffect(() => {
    dispatch(getAllClasses());
  }, [dispatch]);

  // Xử lý trạng thái Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[300px]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  // Xử lý trạng thái Lỗi
  if (error) {
    return (
      <div className="text-center py-20 text-red-500 font-medium bg-red-50 rounded-xl border border-red-100">
        <p>Đã xảy ra lỗi khi tải dữ liệu:</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* Nút thêm khóa học */}
      <div className="flex justify-end mb-8">
        <button 
          onClick={() => router.push('/courses/create')}
          className="flex items-center gap-2 bg-[#22863a] hover:bg-[#1e7733] text-white px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-sm"
        >
          <Plus size={18} /> Add New Course
        </button>
      </div>

      {/* Danh sách khóa học */}
      {classes.length === 0 ? (
        <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-3xl bg-gray-50">
          <p className="font-medium text-lg text-gray-500">Bạn chưa có lớp học nào.</p>
          <p className="text-sm mt-1">Hãy nhấn "Add New Course" để bắt đầu hành trình giảng dạy.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {classes.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClassTab;