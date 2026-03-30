'use client'; 

import React, { useMemo, useState, useEffect, useRef } from 'react'; // <-- Thêm useEffect, useRef
import { UserCheck, MessageCircle, UserPlus, Loader2, UserMinus, Users } from 'lucide-react'; // <-- Thêm UserMinus
import { UserProfile } from '@/lib/redux/features/profileSlice';
import { useRouter } from 'next/navigation'; 
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'; 
import { setPendingTargetUserId } from '@/lib/redux/features/chatSlice'; 
import { useTranslation } from 'react-i18next';

// Giả sử bạn đã có action unFollowPerson, nếu chưa có hãy tạo nó trong articleSlice nhé
import { followPerson, unFollowPerson } from '@/lib/redux/features/articleSlice'; 
import { showToast } from '@/lib/redux/features/toastSlice'; 

interface ProfileHeaderProps {
  profile: UserProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const router = useRouter(); 
  const dispatch = useAppDispatch(); 
  const { t } = useTranslation();

  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  
  // --- THÊM: State và Ref cho Menu Bỏ Theo Dõi ---
  const [isUnfollowMenuOpen, setIsUnfollowMenuOpen] = useState(false);
  const unfollowMenuRef = useRef<HTMLDivElement>(null);

  const { followersData, followingData } = useAppSelector((state) => state.profile);

  const isFollowing = useMemo(() => {
    if (!followingData?.data) return false;
    return followingData.data.some((user) => user.id === profile.id);
  }, [followingData, profile.id]);

  const isFollower = useMemo(() => {
    if (!followersData?.data) return false;
    return followersData.data.some((user) => user.id === profile.id);
  }, [followersData, profile.id]);

  const isFriends = useMemo(() => isFollowing && isFollower, [isFollowing, isFollower]);



  // --- THÊM: Xử lý click ra ngoài để đóng menu ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (unfollowMenuRef.current && !unfollowMenuRef.current.contains(event.target as Node)) {
        setIsUnfollowMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleFollowButton = async () => {
    if (isFollowingLoading) return;

    try {
        setIsFollowingLoading(true);
        await dispatch(followPerson(profile.id)).unwrap();
        
        dispatch(showToast({
            type: 'success',
            title: t('profile.header.successTitle', 'Thành công!'),
            message: t('profile.header.followSuccessMsg', `Bạn đã theo dõi {{name}}!`, { name: profile.fullName }),
        }));
    } catch (error) {
        dispatch(showToast({
            type: 'error',
            title: t('profile.header.errorTitle', 'Lỗi'),
            message: t('profile.header.followErrorMsg', 'Theo dõi thất bại. Vui lòng thử lại.'),
        }));
    } finally {
        setIsFollowingLoading(false);
    }
  };

  const handleUnfollowButton = async () => {
    if (isFollowingLoading) return;
    setIsUnfollowMenuOpen(false); // Đóng menu lại ngay khi bấm

    try {
        setIsFollowingLoading(true);
        // Thay bằng action unFollowPerson của bạn
        await dispatch(unFollowPerson(profile.id)).unwrap(); 
        
        dispatch(showToast({
            type: 'success',
            title: t('profile.header.successTitle', 'Thành công!'),
            message: t('profile.header.unfollowSuccessMsg', `Đã bỏ theo dõi {{name}}.`, { name: profile.fullName }),
        }));
    } catch (error) {
      console.error('Unfollow error:', error);
        dispatch(showToast({
            type: 'error',
            title: t('profile.header.errorTitle', 'Lỗi'),
            message: t('profile.header.unfollowErrorMsg', 'Bỏ theo dõi thất bại. Vui lòng thử lại.'),
        }));
    } finally {
        setIsFollowingLoading(false);
    }
  };

