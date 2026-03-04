'use client';

import React, { useState, useEffect } from 'react'; // Nhớ import useEffect
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'; // Import Redux hooks
import { getAllClasses } from '@/lib/redux/features/tutorCourseSlice'; // Import action

import CourseHeader from './components/CourseHeader';
import OverviewTab from './tabs/OverviewTab';
import MembersTab from './tabs/MemberTabs/MembersTabs';
import ResourcesTab from './tabs/ResoursesTabs';
import NotificationsTab from './tabs/NotificationTabs';

const CoursePage = () => {
  const params = useParams();
  const courseId = params.id as string;
  
  const dispatch = useAppDispatch();
  
  // Lấy danh sách classes và trạng thái loading từ Redux
  const { classes, loading } = useAppSelector((state) => state.tutorCourse);

  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Members', 'Resources', 'Notification'];

  // --- THÊM LOGIC NÀY ĐỂ FIX LỖI F5 ---
  useEffect(() => {
    // Nếu mảng classes trống (do người dùng F5 hoặc truy cập trực tiếp bằng link)
    // thì gọi API để lấy lại dữ liệu
    if (classes.length === 0) {
      dispatch(getAllClasses());
    }
  }, [dispatch, classes.length]);
  // ------------------------------------

  // (Tuỳ chọn) Hiển thị trạng thái đang tải dữ liệu để giao diện mượt hơn
  if (loading && classes.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 bg-white min-h-screen">
      <CourseHeader courseId={courseId} />

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
        {activeTab === 'Overview' && <OverviewTab courseId={courseId} />}
        {activeTab === 'Members' && <MembersTab courseId={courseId} />}
        {activeTab === 'Resources' && <ResourcesTab />}
        {activeTab === 'Notification' && <NotificationsTab />}
      </div>
    </div>
  );
};

export default CoursePage;