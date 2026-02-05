import React from 'react';
import { Clock, Users, BarChart3, BookOpen, HelpCircle } from 'lucide-react';

const CourseHeader = () => {
  const stats = [
    { icon: <Clock size={18} className="text-orange-500" />, label: '2Weeks' },
    { icon: <Users size={18} className="text-orange-500" />, label: '156 Students' },
    { icon: <BarChart3 size={18} className="text-orange-500" />, label: 'All levels' },
    { icon: <BookOpen size={18} className="text-orange-500" />, label: '20 Lessons' },
    { icon: <HelpCircle size={18} className="text-orange-500" />, label: '3 Quizzes' },
  ];

  return (
    <div className="mb-8">
      <nav className="text-sm text-gray-500 mb-4">
        Ly Thanh Nhat Quang / Course / <span className="text-gray-400">C3005</span>
      </nav>
      <h1 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
        The Ultimate Guide To The Best WordPress LMS Plugin
      </h1>
      <div className="flex flex-wrap gap-6 items-center">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700">
            {stat.icon}
            {stat.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseHeader;