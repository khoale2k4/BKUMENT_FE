'use client';

import React, { useState } from 'react';
import CourseHeader from './components/CourseHeader';
import OverviewTab from './tabs/OverviewTab';
import MembersTab from './tabs/MembersTabs';
import ResourcesTab from './tabs/ResoursesTabs';
import NotificationsTab from './tabs/NotificationTabs';

const CoursePage = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Members', 'Resources', 'Notification'];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 bg-white min-h-screen">
      <CourseHeader />

      {/* Tabs Navigation */}
      <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-8 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-center font-bold transition-all
              ${activeTab === tab 
                ? 'text-orange-500 bg-white border-b-2 border-orange-500' 
                : 'text-gray-700 bg-white hover:bg-gray-50 border-r border-gray-100 last:border-r-0'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content Rendering */}
      <div className="min-h-[300px]">
        {activeTab === 'Overview' && <OverviewTab />}
        {activeTab === 'Members' && <MembersTab/>}
                {activeTab === 'Resources' && <ResourcesTab/>}
                                {activeTab === 'Notification' && <NotificationsTab/>}
        {/* Thêm các tab khác tương tự */}
      </div>


    </div>
  );
};

export default CoursePage;