'use client';

import React from 'react';
import { Clock, Users, BarChart3, BookOpen, HelpCircle, Settings } from 'lucide-react';
import { useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';

interface CourseHeaderProps {
  courseId: string;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ courseId }) => {
  const router = useRouter();
  
  // Lấy danh sách khóa học từ Redux
  const { classes } = useAppSelector((state) => state.tutorCourse);

  // Tìm khóa học theo ID
  const currentCourse = classes.find((c) => c.id === courseId);

  // Nếu không tìm thấy khóa học
  if (!currentCourse) {
    return <div className="mb-8 animate-pulse bg-gray-100 h-24 rounded-lg"></div>;
  }

  const stats = [
    { icon: <Clock size={18} className="text-orange-500" />, label: `${currentCourse.startDate} - ${currentCourse.endDate}` },
    { icon: <Users size={18} className="text-orange-500" />, label: currentCourse.status },
    { icon: <BarChart3 size={18} className="text-orange-500" />, label: `${currentCourse.schedules.length} Sessions/Week` },
    { icon: <BookOpen size={18} className="text-orange-500" />, label: currentCourse.subjectName },
    { icon: <HelpCircle size={18} className="text-orange-500" />, label: currentCourse.topicName },
  ];

  return (
    <div className="mb-8">
      {/* Đường dẫn điều hướng */}
      <nav className="text-sm text-gray-500 mb-4">
        {currentCourse.tutorName} / Course / <span className="text-gray-400">{currentCourse.id}</span>
      </nav>
      
      {/* Tên khóa học và nút chỉnh sửa */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-slate-900 leading-tight">
          {currentCourse.name}
        </h1>
        {/* SỬA ĐƯỜNG DẪN Ở ĐÂY */}
        <button 
          onClick={() => router.push(`/courses/${courseId}/edit`)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-orange-500"
          title="Chỉnh sửa khóa học"
        >
          <Settings size={24} />
        </button>
      </div>
      
      {/* Thống kê khóa học */}
      <div className="flex flex-wrap gap-6 items-center">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
            {stat.icon}
            {stat.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseHeader;