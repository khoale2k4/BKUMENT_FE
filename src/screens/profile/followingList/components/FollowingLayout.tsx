'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { UserProfile, getProfileById } from '@/lib/redux/features/profileSlice';

// Import các Component con
import FollowingSidebar from './FollowingSidebar';
import ProfileHeader from './ProfileHeader';
import ProfileAboutBox from './ProfileAboutBox';

interface FollowingLayoutProps {
  profileId: string;
  listType: 'followers' | 'followings' ; // Mặc định là 'followings', nhưng có thể mở rộng để dùng chung cho followers nếu cần
}

const FollowingLayout: React.FC<FollowingLayoutProps> = ({ profileId, listType }) => {
  const dispatch = useAppDispatch();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const { viewedProfile, isViewedProfileLoading } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (selectedUser?.id) {
      dispatch(getProfileById(selectedUser.id));
      console.log('Dispatching getProfileById for user ID:', selectedUser.id); // Debug log
    }
  }, [selectedUser?.id, dispatch]);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] min-h-[700px] w-full bg-[#f0f2f5] font-sans">
      
      {/* CỘT TRÁI (Sidebar) */}
      <div className="md:w-[320px] lg:w-[360px] xl:w-[400px] shrink-0 h-full shadow-sm z-10 bg-white">
        <FollowingSidebar 
          profileId={profileId} 
          listType={listType} // <-- TRUYỀN NHÃN XUỐNG SIDEBAR
          selectedUserId={selectedUser?.id || null}
          onSelectUser={(user) => setSelectedUser(user)} 
        />
      </div>

      {/* CỘT PHẢI (Chi tiết Profile) */}
      <div className="flex-1 h-full overflow-y-auto bg-[#f0f2f5] relative">
        
        {/* State 1: Chưa chọn ai */}
        {!selectedUser && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <span className="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200">
              Chọn một người dùng bên trái để xem trang cá nhân.
            </span>
          </div>
        )}

        {/* State 2: Đang gọi API */}
        {selectedUser && (isViewedProfileLoading || !viewedProfile) && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader2 className="animate-spin text-blue-600" size={36} />
            <p className="text-gray-500 font-medium text-sm animate-pulse">Đang tải thông tin chi tiết...</p>
          </div>
        )}

        {/* State 3: API trả về thành công */}
        {selectedUser && !isViewedProfileLoading && viewedProfile && (
          <div className="w-full animate-in fade-in duration-300">
            <ProfileHeader profile={viewedProfile} />
            <ProfileAboutBox profile={viewedProfile} />
          </div>
        )}
        
      </div>
    </div>
  );
};

export default FollowingLayout;