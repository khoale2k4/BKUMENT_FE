import React from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Star, Users, PlayCircle, BookOpen } from 'lucide-react';
import { TutorData } from '@/lib/redux/features/tutorFindingSlice';
import { useAppDispatch } from '@/lib/redux/hooks';
import { profile } from 'console';
import { setPendingTargetUserId } from '@/lib/redux/features/chatSlice';

interface TutorCardProps {
  data: TutorData;
}

const TutorCard: React.FC<TutorCardProps> = ({ data }) => {
  const router = useRouter();
  const { tutor, matchingClasses } = data;
  const dispatch = useAppDispatch();
  const handleSendMessage = () => {
    dispatch(setPendingTargetUserId(tutor.id)); // <-- Lưu ID người nhận vào Redux
       router.push('/messages'); // <-- Điều hướng đến trang tin nhắn
  }

  // Placeholder cho avatar nếu API trả về null hoặc chuỗi "string" không hợp lệ
  const avatarUrl = tutor.avatar && tutor.avatar.startsWith('http') 
    ? tutor.avatar 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=random&color=fff&bold=true`;

  return (
    <div className="relative flex flex-col md:flex-row gap-6 p-6 bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
      
      {/* Nút yêu thích (Heart) ở góc phải trên cùng */}
      <button className="absolute top-6 right-6 text-gray-300 hover:text-pink-500 transition-colors">
        <Heart size={22} />
      </button>

      {/* Cột trái: Avatar */}
      <div className="shrink-0 flex justify-center md:block">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
          <img 
            src={avatarUrl} 
            alt={tutor.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Cột giữa: Thông tin gia sư */}
      <div className="flex-1 mt-2 md:mt-0">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{tutor.name}</h3>
        
        {/* Placeholder Followers/University */}
        <p className="text-xs text-gray-500 mb-1">Active Tutor • Verified</p>
        <p className="text-sm text-gray-400 mb-3">Giảng viên đại học / Chuyên gia</p>
        
        {/* Subject (Lấy môn học đầu tiên trong danh sách lớp làm đại diện) */}
        <div className="flex items-center gap-2 mb-4 font-bold text-sm text-gray-800">
          <BookOpen size={16} className="text-purple-600" /> 
          {matchingClasses.length > 0 ? matchingClasses[0].subjectName : "Đa môn học"}
        </div>

        {/* Thống kê: Rating, Students, Courses */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 text-sm font-medium">
          <div className="flex items-center gap-1.5 text-orange-500">
            <Star size={16} fill="currentColor" /> 
            <span>{tutor.averageRating >= 0 ? tutor.averageRating.toFixed(1) : "4.9"} <span className="text-gray-400 font-normal">Course rating</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-500">
            <Users size={16} />
            <span>{tutor.ratingCount >= 0 ? tutor.ratingCount * 12 : "236"} <span className="text-gray-400 font-normal">Students</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-orange-600">
            <PlayCircle size={16} />
            <span>{matchingClasses.length < 10 ? `0${matchingClasses.length}` : matchingClasses.length} <span className="text-gray-400 font-normal">Courses</span></span>
          </div>
        </div>

        {/* Giới thiệu */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 md:line-clamp-3 pr-8">
          {tutor.introduction || "Gia sư này chưa cập nhật bài giới thiệu bản thân."}
        </p>
      </div>

      {/* Cột phải: Giá tiền và Nút hành động */}
      <div className="shrink-0 flex flex-col md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
        
        {/* Placeholder Giá */}
        <div className="mb-4 md:mb-0 text-left md:text-right mt-2 md:mt-8">
          <div className="text-2xl font-bold text-gray-900">$20</div>
          <div className="text-xs text-gray-500">50 - min lesson</div>
        </div>

        {/* Các nút bấm */}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <button 
            // CHUYỂN HƯỚNG SANG TRANG DANH SÁCH KHÓA HỌC CỦA GIA SƯ NÀY
            onClick={() => router.push(`/tutors/${tutor.id}`)}
            className="w-full md:w-40 py-2.5 bg-[#ff6b9e] hover:bg-[#ff4d88] text-white text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95"
          >
            View more
          </button>
          <button 
          onClick={() => handleSendMessage()}
            className="w-full md:w-40 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-xl transition-all active:scale-95"
          >
            Send a message
          </button>
        </div>
      </div>

    </div>
  );
};

export default TutorCard;