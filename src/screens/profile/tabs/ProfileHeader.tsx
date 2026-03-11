'use client';

import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useAppSelector } from '@/lib/redux/hooks';

// Định nghĩa kiểu dữ liệu cho các Tab
export type TabType = 'home' | 'my-teaching-class' | 'about' | 'my-studying-class';

interface ProfileHeaderProps {
  tutorName: string;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ tutorName, activeTab, onTabChange }) => {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'my-teaching-class', label: 'My Teaching Classes' },
    { id: 'my-studying-class', label: 'My Studying Classes' },
    { id: 'about', label: 'About' },
  ];

    const { roles, currentRole } = useAppSelector(state => state.auth);
    const isTutor = roles.includes('USER');
    console.log('User Roles:', isTutor);

  return (
    <header className="flex justify-between items-start mb-8">
      <div>
        {/* Tên Gia sư */}
        <h1 className="text-4xl font-bold text-slate-900 mb-8">{tutorName} - {currentRole}</h1>
        
        {/* Navigation Tabs */}
        <nav className="flex gap-8 text-sm font-medium text-slate-600 border-b border-gray-100 pb-0">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`pb-3 transition-colors border-b-2 ${
                activeTab === tab.id 
                  ? 'text-black border-black' 
                  : 'border-transparent hover:text-black hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Settings Button */}
      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
        <MoreHorizontal size={24} />
      </button>
    </header>
  );
};

export default ProfileHeader;