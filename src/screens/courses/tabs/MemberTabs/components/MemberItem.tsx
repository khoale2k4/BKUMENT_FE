// app/courses/[id]/tabs/components/MemberItem.tsx
import React, { useState } from 'react';
import { Check, X, UserMinus, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { approveMember } from '@/lib/redux/features/tutorCourseSlice';

export interface CourseMember {
  id: string; // Đây chính là enrollmentId
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string | null;
  enrolledAt: string;
  status: string;
}

interface MemberItemProps {
  member: CourseMember;
}

const MemberItem: React.FC<MemberItemProps> = ({ member }) => {
  const dispatch = useAppDispatch();
  const [isProcessing, setIsProcessing] = useState(false);

  // Hàm xử lý Accept / Decline
  const handleApproval = async (isApproved: boolean) => {
    setIsProcessing(true);
    const resultAction = await dispatch(approveMember({ enrollmentId: member.id, isApproved }));
    
    if (approveMember.fulfilled.match(resultAction)) {
    } else {
      alert("Đã xảy ra lỗi: " + resultAction.payload);
      setIsProcessing(false); 
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return dateString; }
  };

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.studentName)}&background=random`;
  const avatarSrc = member.studentAvatar || fallbackAvatar;

  return (
    // Đã xóa class "group" ở đây vì không cần bắt sự kiện hover của dòng nữa
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 shrink-0 rounded-full overflow-hidden border border-gray-100 shadow-sm">
          <img src={avatarSrc} alt={member.studentName} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = fallbackAvatar; }} />
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
            <h4 className="font-bold text-base hover:underline cursor-pointer">{member.studentName}</h4>
            <span className="hidden md:inline text-gray-300">•</span>
            <span className="text-sm text-gray-500 font-sans">{member.studentEmail}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-tight font-sans">
            {member.status === 'PENDING' ? 'Requested' : 'Joined'} {formatDate(member.enrolledAt)}
          </p>
        </div>
      </div>
      
      {/* Nút hành động - Xóa opacity-0 và group-hover ở thẻ div này */}
      <div className="flex items-center gap-2 transition-opacity">
        
        {/* Trạng thái CHÍNH THỨC */}
        {member.status === 'APPROVED' && (
          <button className="flex items-center gap-1 text-xs font-bold text-red-500 opacity-60 hover:opacity-100 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-all duration-200 font-sans">
            <UserMinus size={14} /> Remove
          </button>
        )}

        {/* Trạng thái CHỜ DUYỆT */}
        {member.status === 'PENDING' && (
          <>
            <button 
              onClick={() => handleApproval(true)}
              disabled={isProcessing}
              // Thêm opacity-60 (mờ lúc thường) và hover:opacity-100 (đậm màu khi hover nút)
              className="flex items-center justify-center gap-1 w-24 text-xs font-bold text-white bg-[#1a8917] opacity-60 hover:opacity-100 hover:brightness-110 hover:shadow-md py-1.5 rounded-full transition-all duration-200 font-sans shadow-sm active:scale-95 disabled:opacity-40"
            >
              {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <><Check size={14} strokeWidth={3} /> Accept</>}
            </button>
            
            <button 
              onClick={() => handleApproval(false)}
              disabled={isProcessing}
              // Thêm opacity-60 và hover:opacity-100
              className="flex items-center justify-center gap-1 w-24 text-xs font-bold text-red-500 border border-red-200 opacity-60 hover:opacity-100 hover:bg-red-50 hover:border-red-400 hover:text-red-600 hover:shadow-md py-1.5 rounded-full transition-all duration-200 font-sans shadow-sm active:scale-95 disabled:opacity-40"
            >
              {isProcessing ? <Loader2 size={14} className="animate-spin text-red-500" /> : <><X size={14} strokeWidth={3} /> Decline</>}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MemberItem;