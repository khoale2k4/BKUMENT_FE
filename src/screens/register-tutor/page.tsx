'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getMyTutorApplication } from '@/lib/redux/features/profileSlice';
import { getSearchSubjects } from '@/lib/redux/features/tutorFindingSlice';

import { LoadingView } from './LoadingView';
import { SuccessView } from './SuccessView';
import { PendingView } from './PendingView';
import { TutorForm } from './TutorForm';

export default function RegisterTutorPage() {
  const dispatch = useAppDispatch();

  const { tutorApplication, isTutorApplicationLoading } = useAppSelector((state) => state.profile);
  const { subjects } = useAppSelector((state) => state.tutorFinding);

  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // Khởi tạo dữ liệu khi vào trang
  useEffect(() => {
    dispatch(getMyTutorApplication());
    if (!subjects || subjects.length === 0) {
      dispatch(getSearchSubjects());
    }
  }, [dispatch, subjects]);

  // ĐIỀU HƯỚNG GIAO DIỆN (CONDITIONAL RENDERING)
  
  if (isTutorApplicationLoading) {
    return <LoadingView />;
  }

  if (isSubmitSuccess || tutorApplication?.status === 'APPROVED') {
    return <SuccessView isApproved={tutorApplication?.status === 'APPROVED'} />;
  }

  if (tutorApplication?.status === 'PENDING') {
    return <PendingView application={tutorApplication} />;
  }

  // Trường hợp mặc định: Chưa có đơn hoặc bị REJECTED
  return (
    <TutorForm 
      onSuccess={() => setIsSubmitSuccess(true)} 
    />
  );
}