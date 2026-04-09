'use client';

import React from 'react';
import { Clock, Users, BarChart3, BookOpen, HelpCircle, Settings } from 'lucide-react';
import { useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";

interface CourseHeaderProps {
  courseId: string;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ courseId }) => {
  const { t } = useTranslation();
  const router = useRouter();
  
  const { currentClassDetail: currentCourse } = useAppSelector((state) => state.tutorFinding);

  if (!currentCourse) {
    return <div className="mb-8 animate-pulse bg-gray-100 h-32 rounded-2xl"></div>;
  }

  const stats = [
    { icon: <Clock size={16} className="text-orange-500" />, label: `${currentCourse.startDate} - ${currentCourse.endDate}` },
    { icon: <Users size={16} className="text-orange-500" />, label: currentCourse.status },
    { 
      icon: <BarChart3 size={16} className="text-orange-500" />, 
      label: t('classroom.header.stats.sessionsPerWeek', '{{count}} Sessions/Week', { count: currentCourse.schedules?.length || 0 }) 
    },
    { icon: <BookOpen size={16} className="text-orange-500" />, label: currentCourse.subjectName },
    { icon: <HelpCircle size={16} className="text-orange-500" />, label: currentCourse.topicName },
  ];

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <nav className="text-sm text-gray-500 mb-4 font-medium flex items-center gap-2">
        <span className="text-orange-600 font-bold">{currentCourse.tutorName}</span> 
        <span>/</span> 
        <span>{t('classroom.header.breadcrumb', 'Course')}</span> 
        <span>/</span> 
        <span className="text-gray-400 truncate max-w-[150px]">{currentCourse.id}</span>
      </nav>
      
      <div className="flex items-start md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight font-serif tracking-tight">
          {currentCourse.name}
        </h1>
        
        <button 
          onClick={() => router.push(`/courses/${courseId}/edit`)}
          className="p-3 rounded-full hover:bg-orange-50 transition-all text-gray-400 hover:text-orange-600 shrink-0 shadow-sm border border-transparent hover:border-orange-100"
          title={t('classroom.header.editCourse', 'Edit Course')}
        >
          <Settings size={22} />
        </button>
      </div>

      {currentCourse.coverImageUrl && (
        <div className="w-full h-56 sm:h-72 md:h-80 mb-6 rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative group">
          <AuthenticatedImage 
            src={currentCourse.coverImageUrl} 
            alt={currentCourse.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      
      <div className="flex flex-wrap gap-3 items-center">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-700 bg-white px-4 py-2.5 rounded-full border border-gray-200 shadow-sm hover:border-orange-200 hover:bg-orange-50 transition-colors cursor-default"
          >
            {stat.icon}
            {stat.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseHeader;