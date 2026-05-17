'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getAllSubjectSuggestion } from '@/lib/redux/features/profileSlice';
import SubjectSuggestionList from '../profile/tabs/About/SubjectSuggestionList'; // Đổi đường dẫn cho đúng

export default function AllSubjectSuggestionPage() {
  const dispatch = useAppDispatch();
  const { allSuggestionsData, isAllSuggestionsLoading } = useAppSelector(state => state.profile);
  
  // (Tùy chọn) Kiểm tra Role của User ở đây xem có phải ADMIN không
  // const { user } = useAppSelector(state => state.auth);

  const fetchAllSuggestions = () => {
    dispatch(getAllSubjectSuggestion({ page: 0, size: 20 }));
  };

  useEffect(() => {
    fetchAllSuggestions();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-6xl mx-auto">
        <SubjectSuggestionList 
           mode="ADMIN" 
           data={allSuggestionsData} 
           isLoading={isAllSuggestionsLoading} 
           onRefresh={fetchAllSuggestions} 
        />
      </div>
    </div>
  );
}