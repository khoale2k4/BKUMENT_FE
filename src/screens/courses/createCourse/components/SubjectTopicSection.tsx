'use client';

import React from 'react';
import { Select } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Subject, Topic } from '@/types/course';

interface Props {
  subjects: Subject[];
  availableTopics: Topic[];
  selectedSubjectId: string;
  selectedTopicId: string;
  loading: boolean;
  onSubjectChange: (id: string) => void;
  onTopicChange: (id: string) => void;
}

const SubjectTopicSection: React.FC<Props> = ({
  subjects,
  availableTopics,
  selectedSubjectId,
  selectedTopicId,
  loading,
  onSubjectChange,
  onTopicChange,
}) => {
  const { t } = useTranslation();

  const subjectData = subjects.map((s) => ({
    value: s.id.toString(),
    label: s.name,
  }));

  const topicData = availableTopics.map((t) => ({
    value: t.id.toString(),
    label: t.name,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Subject Dropdown */}
      <Select
        label={t('classroom.create.form.selectSubject', 'Subject')}
        placeholder={t('classroom.create.form.selectSubject', '-- Select Subject --')}
        data={subjectData}
        value={selectedSubjectId}
        onChange={(val) => onSubjectChange(val || '')}
        searchable
        nothingFoundMessage="No subjects found"
        disabled={loading}
        styles={{
          label: { fontWeight: 700, marginBottom: 8, fontSize: 14, color: '#374151' },
          input: { border: '1px solid #E5E7EB', borderRadius: 6, padding: 12, height: 'auto', minHeight: 48 },
        }}
      />

      {/* Topic Dropdown */}
      <Select
        label={t('classroom.create.form.selectTopic', 'Topic')}
        placeholder={!selectedSubjectId 
            ? t('classroom.create.form.selectSubjectFirst', '-- Please select subject first --') 
            : t('classroom.create.form.selectTopic', '-- Select Topic --')}
        data={topicData}
        value={selectedTopicId}
        onChange={(val) => onTopicChange(val || '')}
        searchable
        nothingFoundMessage="No topics found"
        disabled={!selectedSubjectId || loading}
        styles={{
          label: { fontWeight: 700, marginBottom: 8, fontSize: 14, color: '#374151' },
          input: { border: '1px solid #E5E7EB', borderRadius: 6, padding: 12, height: 'auto', minHeight: 48 },
        }}
      />
    </div>
  );
};

export default SubjectTopicSection;
