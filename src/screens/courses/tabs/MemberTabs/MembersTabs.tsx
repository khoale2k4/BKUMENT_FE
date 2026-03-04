'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Loader2, Users, Clock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getMemberInCourse, getMemberPendingInCourse } from '@/lib/redux/features/tutorCourseSlice';

import MemberSearch from './components/MemberSearch';
import MemberList from './components/MemberList';
import { CourseMember } from './components/MemberItem';

interface MembersTabProps {
  courseId: string;
}

// Định nghĩa các loại Sub-tab
type SubTabType = 'approved' | 'pending';

const MembersTab: React.FC<MembersTabProps> = ({ courseId }) => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  
  // State quản lý Tab đang active
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('approved');
  
  const { members, pendingMembers, loadingMembers, error } = useAppSelector((state) => state.tutorCourse);

  // Gọi API lấy dữ liệu
  useEffect(() => {
    if (courseId) {
      dispatch(getMemberInCourse(courseId));
      dispatch(getMemberPendingInCourse(courseId)); 
    }
  }, [dispatch, courseId]);

  // 1. Lọc danh sách thành viên CHÍNH THỨC
  const filteredApprovedMembers = useMemo(() => {
    if (!members) return [];
    const typedMembers = members as CourseMember[];
    const activeMembers = typedMembers.filter(m => m.status === 'APPROVED');

    if (!searchQuery.trim()) return activeMembers;
    const lowerQuery = searchQuery.toLowerCase();
    return activeMembers.filter(member => 
      member.studentName.toLowerCase().includes(lowerQuery) || 
      member.studentEmail.toLowerCase().includes(lowerQuery)
    );
  }, [members, searchQuery]);

  // 2. Lọc danh sách thành viên CHỜ DUYỆT
  const filteredPendingMembers = useMemo(() => {
    if (!pendingMembers) return [];
    const typedMembers = pendingMembers as CourseMember[];
    const pendingList = typedMembers.filter(m => m.status === 'PENDING');

    if (!searchQuery.trim()) return pendingList;
    const lowerQuery = searchQuery.toLowerCase();
    return pendingList.filter(member => 
      member.studentName.toLowerCase().includes(lowerQuery) || 
      member.studentEmail.toLowerCase().includes(lowerQuery)
    );
  }, [pendingMembers, searchQuery]);

  // Xử lý UI Loading & Error
  if (loadingMembers) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg">
        Đã xảy ra lỗi: {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-white font-serif text-[#1c1e21] animate-in fade-in duration-500 p-2">
      {/* Header Info */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Members Management</h2>
        <p className="text-sm text-gray-500 font-sans">Quản lý và xét duyệt học viên trong lớp học của bạn.</p>
      </div>

      {/* --- SUB-TABS NAVIGATION --- */}
      <div className="flex gap-8 border-b border-gray-200 mb-8 font-sans">
        {/* Tab Chính thức */}
        <button
          onClick={() => setActiveSubTab('approved')}
          className={`flex items-center gap-2 pb-3 text-sm font-bold transition-all border-b-2 ${
            activeSubTab === 'approved'
              ? 'border-black text-black'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <Users size={16} />
          Chính thức
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
            activeSubTab === 'approved' ? 'bg-gray-100 text-black' : 'bg-gray-50 text-gray-400'
          }`}>
            {filteredApprovedMembers.length}
          </span>
        </button>
        
        {/* Tab Chờ duyệt */}
        <button
          onClick={() => setActiveSubTab('pending')}
          className={`flex items-center gap-2 pb-3 text-sm font-bold transition-all border-b-2 ${
            activeSubTab === 'pending'
              ? 'border-orange-500 text-orange-500'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <Clock size={16} />
          Chờ duyệt
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
            activeSubTab === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-400'
          }`}>
            {filteredPendingMembers.length}
          </span>
        </button>
      </div>

      {/* Search Component (Hiển thị cố định cho cả 2 Tab) */}
      <MemberSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* --- CONTENT AREA: RENDERING DỰA TRÊN TAB ĐANG CHỌN --- */}
      <div className="min-h-[300px] mt-6">
        
        {/* Nội dung Tab Chính thức */}
        {activeSubTab === 'approved' && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {filteredApprovedMembers.length === 0 && !searchQuery ? (
              <div className="text-center py-12 text-gray-400 font-sans italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                Lớp học chưa có thành viên chính thức nào.
              </div>
            ) : (
              <MemberList members={filteredApprovedMembers} />
            )}
            
            {filteredApprovedMembers.length > 10 && (
              <div className="flex justify-center mt-10">
                <button className="px-8 py-2 border border-gray-300 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors font-sans">
                  Load More
                </button>
              </div>
            )}
          </section>
        )}

        {/* Nội dung Tab Chờ duyệt */}
        {activeSubTab === 'pending' && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {filteredPendingMembers.length === 0 && !searchQuery ? (
              <div className="text-center py-12 text-gray-400 font-sans italic bg-orange-50/30 rounded-xl border border-dashed border-orange-100">
                Không có yêu cầu tham gia nào đang chờ duyệt.
              </div>
            ) : (
              <MemberList members={filteredPendingMembers} />
            )}
            
            {filteredPendingMembers.length > 10 && (
              <div className="flex justify-center mt-10">
                <button className="px-8 py-2 border border-gray-300 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors font-sans">
                  Load More
                </button>
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
};

export default MembersTab;