import React from 'react';
import { Loader2 } from 'lucide-react';
import { Subject, Topic } from '@/lib/redux/features/tutorCourseSlice';

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
  subjects, availableTopics, selectedSubjectId, selectedTopicId, loading, onSubjectChange, onTopicChange 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Subject Dropdown */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Subject (Môn học)</label>
        <div className="relative">
          <select
            className="w-full p-3 border border-gray-200 rounded-md outline-none bg-white appearance-none focus:border-orange-500"
            value={selectedSubjectId}
            onChange={(e) => onSubjectChange(e.target.value)}
            disabled={loading}
          >
            <option value="" disabled>-- Chọn môn học --</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name} ({subject.id})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            {loading ? <Loader2 className="animate-spin" size={16} /> : (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            )}
          </div>
        </div>
      </div>

      {/* Topic Dropdown */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Topic (Chủ đề)</label>
        <div className="relative">
          <select
            className="w-full p-3 border border-gray-200 rounded-md outline-none bg-white appearance-none focus:border-orange-500 disabled:bg-gray-100 disabled:text-gray-400"
            value={selectedTopicId}
            onChange={(e) => onTopicChange(e.target.value)}
            disabled={!selectedSubjectId}
          >
            <option value="" disabled>
              {!selectedSubjectId ? '-- Vui lòng chọn môn trước --' : '-- Chọn chủ đề --'}
            </option>
            {availableTopics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectTopicSection;