'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { createClass, updateClass, getMySubjects, uploadCoverImage } from '@/lib/redux/features/tutorCourseSlice';

interface UseCourseFormProps {
  initialData?: any; 
  classId?: string;  
}

export const useCourseForm = ({ initialData, classId }: UseCourseFormProps = {}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { submitting, subjects, loading, isCoverUploading } = useAppSelector((state) => state.tutorCourse);
  const isEditMode = !!classId;

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    coverImageUrl: initialData?.coverImageUrl || '',
    topicId: initialData?.topicId || '',
    schedules: initialData?.schedules?.length > 0 
      ? initialData.schedules 
      : [{ dayOfWeek: 'MONDAY', startTime: '18:00:00', endTime: '20:00:00' }]
  });

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  useEffect(() => {
    dispatch(getMySubjects());
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && subjects.length > 0 && formData.topicId && !selectedSubjectId) {
      const foundSubject = subjects.find(s => 
        s.topics.some(t => t.id === formData.topicId)
      );
      if (foundSubject) {
        setSelectedSubjectId(foundSubject.id);
      }
    }
  }, [isEditMode, subjects, formData.topicId, selectedSubjectId]);

  const availableTopics = useMemo(() => {
    if (!selectedSubjectId) return [];
    const subject = subjects.find((s) => s.id === selectedSubjectId);
    return subject ? subject.topics : [];
  }, [selectedSubjectId, subjects]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    handleInputChange('topicId', ''); 
  };

  const handleAddSchedule = () => {
    setFormData((prev) => ({
      ...prev,
      schedules: [...prev.schedules, { dayOfWeek: 'MONDAY', startTime: '18:00:00', endTime: '20:00:00' }]
    }));
  };

  const handleRemoveSchedule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((_ : any, i: number) => i !== index)
    }));
  };

  const handleUpdateSchedule = (index: number, field: string, value: string) => {
    const newSchedules = [...formData.schedules];
    const formattedValue = (field === 'startTime' || field === 'endTime') && value.length === 5 
      ? `${value}:00` 
      : value;
    
    newSchedules[index] = { ...newSchedules[index], [field]: formattedValue };
    setFormData((prev) => ({ ...prev, schedules: newSchedules }));
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await dispatch(uploadCoverImage(file)).unwrap();
        setFormData((prev) => ({ ...prev, coverImageUrl: url }));
      } catch (err) {
        console.error('Failed to upload cover image', err);
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.topicId) {
      alert(t('classroom.create.messages.validation', 'Please enter course name and select a topic.'));
      return;
    }

    let resultAction: any;

    if (isEditMode) {
      resultAction = await dispatch(updateClass({ classId, courseData: formData }));
    } else {
      resultAction = await dispatch(createClass(formData));
    }

    if (createClass.fulfilled.match(resultAction) || updateClass.fulfilled.match(resultAction)) {
      alert(isEditMode 
        ? t('classroom.create.messages.updateSuccess', 'Course updated successfully!') 
        : t('classroom.create.messages.success', 'Course created successfully!'));
      router.push('/profile');
    } else {
      alert(t('classroom.create.messages.error', 'An error occurred: ') + resultAction.payload);
    }
  };

  return {
    formData,
    loading,
    submitting,
    subjects,
    availableTopics,
    selectedSubjectId,
    isEditMode,
    handleInputChange,
    handleSubjectChange,
    handleAddSchedule,
    handleRemoveSchedule,
    handleUpdateSchedule,
    handleCoverImageChange,
    handleSubmit,
    router,
    isCoverUploading
  };
};
