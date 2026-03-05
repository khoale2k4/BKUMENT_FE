'use client';

import React from 'react';
import { useTutorSearch } from './useTutorSearch';
import TutorSearchFilters from './components/TutorSearchFilters';
import TutorList from './components/TutorList';

const TutorsPage = () => {
  // 1. Gọi Custom Hook để lấy data và hàm xử lý
  const { tutors, subjects, loading, error, filters, handleFilterChange, handleSearch } = useTutorSearch();

  // 2. Dựng giao diện bằng các mảnh ghép Component
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 font-sans text-gray-800 animate-in fade-in duration-500">
      
      <TutorSearchFilters 
        filters={filters} 
        subjects={subjects}
        loading={loading}
        onFilterChange={handleFilterChange} 
        onSearch={handleSearch} 
      />

      <TutorList 
        tutors={tutors} 
        loading={loading} 
        error={error} 
      />

    </div>
  );
};

export default TutorsPage;