'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';

// Import các components con
import ProfileHeader, { TabType } from "./components/ProfileHeader"
import HomeTab from './components/HomeTab';
import MyClassTab from './components/MyClassTab';
import AboutTab from './components/AboutTab';

const ProfilePage = () => {
  // State quản lý tab đang active
  const [activeTab, setActiveTab] = useState<TabType>('my-class');
  
  // Lấy thông tin user (để hiển thị tên) từ Redux
  // Lưu ý: Có thể lấy từ authSlice.user.name nếu tutorCourse chưa load xong
  const { classes } = useAppSelector((state) => state.tutorCourse);
  const { user } = useAppSelector((state) => state.auth);
  
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
        {activeTab === 'my-class' && <MyClassTab />}
        {activeTab === 'about' && <AboutTab />}
      </div>
    </div>
  );
};

export default ProfilePage;