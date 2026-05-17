import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { approveSubjectSuggestion, rejectSubjectSuggestion, SubjectSuggestionItem } from '@/lib/redux/features/profileSlice';
import { showToast } from '@/lib/redux/features/toastSlice';
// 👉 Import thêm Thunk lấy danh sách môn học (Bạn nhớ check lại đường dẫn import này cho khớp với project nhé)
import { getSearchSubjects } from '@/lib/redux/features/tutorFindingSlice';

interface Props {
  suggestion: SubjectSuggestionItem;
  actionType: 'APPROVE' | 'REJECT';
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewSuggestionModal({ suggestion, actionType, onClose, onSuccess }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  // 👉 1. Trích xuất state từ Redux store
  const { subjects: allSubjects, loadingSubjects: allSubjectsLoading } = useAppSelector((state: any) => state.tutorFinding);

  // 👉 2. Gọi API lấy danh sách môn học khi Modal mở (Chỉ gọi nếu duyệt TOPIC)
  useEffect(() => {
    if (actionType === 'APPROVE' && suggestion.type === 'TOPIC') {
      dispatch(getSearchSubjects());
    }
  }, [dispatch, actionType, suggestion.type]);

  // State lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    finalId: '',
    finalName: suggestion.proposedName,
    parentSubjectId: '',
    rejectionReason: '',
    note: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (actionType === 'APPROVE') {
        if (!formData.finalId || !formData.finalName) {
           throw new Error("Vui lòng điền ID và Tên chính thức.");
        }
        
        if (suggestion.type === 'TOPIC' && !formData.parentSubjectId) {
           throw new Error("Vui lòng chọn Môn học gốc (Parent Subject) cho Topic này.");
        }

        await dispatch(approveSubjectSuggestion({ 
          suggestionId: suggestion.id, 
          payload: {
            finalId: formData.finalId,
            finalName: formData.finalName,
            parentSubjectId: suggestion.type === 'TOPIC' ? formData.parentSubjectId : undefined,
            note: formData.note
          } 
        })).unwrap();
      } else {
        if (!formData.rejectionReason) {
           throw new Error("Vui lòng nhập lý do từ chối.");
        }
        await dispatch(rejectSubjectSuggestion({ 
          suggestionId: suggestion.id, 
          payload: {
            rejectionReason: formData.rejectionReason,
            note: formData.note
          } 
        })).unwrap();
      }

      dispatch(showToast({ type: 'success', title: 'Thành công', message: 'Đã xử lý đề xuất thành công!' }));
      onSuccess();
    } catch (error: any) {
      dispatch(showToast({ type: 'error', title: 'Lỗi', message: error.message || error }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative animate-in zoom-in-95">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className={`text-lg font-bold flex items-center gap-2 ${actionType === 'APPROVE' ? 'text-green-600' : 'text-red-600'}`}>
            {actionType === 'APPROVE' ? <CheckCircle size={20}/> : <XCircle size={20}/>}
            {actionType === 'APPROVE' ? 'Phê duyệt đề xuất' : 'Từ chối đề xuất'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg text-sm mb-4 border border-gray-200">
            <p><strong>Tên đề xuất:</strong> {suggestion.proposedName}</p>
            <p><strong>Loại:</strong> <span className="px-2 py-0.5 bg-gray-200 rounded font-semibold text-xs">{suggestion.type}</span></p>
            <p><strong>Lý do từ gia sư:</strong> {suggestion.reason}</p>
          </div>

          {actionType === 'APPROVE' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {suggestion.type === 'SUBJECT' ? 'Mã môn học (Subject ID)' : 'Mã Chủ đề (Topic ID)'} <span className="text-red-500">*</span>
                </label>
                <input 
                  name="finalId" 
                  value={formData.finalId} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                  placeholder={suggestion.type === 'SUBJECT' ? "VD: WEB1011" : "VD: TPC_01"} 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên chính thức (finalName) <span className="text-red-500">*</span></label>
                <input name="finalName" value={formData.finalName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
              </div>

              {suggestion.type === 'TOPIC' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Thuộc môn học nào? (Parent Subject) <span className="text-red-500">*</span></label>
                  <select
                    name="parentSubjectId"
                    value={formData.parentSubjectId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                    disabled={allSubjectsLoading}
                  >
                    <option value="">
                      {allSubjectsLoading ? "Đang tải dữ liệu..." : "-- Chọn môn học gốc --"}
                    </option>
                    {(Array.isArray(allSubjects) ? allSubjects : allSubjects?.data || allSubjects?.content || []).map((sub: any) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {actionType === 'REJECT' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Lý do từ chối (Gửi cho user) <span className="text-red-500">*</span></label>
              <textarea name="rejectionReason" value={formData.rejectionReason} onChange={handleChange} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none" />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ghi chú nội bộ (note)</label>
            <input name="note" value={formData.note} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Hủy</button>
            <button type="submit" disabled={isLoading} className={`flex items-center gap-2 px-5 py-2 text-white rounded-lg font-medium ${actionType === 'APPROVE' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}