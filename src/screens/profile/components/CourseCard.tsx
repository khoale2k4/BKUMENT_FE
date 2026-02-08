'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Clock, BarChart3, Users } from 'lucide-react';

// Định nghĩa Interface Props khớp với CourseItem trong slice
interface CourseCardProps {
  course: {
    id: string;
    name: string;
    tutorName: string;
    subjectName: string;
    topicName: string;
    startDate: string;
    endDate: string;
    status: string;
    schedules: any[]; // Hoặc define kỹ hơn nếu cần
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row border border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow bg-white">
      {/* Thumbnail */}
      <div className="w-full md:w-72 h-48 flex-shrink-0 relative">
        <img 
          src="/images/course_img.png" 
          alt={course.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Tự động chuyển sang ảnh placeholder nếu ảnh gốc lỗi
            (e.target as HTMLImageElement).src = 'https://placehold.co/300x200/eee/999?text=No+Image';
          }}
        />
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1 italic">by {course.tutorName}</p>
          <h3 
            onClick={() => router.push(`/courses/${course.id}`)}
            className="text-xl font-bold text-slate-900 mb-3 hover:text-orange-500 cursor-pointer"
          >
            {course.name}
          </h3>
          
          {/* Tags (Subject & Topic) */}
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 bg-[#7294ff] text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
              {course.subjectName}
            </span>
            <span className="px-3 py-1 bg-[#ff7272] text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
              {course.topicName}
            </span>
          </div>

          {/* Meta Stats */}
          <div className="flex flex-wrap gap-4 text-[11px] font-bold text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={14} className="text-orange-500" /> 
              {course.startDate} - {course.endDate}
            </span>
            <span className="flex items-center gap-1 uppercase">
              <BarChart3 size={14} className="text-orange-500" /> 
              {course.schedules.length} Buổi/Tuần
            </span>
            <span className="flex items-center gap-1">
               <Users size={14} className="text-orange-500" /> {course.status}
            </span>
          </div>
        </div>

        {/* Footer Card */}
        <div className="flex justify-between items-end mt-4">
          <span className={`text-xs font-bold px-2 py-1 rounded ${course.status === 'ENROLLING' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
            {course.status === 'ENROLLING' ? 'Active' : course.status}
          </span>
          <button 
            onClick={() => router.push(`/courses/${course.id}`)} 
            className="text-sm font-bold text-slate-900 hover:underline"
          >
            View And Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;