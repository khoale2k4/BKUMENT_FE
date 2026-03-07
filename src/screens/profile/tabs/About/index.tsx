'use client';

import React from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import UserAboutTab from './UserAboutTab';
import TutorAboutTab from './TutorAboutTab';

const AboutTab = () => {
  // Lấy role hiện tại đang được active từ Redux
  const { currentRole } = useAppSelector(state => state.auth);

  // Điều phối: Nếu đang ở chế độ Gia sư -> Hiện form Gia sư. Ngược lại hiện form User
  if (currentRole === 'TUTOR') {
    return <TutorAboutTab />;
  }

  return <UserAboutTab />;
};

export default AboutTab;