  const handleSayHello = () => {
    dispatch(setPendingTargetUserId(profile.id)); 
    router.push('/messages'); 
  };


const renderFollowButton = () => {
    // Trạng thái 1: LÀ BẠN BÈ (Cả 2 cùng follow nhau) -> Hiển thị Dropdown "Bạn bè"
    if (isFriends) {
      console.log('isFriends true');
      return (
        <div className="relative" ref={unfollowMenuRef}>
          <button 
            onClick={() => setIsUnfollowMenuOpen(!isUnfollowMenuOpen)}
            disabled={isFollowingLoading}
            className={`font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm ${
              isUnfollowMenuOpen ? 'bg-gray-200 text-gray-900' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            } disabled:opacity-70`}
          >
            {isFollowingLoading ? <Loader2 size={16} className="animate-spin" /> : <Users size={16} />} 
            {t('profile.header.friendsBtn', 'Bạn bè')}
          </button>

          {/* Menu xổ xuống để Bỏ theo dõi */}
          {isUnfollowMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95">
              <button 
                onClick={handleUnfollowButton}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-3 transition-colors"
              >
                <UserMinus size={16} />
                {t('profile.header.unfollowBtn', 'Bỏ theo dõi')}
              </button>
            </div>
          )}
        </div>
      );
    }

    // Trạng thái 2: Mình đang follow họ (họ chưa follow lại) -> Hiển thị Dropdown "Đang theo dõi"
    if (isFollowing) {
      return (
        <div className="relative" ref={unfollowMenuRef}>
          <button 
            onClick={() => setIsUnfollowMenuOpen(!isUnfollowMenuOpen)}
            disabled={isFollowingLoading}
            className={`font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm ${
              isUnfollowMenuOpen ? 'bg-gray-200 text-gray-900' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            } disabled:opacity-70`}
          >
            {isFollowingLoading ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />} 
            {t('profile.header.followingBtn', 'Đang theo dõi')}
          </button>

          {/* Menu xổ xuống để Bỏ theo dõi */}
          {isUnfollowMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95">
              <button 
                onClick={handleUnfollowButton}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-3 transition-colors"
              >
                <UserMinus size={16} />
                {t('profile.header.unfollowBtn', 'Bỏ theo dõi')}
              </button>
            </div>
          )}
        </div>
      );
    }
    
    // Trạng thái 3: Nút "Theo dõi lại" (Họ follow mình, mình chưa follow)
    if (!isFollowing && isFollower) {
      return (
        <button 
          onClick={handleFollowButton}
          disabled={isFollowingLoading}
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm disabled:opacity-70"
        >
          {isFollowingLoading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />} 
          {t('profile.header.followBackBtn', 'Theo dõi lại')}
        </button>
      );
    }

    // Trạng thái 4: Nút "Theo dõi" (Chưa ai follow ai)
    return (
      <button 
        onClick={handleFollowButton}
        disabled={isFollowingLoading}
        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm disabled:opacity-70"
      >
        {isFollowingLoading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />} 
        {t('profile.header.followBtn', 'Theo dõi')}
      </button>
    );
  };

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
                {profile.followerCount || 0} <span className="text-gray-400">{t('profile.header.followersCount', 'Followers')}</span> • {profile.followingCount || 0} <span className="text-gray-400">{t('profile.header.followingCount', 'Following')}</span>
              </p>
            </div>
          </div>

          {/* Các nút Hành động */}
          <div className="flex gap-2 pb-1 sm:pb-3 shrink-0">
            <button 
              onClick={handleSayHello} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm"
            >
              <MessageCircle size={16} /> {t('profile.header.messageBtn', 'Nhắn tin')}
            </button>
            
            {/* Gọi hàm render nút Follow ở đây */}
            {renderFollowButton()}
            
          </div>
        </div>

        {/* Menu Tabs ảo */}
        <div className="flex gap-2 mt-1 overflow-x-auto whitespace-nowrap hide-scrollbar">
          {[
            t('profile.header.tabIntro', 'Giới thiệu'), 
            t('profile.header.tabPosts', 'Bài viết'), 
            t('profile.header.tabPhotos', 'Ảnh')
          ].map((tab, idx) => (
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