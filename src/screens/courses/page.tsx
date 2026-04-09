'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

import { getClassDetailsById, clearClassDetail } from '@/lib/redux/features/tutorFindingSlice';

import CourseHeader from './components/CourseHeader';
import OverviewTab from './tabs/OverviewTab';
import MembersTab from './tabs/MemberTabs/MembersTabs';
import ResourcesTab from './tabs/ResoursesTabs';
import NotificationsTab from './tabs/NotificationTabs/NotificationTabs';

const CoursePage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const courseId = params.id as string;
  
  const dispatch = useAppDispatch();
  
  const { currentClassDetail, loadingClassDetail, errorClassDetail } = useAppSelector((state) => state.tutorFinding);

  const [activeTab, setActiveTab] = useState('Overview');
  
  const tabs = [
    { id: 'Overview', labelKey: 'classroom.tabs.overview', labelDefault: 'Overview' },
    { id: 'Members', labelKey: 'classroom.tabs.members', labelDefault: 'Members' },
    { id: 'Resources', labelKey: 'classroom.tabs.resources', labelDefault: 'Resources' },
    { id: 'Notification', labelKey: 'classroom.tabs.notification', labelDefault: 'Notification' },
  ];

  useEffect(() => {
    if (courseId) {
      dispatch(getClassDetailsById(courseId));
    }
    else{
      console.error("Course ID is missing in URL parameters.");
    }

    return () => {
      dispatch(clearClassDetail());
    };
  }, [dispatch, courseId]);

  if (loadingClassDetail) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">{t('classroom.loading', 'Loading classroom data...')}</p>
      </div>
    );
  }

  if (errorClassDetail) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 text-red-500 p-8 rounded-2xl border border-red-100 max-w-lg text-center font-medium shadow-sm">
          <p>{t('classroom.errorLoad', 'Could not load this classroom.')}</p>
          <p className="text-sm mt-2 opacity-80">{t('errors.details', 'Error details')}: {errorClassDetail}</p>
        </div>
      </div>
    );
  }

  if (!currentClassDetail) {
    return (
       <div className="flex justify-center items-center min-h-screen">
         <p className="text-gray-500">{t('classroom.notFound', 'Classroom information not found.')}</p>
       </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 bg-white min-h-screen animate-in fade-in duration-500">
      
      <CourseHeader courseId={courseId} />

      <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-8 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 text-center font-bold transition-all
              ${activeTab === tab.id 
                ? 'text-orange-500 bg-white border-b-2 border-orange-500' 
                : 'text-gray-700 bg-white hover:bg-gray-50 border-r border-gray-100 last:border-r-0'}`}
          >
            {t(tab.labelKey, tab.labelDefault)}
          </button>
        ))}
      </div>

      <div className="min-h-[300px]">
        {activeTab === 'Overview' && <OverviewTab courseId={courseId}/>}
        {activeTab === 'Members' && <MembersTab courseId={courseId} />}
        {activeTab === 'Resources' && <ResourcesTab />}
        {activeTab === 'Notification' && NotificationsTab && <NotificationsTab courseId={courseId} />}
      </div>
      
    </div>
  );
};

export default CoursePage;