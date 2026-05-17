'use client';

import React, { useState } from 'react';
import { Loader2, Plus, X, Clock, CheckCircle2, XCircle } from 'lucide-react';
import SubjectSuggestionForm from './SubjectSuggestionForm';
import ReviewSuggestionModal from '../../../subjectSuggestion/reviewSuggestionModal';
import { PaginatedSuggestions, SubjectSuggestionItem } from '@/lib/redux/features/profileSlice';

interface Props {
  allSubjects?: any[]; // Dùng cho form đề xuất
  data: PaginatedSuggestions | null;
  isLoading: boolean;
  onRefresh: () => void;
  mode?: 'USER' | 'ADMIN'; // Cờ phân biệt User hay Admin
}

const SubjectSuggestionList: React.FC<Props> = ({ allSubjects = [], data, isLoading, onRefresh, mode = 'USER' }) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [reviewModal, setReviewModal] = useState<{ isOpen: boolean, type: 'APPROVE'|'REJECT', item: SubjectSuggestionItem | null }>({
    isOpen: false, type: 'APPROVE', item: null
  });

  const handleSuccess = () => {
    setIsFormModalOpen(false);
    setReviewModal({ isOpen: false, type: 'APPROVE', item: null });
    onRefresh(); 
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case 'APPROVED': return <span className="flex items-center w-fit gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-bold"><CheckCircle2 size={14}/> Đã duyệt</span>;
      case 'REJECTED': return <span className="flex items-center w-fit gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-bold"><XCircle size={14}/> Từ chối</span>;
      default: return <span className="flex items-center w-fit gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-md text-xs font-bold"><Clock size={14}/> Chờ duyệt</span>;
    }
  };

  return (
    <div className="mt-6 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{mode === 'ADMIN' ? 'Quản lý Đề xuất Môn học' : 'Danh sách Đề xuất của bạn'}</h3>
          <p className="text-sm text-gray-500">Danh sách các môn học/chủ đề được đề xuất lên hệ thống.</p>
        </div>
        
        {/* Nút đề xuất mới CHỈ HIỆN CHO USER */}
        {mode === 'USER' && (
          <button onClick={() => setIsFormModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-all shadow-sm">
            <Plus size={18} /> Đề xuất mới
          </button>
        )}
      </div>

      {/* Bảng Danh sách */}
      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-purple-600" size={24} /></div>
      ) : !data?.data || data.data.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">
          Chưa có đề xuất nào.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-t-lg">
              <tr>
                <th className="px-4 py-3 w-[25%] min-w-[200px]">Tên đề xuất</th>
                <th className="px-4 py-3 w-[10%] min-w-[100px]">Loại</th>
                <th className="px-4 py-3 w-[15%] min-w-[100px]">Ngày gửi</th>
                <th className="px-4 py-3 w-[15%] min-w-[120px]">Trạng thái</th>
                <th className={`px-4 py-3 ${mode === 'ADMIN' ? 'w-[20%]' : 'w-[35%]'} min-w-[200px]`}>Ghi chú / Lý do</th>
                {mode === 'ADMIN' && <th className="px-4 py-3 w-[15%] text-center">Hành động</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-medium text-gray-900 break-words">{item.proposedName}</td>
                  <td className="px-4 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold">{item.type}</span></td>
                  <td className="px-4 py-4 whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{renderStatus(item.status)}</td>
                  <td className="px-4 py-4 text-gray-500 whitespace-normal break-words">
                    {item.status === 'REJECTED' ? item.rejectionReason : item.reason}
                  </td>
                  {/* Cột Hành động CHỈ HIỆN CHO ADMIN */}
                  {mode === 'ADMIN' && (
                    <td className="px-4 py-4 text-center">
                      {item.status === 'PENDING' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setReviewModal({ isOpen: true, type: 'APPROVE', item })} className="text-xs font-bold text-green-600 hover:bg-green-50 px-2 py-1 rounded">Duyệt</button>
                          <button onClick={() => setReviewModal({ isOpen: true, type: 'REJECT', item })} className="text-xs font-bold text-red-600 hover:bg-red-50 px-2 py-1 rounded">Từ chối</button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Đã xử lý</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal User Đề xuất mới */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95">
             <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10 rounded-t-3xl">
              <h2 className="text-lg font-bold text-gray-900">Tạo đề xuất mới</h2>
              <button onClick={() => setIsFormModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-4"><SubjectSuggestionForm allSubjects={allSubjects} onSuccess={handleSuccess} /></div>
          </div>
        </div>
      )}

      {/* Modal Admin Review */}
      {reviewModal.isOpen && reviewModal.item && (
         <ReviewSuggestionModal 
            suggestion={reviewModal.item} 
            actionType={reviewModal.type} 
            onClose={() => setReviewModal({ isOpen: false, type: 'APPROVE', item: null })} 
            onSuccess={handleSuccess} 
         />
      )}
    </div>
  );
};

export default SubjectSuggestionList;