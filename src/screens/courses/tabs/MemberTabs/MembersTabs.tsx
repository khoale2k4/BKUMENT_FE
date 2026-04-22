'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Loader2, Users, Clock, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getMemberInCourse, getMemberPendingInCourse } from '@/lib/redux/features/tutorCourseSlice';

import MemberSearch from './components/MemberSearch';
import MemberList from './components/MemberList';
import { CourseMember } from './components/MemberItem';

interface MembersTabProps {
  courseId: string;
}

type SubTabType = 'approved' | 'pending';

const MembersTab: React.FC<MembersTabProps> = ({ courseId }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('approved');
  
  const { members, pendingMembers, loadingMembers, error } = useAppSelector((state) => state.tutorCourse);
  const { currentClassDetail: currentCourse } = useAppSelector((state) => state.tutorFinding);

  const userStatus = currentCourse?.userStatus || 'NONE';
  const isOwner = userStatus === 'OWNER';
  const isApprovedStudent = userStatus === 'APPROVED' || userStatus === 'STUDENT';

  useEffect(() => {
    if (courseId && (isOwner || isApprovedStudent)) {
      dispatch(getMemberInCourse(courseId));
      
      if (isOwner) {
        dispatch(getMemberPendingInCourse(courseId)); 
      }
    }
  }, [dispatch, courseId, isOwner, isApprovedStudent]);

  const filteredApprovedMembers = useMemo(() => {
    if (!members) return [];
    const typedMembers = Array.isArray(members) ? members as CourseMember[] : (members as any)?.data || [];
    const activeMembers = typedMembers.filter((m: CourseMember) => m.status === 'APPROVED');

    if (!searchQuery.trim()) return activeMembers;
    const lowerQuery = searchQuery.toLowerCase();
    return activeMembers.filter((member: CourseMember) => 
      member.studentName.toLowerCase().includes(lowerQuery) || 
      member.studentEmail.toLowerCase().includes(lowerQuery)
    );
  }, [members, searchQuery]);

  const filteredPendingMembers = useMemo(() => {
    if (!pendingMembers) return [];
    const typedMembers = Array.isArray(pendingMembers) ? pendingMembers as CourseMember[] : (pendingMembers as any)?.data || [];
    const pendingList = typedMembers.filter((m:CourseMember) => m.status === 'PENDING');

    if (!searchQuery.trim()) return pendingList;
    const lowerQuery = searchQuery.toLowerCase();
    return pendingList.filter((member: CourseMember)   => 
      member.studentName.toLowerCase().includes(lowerQuery) || 
      member.studentEmail.toLowerCase().includes(lowerQuery)
    );
  }, [pendingMembers, searchQuery]);

  if (!isOwner && !isApprovedStudent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <ShieldAlert size={64} className="text-gray-300 mb-6" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">{t('classroom.members.accessDenied', 'Access Denied')}</h3>
        <p className="text-gray-500 text-center max-w-md">
          {t('classroom.members.accessDeniedDesc', 'Only the Tutor and official Students of the class have permission to view the member list.')}
        </p>
      </div>
    );
  }

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
        {t('common.error', 'Error')}: {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-white font-serif text-[#1c1e21] animate-in fade-in duration-500 p-2">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">{t('classroom.members.title', 'Members Management')}</h2>
        <p className="text-sm text-gray-500 font-sans">
          {isOwner 
            ? t('classroom.members.ownerDesc', 'Manage and approve students in your classroom.') 
            : t('classroom.members.studentDesc', 'View the list of classmates in this course.')}
        </p>
      </div>

      <div className="flex gap-8 border-b border-gray-200 mb-8 font-sans">
        
        <button
          onClick={() => setActiveSubTab('approved')}
          className={`flex items-center gap-2 pb-3 text-sm font-bold transition-all border-b-2 ${
            activeSubTab === 'approved'
              ? 'border-black text-black'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <Users size={16} />
          {t('classroom.members.tabs.approved', 'Official')}
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
            activeSubTab === 'approved' ? 'bg-gray-100 text-black' : 'bg-gray-50 text-gray-400'
          }`}>
            {filteredApprovedMembers.length}
          </span>
        </button>
        
        {isOwner && (
          <button
            onClick={() => setActiveSubTab('pending')}
            className={`flex items-center gap-2 pb-3 text-sm font-bold transition-all border-b-2 ${
              activeSubTab === 'pending'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            <Clock size={16} />
            {t('classroom.members.tabs.pending', 'Pending')}
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
              activeSubTab === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-400'
            }`}>
              {filteredPendingMembers.length}
            </span>
          </button>
        )}
      </div>

      <MemberSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="min-h-[300px] mt-6">
        
        {activeSubTab === 'approved' && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {filteredApprovedMembers.length === 0 && !searchQuery ? (
              <div className="text-center py-12 text-gray-400 font-sans italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                {t('classroom.members.empty.approved', 'This classroom has no official members yet.')}
              </div>
            ) : (
              <MemberList members={filteredApprovedMembers} isOwner={isOwner} />
            )}
          </section>
        )}

        {isOwner && activeSubTab === 'pending' && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {filteredPendingMembers.length === 0 && !searchQuery ? (
              <div className="text-center py-12 text-gray-400 font-sans italic bg-orange-50/30 rounded-xl border border-dashed border-orange-100">
                {t('classroom.members.empty.pending', 'No pending enrollment requests.')}
              </div>
            ) : (
              <MemberList members={filteredPendingMembers} isOwner={true} />
            )}
          </section>
        )}

      </div>
    </div>
  );
};

export default MembersTab;