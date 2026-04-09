'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCourseForm } from './hooks/useCourseForm';

// Imports components
import BasicInfoSection from './components/BasicInforSection'
import SubjectTopicSection from './components/SubjectTopicSection';
import ScheduleSection from './components/ScheduleSection';
import DescriptionSection from './components/DecriptionSection'

const CreateCoursePage = () => {
  const { t } = useTranslation();
  const {
    formData, loading, submitting, subjects, availableTopics, selectedSubjectId, isCoverUploading,
    handleInputChange, handleSubjectChange, handleAddSchedule, handleRemoveSchedule, handleUpdateSchedule, handleCoverImageChange, handleSubmit, router
  } = useCourseForm();

  return (
    <div className="max-w-5xl mx-auto p-10 bg-white min-h-screen font-sans animate-in fade-in duration-500">
      {/* Header */}
      <button 
        onClick={() => router.back()} 
        className="mb-8 flex items-center gap-2 text-gray-500 hover:text-black font-medium transition-colors"
      >
        <ChevronLeft size={20} /> {t('classroom.create.backToProfile', 'Back to Profile')}
      </button>

      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-slate-800">{t('classroom.create.title', 'Create New Course')}</h1>

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
          className={`px-10 py-3 bg-[#FF6636] text-white font-bold rounded-sm transition-all shadow-md ${
            submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e55b30] hover:shadow-lg active:scale-95'
          }`}
          onClick={handleSubmit}
        >
          {submitting 
            ? t('classroom.create.creating', 'Creating...') 
            : t('classroom.create.saveAndNext', 'Save & Next')}
        </button>
      </div>
    </div>
  );
};

export default CreateCoursePage;
