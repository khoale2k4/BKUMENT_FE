'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

import { getClassDetailsById, clearClassDetail } from '@/lib/redux/features/tutorFindingSlice';

import CourseHeader from './components/CourseHeader';
import OverviewTab from './tabs/OverviewTab';
import MembersTab from './tabs/MemberTabs/MembersTabs';
import ResourcesTab from './tabs/ResoursesTabs';
import NotificationsTab from './tabs/NotificationTabs/NotificationTabs';

const CoursePage = () => {
  const params = useParams();
  const courseId = params.id as string;
  
  const dispatch = useAppDispatch();
  
  const { currentClassDetail, loadingClassDetail, errorClassDetail } = useAppSelector((state) => state.tutorFinding);

  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Members', 'Resources', 'Notification'];

  useEffect(() => {
    if (courseId) {
      dispatch(getClassDetailsById(courseId));
    }
    else{
      console.error("Course ID is missing in URL parameters.");
    }

    // Bật lại cleanup để khi back ra ngoài nó xóa data đi, 
    // tránh lỗi nháy hình của lớp cũ khi vào lớp mới
    return () => {
      dispatch(clearClassDetail());
    };
  }, [dispatch, courseId]);

  // 1. CHỈ KIỂM TRA LOADING Ở ĐÂY
  if (loadingClassDetail) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">Đang tải dữ liệu lớp học...</p>
      </div>
    );
  }

  // 2. KIỂM TRA LỖI SAU KHI ĐÃ LOAD XONG
  if (errorClassDetail) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 text-red-500 p-8 rounded-2xl border border-red-100 max-w-lg text-center font-medium shadow-sm">
          <p>Không thể tải lớp học này.</p>
          <p className="text-sm mt-2 opacity-80">Chi tiết lỗi: {errorClassDetail}</p>
        </div>
      </div>
    );
  }

  // 3. CUỐI CÙNG MỚI KIỂM TRA NULL (Nếu ko load, ko lỗi, mà vẫn ko có data)
  if (!currentClassDetail) {
    return (
       <div className="flex justify-center items-center min-h-screen">
         <p className="text-gray-500">Không tìm thấy thông tin lớp học.</p>
       </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 bg-white min-h-screen animate-in fade-in duration-500">
      
      <CourseHeader courseId={courseId} />

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