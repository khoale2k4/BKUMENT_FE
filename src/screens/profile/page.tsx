"use client";

import React, { useEffect } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';

// Import các components con
import ProfileHeader, { TabType } from "./tabs/ProfileHeader"
import HomeTab from './tabs/Home/HomeTab';
import MyTeachingClassTab from './tabs/MyClass/MyTeachingClassTab';
import AboutTab from './tabs/About';
import MyStudyingClassTab from './tabs/MyClass/MyStudyingClassTab';

const ProfilePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Lấy tab từ URL hoặc mặc định là 'about'
  const activeTab = (searchParams.get('tab') as TabType) || 'about';

  const setActiveTab = (tab: TabType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const { classes } = useAppSelector((state) => state.tutorCourse);
  const { user, roles } = useAppSelector((state) => state.auth);
  
  // Sửa logic check tutor: Phải check role TUTOR
  const isTutor = roles.includes('TUTOR');
  
  // Ưu tiên lấy tên từ Auth Slice nếu có, hoặc fallback
  const displayName = user?.name || (classes.length > 0 ? classes[0].tutorName : t('people.profile.defaultTitle'));

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 font-sans min-h-screen bg-white">
      {/* 1. Header & Navigation */}
      <ProfileHeader 
        tutorName={displayName} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* 2. Content Area - Render nội dung dựa trên Active Tab */}
      <div className="mt-6 transition-all duration-300">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'my-teaching-class' && <MyTeachingClassTab />}
        {activeTab === 'my-studying-class' && <MyStudyingClassTab />}
        {activeTab === 'about' && <AboutTab />}
      </div>
    </div>
  );
};

export default ProfilePage;