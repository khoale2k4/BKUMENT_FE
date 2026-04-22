'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getProfileById } from '@/lib/redux/features/profileSlice';
import { getUserBlogsById } from '@/lib/redux/features/myBlogSlice';

// Import các Component con
import ProfileHeader from '../profile/followingList/components/ProfileHeader';
import ProfileAboutBox from '../profile/followingList/components/ProfileAboutBox';
import ContentCard from '@/screens/home/contentCard/ContentCard';

interface PeopleProfileLayoutProps {
  userId: string; 
}

const PeopleProfileLayout: React.FC<PeopleProfileLayoutProps> = ({ userId }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { viewedProfile, isViewedProfileLoading } = useAppSelector((state) => state.profile);
  const { token } = useAppSelector((state) => state.auth);
  const { viewedItems: items, viewedStatus: blogStatus } = useAppSelector((state) => state.myBlogs);

  useEffect(() => {
    if (userId) {
      dispatch(getProfileById(userId));
      dispatch(getUserBlogsById({ userId: userId, page: 0, size: 5 })); 
    }
  }, [userId, dispatch]);

  const onBlogClick = (blogId: string) => {
    router.push(`/blogs/${blogId}`); 
  };

  return (
    <div className="w-full min-h-screen bg-[#f0f2f5] font-sans overflow-y-auto">
      
      {/* State 1: Đang tải dữ liệu */}
      {(isViewedProfileLoading || !viewedProfile) ? (
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-gray-500 font-medium animate-pulse">{t('people.profile.loading', 'Loading profile details...')}</p>
        </div>
      ) : (
        /* State 2: Đã tải dữ liệu thành công */
        <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-300">
          
          <ProfileHeader profile={viewedProfile} />
          <ProfileAboutBox profile={viewedProfile} />
          
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
              {t('people.profile.blogsBy', 'Posts by {{name}}', { name: viewedProfile.fullName || viewedProfile.firstName })}
            </h3>

            {blogStatus === 'loading' ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-gray-400" size={32} />
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
                        id: blog.author?.id || viewedProfile.id,
                        name: blog.author?.name || viewedProfile.fullName || t('common.unknownAuthor', 'Anonymous'),
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
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                {t('people.profile.noBlogs', "This user hasn't posted any articles yet.")}
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
};

export default PeopleProfileLayout;