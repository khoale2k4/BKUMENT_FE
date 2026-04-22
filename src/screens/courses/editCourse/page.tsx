'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { getAllTeachingClasses } from '@/lib/redux/features/tutorCourseSlice';

// Import Custom Hook và các Components con bạn đã tách ở phần trước
import { useCourseForm } from '../createCourse/hooks/useCourseForm'; // Tùy chỉnh đường dẫn import cho đúng
import BasicInfoSection from '../createCourse/components/BasicInforSection';
import SubjectTopicSection from '../createCourse/components/SubjectTopicSection';
import ScheduleSection from '../createCourse/components/ScheduleSection';
import DescriptionSection from '../createCourse/components/DecriptionSection';

const EditCoursePage = () => {
  const params = useParams();
  const classId = params.id as string;
  const dispatch = useAppDispatch();
  const router = useRouter();

  // 1. Lấy khóa học hiện tại từ Redux
  const { classes, loading } = useAppSelector((state) => state.tutorCourse);
  const currentCourse = classes.find((c) => c.id === classId);

  // Nếu người dùng F5 trang này, mảng classes bị rỗng, cần gọi lại API
  useEffect(() => {
    if (classes.length === 0) {
      dispatch(getAllTeachingClasses({ page: 1, size: 10 }));
    }
  }, [dispatch, classes.length]);

  // 2. Khởi tạo form với dữ liệu cũ
  const {
    formData,
    submitting,
    subjects,
    availableTopics,
    selectedSubjectId,
    isCoverUploading,
    handleInputChange, 
    handleSubjectChange, 
    handleCoverImageChange,
    handleAddSchedule, 
    handleRemoveSchedule,
    handleUpdateSchedule,
    handleSubmit,
  } = useCourseForm({
    classId: classId,
    initialData: currentCourse,
  });

  console.log("Current Course Data, subjects:", currentCourse, subjects);


  // Hiển thị loading nếu chưa load xong khóa học
  if (loading || (!currentCourse && classes.length > 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  // Nếu id sai không tìm thấy khoá học
  if (!currentCourse) {
    return <div className="text-center mt-20 text-red-500">Không tìm thấy khóa học!</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-10 bg-white min-h-screen font-sans animate-in fade-in duration-500">
      {/* Header */}
      <button
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-gray-500 hover:text-black font-medium transition-colors"
      >
        <ChevronLeft size={20} /> Back to Course
      </button>

      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Chỉnh sửa khóa học
        </h1>

        {/* 1. Basic Info */}
        <BasicInfoSection
          name={formData.name}
          startDate={formData.startDate}
          endDate={formData.endDate}
          coverImageUrl={formData.coverImageUrl}
          isUploading={isCoverUploading}
          onUpload={handleCoverImageChange}
          onChange={handleInputChange}
        />

        {/* 2. Subject & Topic Selector */}
        <SubjectTopicSection
          subjects={subjects}
          availableTopics={availableTopics}
          selectedSubjectId={selectedSubjectId}
          selectedTopicId={formData.topicId}
          loading={loading}
          onSubjectChange={handleSubjectChange}
          onTopicChange={(id) => handleInputChange('topicId', id)}
        />

        {/* 3. Description */}
        <DescriptionSection
          description={formData.description}
          onChange={(val) => handleInputChange('description', val)}
        />

        {/* 4. Schedule Manager */}
        <ScheduleSection
          schedules={formData.schedules}
          onAdd={handleAddSchedule}
          onRemove={handleRemoveSchedule}
          onUpdate={handleUpdateSchedule}
        />
      </div>

      {/* Footer Actions */}
      <div className="mt-20 flex justify-end">
        <button
          disabled={submitting}
          className={`px-10 py-3 bg-[#FF6636] text-white font-bold rounded-sm transition-all shadow-md ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e55b30] hover:shadow-lg active:scale-95'
            }`}
          onClick={handleSubmit}
        >
          {submitting ? 'Updating...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default EditCoursePage;