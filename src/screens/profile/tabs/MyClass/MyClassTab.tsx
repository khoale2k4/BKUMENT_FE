'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, Inbox } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getAllClasses } from '@/lib/redux/features/tutorCourseSlice';
import CourseCard from './ClassCard';

const MyClassTab = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // 1. Quản lý sub-tab cục bộ: 'active' hoặc 'cancelled'
  const [currentSubTab, setCurrentSubTab] = useState<'active' | 'cancelled'>('active');

  // Lấy state từ Redux
  const { classes, loading, error } = useAppSelector((state) => state.tutorCourse);

  useEffect(() => {
    dispatch(getAllClasses());
  }, [dispatch]);

  // 2. Lọc danh sách dựa trên Status
  // Giả định API trả về status 'CANCELLED' cho các lớp đã hủy
  const filteredClasses = useMemo(() => {
    if (currentSubTab === 'active') {
      return classes.filter(c => c.status !== 'CANCELLED');
    }
    return classes.filter(c => c.status === 'CANCELLED');
  }, [classes, currentSubTab]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[300px]">
        <Loader2 className="animate-spin text-gray-900" size={40} />
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
      {/* 3. Sub-navigation Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100">
        <div className="flex gap-6 text-sm font-medium">
          <button 
            onClick={() => setCurrentSubTab('active')}
            className={`pb-4 transition-all ${currentSubTab === 'active' ? 'text-black border-b border-black' : 'text-gray-400 hover:text-black'}`}
          >
            Active Classes ({classes.filter(c => c.status !== 'CANCELLED').length})
          </button>
          <button 
            onClick={() => setCurrentSubTab('cancelled')}
            className={`pb-4 transition-all ${currentSubTab === 'cancelled' ? 'text-black border-b border-black' : 'text-gray-400 hover:text-black'}`}
          >
            Cancelled ({classes.filter(c => c.status === 'CANCELLED').length})
          </button>
        </div>

        <button 
          onClick={() => router.push('/courses/create')}
          className="mb-4 md:mb-0 flex items-center gap-2 bg-[#1a8917] hover:bg-[#156d12] text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} /> Add New Course
        </button>
      </div>

      {/* 4. Hiển thị danh sách sau khi lọc */}
      {filteredClasses.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <Inbox size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="font-medium text-gray-500">
            {currentSubTab === 'active' 
              ? 'Bạn không có lớp học nào đang hoạt động.' 
              : 'Danh sách lớp học đã hủy trống.'}
          </p>
          {currentSubTab === 'active' && (
            <button 
              onClick={() => router.push('/courses/create')}
              className="text-[#1a8917] font-bold text-sm mt-2 hover:underline"
            >
              Tạo lớp ngay
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {filteredClasses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClassTab;