'use client';

import React from 'react';
import { Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { cancelClass } from '@/lib/redux/features/tutorCourseSlice';
import { useRouter } from 'next/navigation';

interface OverviewTabProps {
  courseId: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ courseId }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading } = useAppSelector((state) => state.tutorCourse);
  // Lấy danh sách khóa học từ Redux
  const { classes } = useAppSelector((state) => state.tutorCourse);

  // Tìm khóa học theo ID
  const currentCourse = classes.find((c) => c.id === courseId);

  // Hàm xử lý hủy lớp học
  const handleCancel = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy lớp học này không? Hành động này không thể hoàn tác.")) {
      const result = await dispatch(cancelClass(id));
      
      if (cancelClass.fulfilled.match(result)) {
        alert("Đã hủy lớp học thành công!");
        router.push('/profile'); // Chuyển về danh sách lớp sau khi hủy
      } else {
        alert("Lỗi: " + result.payload);
      }
    }
  };

  return (
    <div className="bg-[#f9f9f9] rounded-2xl p-8 border border-gray-100 shadow-sm animate-in fade-in duration-500 flex flex-col min-h-[300px] justify-between">
      {/* 1. Nội dung text */}
      <div className="space-y-6 text-gray-600 leading-relaxed text-[16px]">
        <p>{currentCourse?.description || "No description available."}</p>
      </div>

      <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
        <button 
          onClick={() => handleCancel(courseId)}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-500 font-bold text-sm rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
          Cancel Class
        </button>
      </div>
    </div>
  );
};

export default OverviewTab;