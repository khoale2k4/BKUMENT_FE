'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { 
  MoreHorizontal, 
  Clock, 
  Users, 
  BarChart3, 
  MapPin, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
// Import hooks và action từ Redux
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getAllClasses } from '@/lib/redux/features/tutorCourseSlice';

const ProfilePage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Lấy dữ liệu từ Redux Store
  const { classes, loading, error } = useAppSelector((state) => state.tutorCourse);

  // Gọi API lấy danh sách lớp học khi component mount
  useEffect(() => {
    dispatch(getAllClasses());
  }, [dispatch]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 font-sans">
      {/* 1. Header Section */}
      <header className="flex justify-between items-center mb-10">
        <div>
          {/* Tên gia sư có thể lấy động từ class đầu tiên nếu có */}
          <h1 className="text-4xl font-bold text-slate-900 mb-6">
            {classes.length > 0 ? classes[0].tutorName : 'Ly Thanh Nhat Quang'}
          </h1>
          <nav className="flex gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-black">Home</a>
            <a href="#" className="hover:text-black border-b-2 border-black pb-1">Document Upload</a>
            <a href="#" className="hover:text-black">About</a>
          </nav>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <MoreHorizontal size={24} />
        </button>
      </header>

      {/* 2. Action Button */}
      <div className="flex justify-end mb-8">
        <button 
          onClick={() => router.push('/courses/create')}
          className="flex items-center gap-2 bg-[#22863a] hover:bg-[#1e7733] text-white px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95"
        >
          <Plus size={18} /> Add New Course
        </button>
      </div>

      {/* 3. Course List Section */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500 font-medium">
          Lỗi: {error}
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-3xl">
          Bạn chưa có lớp học nào. Hãy nhấn "Add New Course" để bắt đầu.
        </div>
      ) : (
        <div className="space-y-6">
          {classes.map((course) => (
            <div key={course.id} className="flex flex-col md:flex-row border border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow bg-white">
              {/* Thumbnail - Sử dụng ảnh mặc định hoặc tutorAvatar nếu có */}
              <div className="w-full md:w-72 h-48 flex-shrink-0">
                <img 
                  src={course.tutorAvatar || 'https://placehold.co/300x200/4285f4/white?text=LMS+Class'} 
                  alt={course.name} 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Content */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1 italic">by {course.tutorName}</p>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{course.name}</h3>
                  
                  {/* Tags - Hiển thị tên Subject và Topic từ API */}
                  <div className="flex gap-2 mb-4">
                    <span className="px-3 py-1 bg-[#7294ff] text-white text-[10px] font-bold rounded-md uppercase">
                      {course.subjectName}
                    </span>
                    <span className="px-3 py-1 bg-[#ff7272] text-white text-[10px] font-bold rounded-md uppercase">
                      {course.topicName}
                    </span>
                  </div>

                  {/* Meta Stats động từ API */}
                  <div className="flex flex-wrap gap-4 text-[11px] font-bold text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} className="text-orange-500" /> 
                      {course.startDate} - {course.endDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-orange-500" /> 
                      {course.status}
                    </span>
                    <span className="flex items-center gap-1 uppercase">
                      <BarChart3 size={14} className="text-orange-500" /> 
                      {course.schedules.length} Sessions/Week
                    </span>
                  </div>
                </div>

                {/* Footer Card */}
                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-green-500 font-bold uppercase tracking-wider text-xs">
                      {course.status === 'ENROLLING' ? 'Active' : 'Finished'}
                    </span>
                  </div>
                  <button className="text-sm font-bold text-slate-900 hover:underline">
                    View And Update
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Pagination (Tạm thời giữ nguyên giao diện tĩnh) */}
      <div className="flex justify-center items-center mt-12 gap-2 text-sm font-medium">
        <button className="flex items-center gap-1 px-4 py-2 text-gray-400 hover:text-black disabled:opacity-50" disabled>
          <ChevronLeft size={16} /> Previous
        </button>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 flex items-center justify-center bg-[#333] text-white rounded-lg">1</button>
        </div>
        <button className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-black disabled:opacity-50" disabled>
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;