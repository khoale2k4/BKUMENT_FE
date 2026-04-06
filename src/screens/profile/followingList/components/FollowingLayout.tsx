'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // <-- THÊM MỚI: Dùng để chuyển trang
import { Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { UserProfile, getProfileById } from '@/lib/redux/features/profileSlice';
import { getUserBlogsById } from '@/lib/redux/features/myBlogSlice';

// Import các Component con
import FollowingSidebar from './FollowingSidebar';
import ProfileHeader from './ProfileHeader';
import ProfileAboutBox from './ProfileAboutBox';
import ContentCard from '@/screens/home/contentCard/ContentCard';

interface FollowingLayoutProps {
  profileId: string;
  listType: 'followers' | 'followings';
}

const FollowingLayout: React.FC<FollowingLayoutProps> = ({ profileId, listType }) => {
  const router = useRouter(); // Khởi tạo router
  const dispatch = useAppDispatch();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  
  // Lấy state Profile
  const { viewedProfile, isViewedProfileLoading } = useAppSelector((state) => state.profile);
  
  // Lấy state Auth (để lấy token truyền cho ContentCard)
  const { token } = useAppSelector((state) => state.auth);

// Bốc đúng biến viewedItems và viewedStatus ra để dùng
const { viewedItems: items, viewedStatus: blogStatus } = useAppSelector((state) => state.myBlogs);

  useEffect(() => {
    if (selectedUser?.id) {
      dispatch(getProfileById(selectedUser.id));
      // Gọi API lấy blog của user được chọn
      dispatch(getUserBlogsById({ userId: selectedUser.id, page: 0, size: 5 })); 
    }
  }, [selectedUser?.id, dispatch]);

  // Hàm xử lý khi bấm vào 1 bài blog
  const onBlogClick = (blogId: string) => {
    router.push(`/blogs/${blogId}`); // Điều hướng tới chi tiết bài viết (Sửa đường dẫn nếu cần)
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] min-h-[700px] w-full bg-[#f0f2f5] font-sans">
      
      {/* CỘT TRÁI (Sidebar) */}
      <div className="md:w-[320px] lg:w-[360px] xl:w-[400px] shrink-0 h-full shadow-sm z-10 bg-white">
        <FollowingSidebar 
          profileId={profileId} 
          listType={listType}
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

        {/* State 2: Đang gọi API Profile */}
        {selectedUser && (isViewedProfileLoading || !viewedProfile) && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader2 className="animate-spin text-blue-600" size={36} />
            <p className="text-gray-500 font-medium text-sm animate-pulse">Đang tải thông tin chi tiết...</p>
          </div>
        )}

        {/* State 3: API trả về thành công */}
        {selectedUser && !isViewedProfileLoading && viewedProfile && (
          <div className="w-full animate-in fade-in duration-300 pb-10">
            <ProfileHeader profile={viewedProfile} />
            <ProfileAboutBox profile={viewedProfile} />
            
            {/* DANH SÁCH BÀI VIẾT (BLOGS) */}
            <div className="mt-6 mx-auto max-w-4xl bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                Bài viết của {viewedProfile.fullName || viewedProfile.firstName}
              </h3>

              {blogStatus === 'loading' ? (
                 <div className="flex justify-center py-8">
                   <Loader2 className="animate-spin text-gray-400" size={28} />
                 </div>
              ) : items && items.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {items.map((blog) => (
                    <ContentCard
                      key={blog.id}
                      data={{
                        id: blog.id,
                        title: blog.name || blog.title,
                        content: blog.content || '',
                        coverImage: blog.coverImage,
                        author: {
                          id: blog.author?.id || viewedProfile.id, // Fallback ID
                          name: blog.author?.name || viewedProfile.fullName || 'Ẩn danh', // Fallback tên
                          avatarUrl: blog.author?.avatarUrl || viewedProfile.avatarUrl || null
                        },
                        type: 'BLOG',
                        time: blog.createdAt ? blog.createdAt.toString() : '',
                        tags: ['Blog'],
                        onClick: () => onBlogClick(blog.id),
                        token: token || '',
                        views: blog.views || 0
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
                  Người dùng này chưa có bài viết nào.
                </div>
              )}
            </div>
            {/* KẾT THÚC DANH SÁCH BÀI VIẾT */}

          </div>
        )}
        
      </div>
    </div>
  );
};

export default FollowingLayout;