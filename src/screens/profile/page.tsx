'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';

// Import các components con
import ProfileHeader, { TabType } from "./tabs/ProfileHeader"
import HomeTab from './tabs/Home/HomeTab';
import MyTeachingClassTab from './tabs/MyClass/MyTeachingClassTab';
import AboutTab from './tabs/About';
import MyStudyingClassTab from './tabs/MyClass/MyStudyingClassTab';

const ProfilePage = () => {
  // State quản lý tab đang active
  const [activeTab, setActiveTab] = useState<TabType>('about');
  
  // Lấy thông tin user (để hiển thị tên) từ Redux
  // Lưu ý: Có thể lấy từ authSlice.user.name nếu tutorCourse chưa load xong
  const { classes } = useAppSelector((state) => state.tutorCourse);
  const { user } = useAppSelector((state) => state.auth);

  const { roles } = useAppSelector(state => state.auth);
  const isTutor = roles.includes('USER');
  console.log('User Roles:', isTutor);
  
  // Ưu tiên lấy tên từ Auth Slice nếu có, hoặc fallback
  const displayName = user?.name || (classes.length > 0 ? classes[0].tutorName : 'Tutor Profile');

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 font-sans min-h-screen bg-white">
      {/* 1. Header & Navigation */}
      <ProfileHeader 
        tutorName={displayName} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* 2. Content Area - Render nội dung dựa trên Active Tab */}
      <div className="mt-6">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'my-teaching-class' && <MyTeachingClassTab />}
        {activeTab === 'my-studying-class' && <MyStudyingClassTab />}
        {activeTab === 'about' && <AboutTab />}
      </div>
    </div>
  );
};

export default ProfilePage;