'use client';

import React, { useEffect, useState } from 'react';
import { useTutorSearch } from './useTutorSearch';
import TutorSearchFilters from './components/TutorSearchFilters';
import TutorList from './components/TutorList';
import Pagination from '../../components/ui/Pagination'; 
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';

import { getTutorApplication, searchTutors } from '@/lib/redux/features/tutorFindingSlice'; 

const TutorsPage = () => {
  const dispatch = useAppDispatch();
  const { currentRole } = useAppSelector(state => state.auth);
  const { currentPage, totalPages } = useAppSelector(state => state.tutorFinding);
  
  // 1. STATE CHO TAB CỦA ADMIN (Mặc định là PENDING)
  const [activeStatus, setActiveStatus] = useState<string>('PENDING');

  const { 
    tutors, 
    subjects, 
    loading, 
    error, 
    filters, 
    handleFilterChange, 
    handleSearch 
  } = useTutorSearch();

  // 2. EFFECT: Gọi API cho Admin mỗi khi `activeStatus` thay đổi
  useEffect(() => {
    if (currentRole === 'ADMIN') {
      // Khi đổi Tab, luôn gọi lại trang 1
      dispatch(getTutorApplication({ status: activeStatus, page: 1, size: 3 }));
    }
  }, [currentRole, activeStatus, dispatch]);

  // 3. HÀM XỬ LÝ CHUYỂN TRANG
  const handlePageChange = (newPage: number) => {
    if (currentRole === 'ADMIN') {
      // Truyền đúng activeStatus hiện tại thay vì chuỗi rỗng
      dispatch(getTutorApplication({ status: activeStatus, page: newPage, size: 3 }));
    } else {
      dispatch(searchTutors({ ...filters, page: newPage, size: 3 }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 font-sans text-gray-800 animate-in fade-in duration-500">
      
      {/* --- GIAO DIỆN DÀNH CHO USER / TUTOR --- */}
      {currentRole === 'USER' && (
        <> 
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
          
          {totalPages > 1 && !loading && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage} 
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {/* --- GIAO DIỆN DÀNH CHO ADMIN --- */}
      {currentRole === 'ADMIN' && (
        <>
          <div className="mb-6 border-b border-gray-100 pb-5">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý duyệt Gia sư</h1>
            <p className="text-gray-500 mt-1">Quản lý danh sách đơn đăng ký trở thành gia sư.</p>
          </div>
          
          {/* COMPONENT TAB CHO ADMIN */}
          <div className="flex gap-6 mb-6 border-b border-gray-200">
            {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`pb-3 text-sm font-semibold transition-all relative ${
                  activeStatus === status
                    ? 'text-purple-600'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {status === 'PENDING' ? 'Đang chờ duyệt' : status === 'APPROVED' ? 'Đã duyệt' : 'Đã từ chối'}
                
                {/* Đường gạch dưới động (Animated underline) */}
                {activeStatus === status && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-md animate-in slide-in-from-left-2 duration-300"></span>
                )}
              </button>
            ))}
          </div>
          
          {/* DANH SÁCH GIA SƯ THEO TAB */}
          <TutorList 
            tutors={tutors} 
            loading={loading} 
            error={error} 
          />

          {/* PAGINATION CHO ADMIN */}
          {totalPages > 1 && !loading && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage} 
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default TutorsPage;