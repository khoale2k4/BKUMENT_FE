'use client';

import React, { useState } from 'react';
import { Trash2, Loader2, UserPlus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { cancelClass } from '@/lib/redux/features/tutorCourseSlice';
import { enrollInClass } from '@/lib/redux/features/tutorFindingSlice'; // <-- IMPORT ACTION MỚI
import { useRouter } from 'next/navigation';

interface OverviewTabProps {
  courseId: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ courseId }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isCanceling, setIsCanceling] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Lấy User ID hiện tại để so sánh xem họ có phải là Gia sư của lớp không
  // (Lưu ý: Bạn cần điều chỉnh 'state.auth.user?.id' cho đúng với cấu trúc Redux của bạn)
  const tutorId = useAppSelector((state) => state.profile.tutor?.id);
  console.log("Tutor ID từ Redux:", tutorId);

  // Lấy dữ liệu chi tiết khóa học
  const { currentClassDetail: currentCourse } = useAppSelector((state) => state.tutorFinding);
  console.log("Chi tiết lớp học từ Redux:", currentCourse);
  console.log("userStatus từ Redux:", currentCourse?.userStatus); // Thêm log để kiểm tra userStatus

  // Hàm xử lý Hủy lớp học (Dành cho Gia sư)
  const handleCancel = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy lớp học này không? Hành động này không thể hoàn tác.")) {
      setIsCanceling(true);
      const result = await dispatch(cancelClass(id));
      setIsCanceling(false);
      
      if (cancelClass.fulfilled.match(result)) {
        alert("Đã hủy lớp học thành công!");
        router.push('/profile');
      } else {
        alert("Lỗi: " + result.payload);
      }
    }
  };

  // Hàm xử lý Đăng ký lớp học (Dành cho Học viên)
  const handleEnroll = async () => {
    setIsEnrolling(true);
    const result = await dispatch(enrollInClass(courseId));
    setIsEnrolling(false);

    if (enrollInClass.fulfilled.match(result)) {
      alert("Gửi yêu cầu tham gia lớp học thành công! Vui lòng chờ Gia sư phê duyệt.");
      // Tuỳ chọn: Bạn có thể gọi lại API getClassDetailsById ở đây để update UI nếu cần
    } else {
      alert("Đăng ký thất bại: " + result.payload);
    }
  };

  if (!currentCourse) {
    return <div className="bg-gray-100 rounded-2xl h-64 animate-pulse"></div>;
  }

  const isAlreadyCancelled = currentCourse.status === 'CANCELLED';
  const isEnrollingStatus = currentCourse.status === 'ENROLLING'; // Lớp có đang mở đăng ký không?
  
  console.log("userstatus của lớp:", currentCourse.userStatus); // Thêm log để kiểm tra userStatus

  return (
    <div className="bg-[#f9f9f9] rounded-2xl p-8 border border-gray-100 shadow-sm animate-in fade-in duration-500 flex flex-col min-h-[300px] justify-between">
      
      <div className="space-y-6 text-gray-700 leading-relaxed text-[16px]">
        <p>{currentCourse.description || "Chưa có mô tả chi tiết cho lớp học này."}</p>
      </div>

      <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
        

        { currentCourse.userStatus == 'OWNER'  && (<> <button 
            onClick={() => handleCancel(courseId)}
            disabled={isCanceling || isAlreadyCancelled}
            className={`flex items-center gap-2 px-6 py-2.5 font-bold text-sm rounded-full transition-all shadow-sm 
              ${isAlreadyCancelled 
                ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-500 active:scale-95'
              }`}
          >
            {isCanceling ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            {isAlreadyCancelled ? 'Lớp Đã Hủy' : 'Hủy Lớp Học'}
          </button></>)
}
         
        
          
  { (currentCourse.userStatus == 'NONE' || currentCourse.userStatus == 'REJECTED')  && (<> <button 
            onClick={handleEnroll}
            // Khoá nút nếu đang call API đăng ký, hoặc lớp đã hủy, hoặc không còn trong trạng thái mở tuyển sinh
            disabled={isEnrolling || isAlreadyCancelled || !isEnrollingStatus}
            className={`flex items-center gap-2 px-6 py-2.5 font-bold text-sm rounded-full transition-all shadow-sm 
              ${(isAlreadyCancelled || !isEnrollingStatus)
                ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-orange-500 border border-orange-500 text-white hover:bg-orange-600 active:scale-95'
              }`}
          >
            {isEnrolling ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
            {isAlreadyCancelled 
                ? 'Lớp Đã Hủy' 
                : (!isEnrollingStatus ? 'Đã Đóng Đăng Ký' : 'Đăng Ký Tham Gia')
            }
          </button>
  </>)
    
  }

  { currentCourse.userStatus == 'APPROVED'  && (<> <p> Bạn đã đăng ký lớp học này </p> </>)
    
  }  

    { currentCourse.userStatus == 'PENDING'  && (<> <p> Yêu cầu đăng ký của bạn đang chờ được phê duyệt. </p> </>)
    
  }  

          
      
      </div>
      
    </div>
  );
};

export default OverviewTab;