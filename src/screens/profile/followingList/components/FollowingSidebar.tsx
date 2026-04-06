'use client';

import React, { useEffect, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getFollowingByProfileId, getFollowersByProfileId, UserProfile } from '@/lib/redux/features/profileSlice';
import FollowingSidebarItem from './FollowingSidebarItem';
import { getUserBlogsById } from '@/lib/redux/features/myBlogSlice';

interface FollowingSidebarProps {
  profileId: string;
  listType: 'followers' | 'followings'; // <-- NHẬN NHÃN TỪ CHA
  selectedUserId: string | null;
  onSelectUser: (user: UserProfile) => void;
}

const FollowingSidebar: React.FC<FollowingSidebarProps> = ({ profileId, listType, selectedUserId, onSelectUser }) => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { 
    followingData, isFollowingLoading, 
    followersData, isFollowersLoading 
  } = useAppSelector((state) => state.profile);

  // --- CÁC BIẾN ĐỘNG (DYNAMIC VARIABLES) ---
  const currentData = listType === 'followings' ? followingData : followersData;
  const currentLoading = listType === 'followings' ? isFollowingLoading : isFollowersLoading;
  
  // Custom Text cho UI
  const titleText = listType === 'followings' ? 'Đang theo dõi' : 'Người theo dõi';
  const emptyText = listType === 'followings' ? 'Chưa theo dõi ai.' : 'Chưa có người theo dõi.';
  const countText = listType === 'followings' ? 'người đang theo dõi' : 'người theo dõi';

  useEffect(() => {
    if (profileId) {
      if (listType === 'followings') {
        dispatch(getFollowingByProfileId({ profileId, page, size: pageSize }));
      } else {
        dispatch(getFollowersByProfileId({ profileId, page, size: pageSize }));
      }
    }
  }, [dispatch, profileId, page, listType]);

  // Tự động chọn người đầu tiên khi load xong data (Dùng currentData)
  useEffect(() => {
    if (currentData?.data && currentData.data.length > 0 && !selectedUserId) {
      onSelectUser(currentData.data[0]);
      console.log('Auto-selecting user:', currentData.data[0].id); // Debug log
    }
  }, [currentData, selectedUserId, onSelectUser]);

  // Lấy danh sách từ currentData thay vì fix cứng followingData
  const users = currentData?.data || [];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      
      {/* Header Sidebar */}
      <div className="p-4 border-b border-gray-100">
        {/* Áp dụng Title Text */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{titleText}</h2>
        
        {/* Thanh tìm kiếm giống FB */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
        </div>
      </div>

      {/* Danh sách User (Cuộn độc lập) */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Dùng currentLoading và currentData */}
        {currentLoading && !currentData ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-400" size={24} /></div>
        ) : users.length === 0 ? (
        
          <div className="text-center py-10 text-gray-500 text-sm">{emptyText}</div>
        ) : (
          <div className="space-y-1">
            <p className="px-2 pt-2 pb-1 text-sm font-semibold text-gray-500">
              {/* Áp dụng Count Text và Current Data */}
              {currentData?.totalElements} {countText}
            </p>
            {users.map((user) => (
              <FollowingSidebarItem
                key={user.id}
                user={user}
                isSelected={selectedUserId === user.id}
                onClick={() => onSelectUser(user)}
              />
            ))}
          </div>
        )}

        {/* Phân trang (Load More / Prev-Next) - Thay bằng currentData */}
        {currentData && currentData.totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-4 mt-2 border-t border-gray-100">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="text-sm font-semibold text-blue-600 disabled:text-gray-300"
            >
              Trang trước
            </button>
            <span className="text-xs text-gray-500">{page} / {currentData.totalPages}</span>
            <button 
              onClick={() => setPage(p => p + 1)} disabled={page >= currentData.totalPages}
              className="text-sm font-semibold text-blue-600 disabled:text-gray-300"
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowingSidebar;