import React from 'react';
import { UserCheck, MessageCircle } from 'lucide-react';
import { UserProfile } from '@/lib/redux/features/profileSlice';

interface ProfileHeaderProps {
  profile: UserProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  return (
    <div className="bg-white">
      {/* Ảnh bìa (Cover) */}
      <div className="h-[150px] lg:h-[200px] w-full bg-gradient-to-r from-blue-100 to-indigo-50 relative"></div>

      <div className="max-w-[900px] mx-auto px-6 sm:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-gray-200">
          
          {/* Cụm Avatar và Tên */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 relative">
            <div className="w-[120px] h-[120px] sm:w-[130px] sm:h-[130px] rounded-full border-4 border-white bg-white overflow-hidden shadow-sm -mt-12 sm:-mt-16 relative z-10 shrink-0">
              <img 
                src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=random`} 
                alt={profile.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="pb-1 sm:pb-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {profile.fullName}
              </h1>
              <p className="text-gray-500 font-medium text-sm mt-1">
                {profile.followerCount || 0} <span className="text-gray-400">Followers</span> • {profile.followingCount || 0} <span className="text-gray-400">Following</span>
              </p>
            </div>
          </div>

          {/* Các nút Hành động */}
          <div className="flex gap-2 pb-1 sm:pb-3 shrink-0">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm">
              <MessageCircle size={16} /> Nhắn tin
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm">
              <UserCheck size={16} /> Bạn bè
            </button>
          </div>
        </div>

        {/* Menu Tabs ảo */}
        <div className="flex gap-2 mt-1 overflow-x-auto whitespace-nowrap hide-scrollbar">
          {['Giới thiệu', 'Bài viết', 'Ảnh'].map((tab, idx) => (
            <button key={tab} className={`px-4 py-3 text-[14px] font-semibold transition-colors ${idx === 0 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50 rounded-lg'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;