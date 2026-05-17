'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Loader2, Send } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { submitSubjectReviewSuggestion } from '@/lib/redux/features/profileSlice';
import { showToast } from '@/lib/redux/features/toastSlice';
import { SubjectSuggestionPayload } from '@/lib/services/profile.service';

interface SubjectSuggestionFormProps {
  allSubjects: any[]; // Nhận danh sách môn học từ Component cha
  onSuccess?: () => void; // 👉 Thêm prop này
}

const SubjectSuggestionForm: React.FC<SubjectSuggestionFormProps> = ({ allSubjects, onSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isSubmittingSuggestion } = useAppSelector((state) => state.profile);

  const [formData, setFormData] = useState<SubjectSuggestionPayload>({
    type: 'SUBJECT', // Mặc định là đề xuất môn học lớn
    proposedName: '',
    parentSubjectId: '',
    reason: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.proposedName.trim() || !formData.reason.trim()) {
      dispatch(showToast({
        type: 'error',
        title: t('common.report.errorTitle', 'Lỗi'),
        message: t('profile.tutor.suggestion.missingFields', 'Vui lòng nhập tên đề xuất và lý do.')
      }));
      return;
    }

    try {
      // Gọi Thunk Submit
      await dispatch(submitSubjectReviewSuggestion(formData)).unwrap();
      
      dispatch(showToast({
        type: 'success',
        title: t('common.toast.success', 'Thành công'),
        message: t('profile.tutor.suggestion.success', 'Đề xuất của bạn đã được gửi và đang chờ phê duyệt!')
      }));

      // Reset form sau khi gửi thành công
      setFormData({ type: 'SUBJECT', proposedName: '', parentSubjectId: '', reason: '' });
    // 👉 Gọi hàm này để đóng Popup và refresh list
      if (onSuccess) onSuccess();
    } catch (error: any) {
      dispatch(showToast({
        type: 'error',
        title: t('common.report.errorTitle', 'Lỗi'),
        message: error || t('profile.tutor.suggestion.failed', 'Gửi đề xuất thất bại.')
      }));
    }
  };

  return (
    <div className="bg-purple-50/50 p-6 sm:p-8 rounded-3xl border border-purple-100 mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
          <Lightbulb size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {t('profile.tutor.suggestion.title', 'Đề xuất Môn học / Chủ đề mới')}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {t('profile.tutor.suggestion.subtitle', 'Không tìm thấy môn học bạn muốn dạy? Hãy đề xuất cho chúng tôi.')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Loại đề xuất */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('profile.tutor.suggestion.type', 'Loại đề xuất')}
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="SUBJECT">{t('profile.tutor.suggestion.typeSubject', 'Môn học mới')}</option>
              <option value="TOPIC">{t('profile.tutor.suggestion.typeTopic', 'Chủ đề (Nằm trong 1 môn học)')}</option>
            </select>
          </div>

          {/* Tên đề xuất */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('profile.tutor.suggestion.proposedName', 'Tên đề xuất')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="proposedName"
              value={formData.proposedName}
              onChange={handleChange}
              placeholder={t('profile.tutor.suggestion.namePlaceholder', 'VD: Lập trình AI...')}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>

        {/* Chọn Môn học gốc (Chỉ hiện khi chọn TOPIC) */}
        {formData.type === 'TOPIC' && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('profile.tutor.suggestion.parentSubject', 'Thuộc môn học nào?')}
            </label>
            <select
              name="parentSubjectId"
              value={formData.parentSubjectId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">{t('profile.tutor.suggestion.selectParent', '-- Chọn môn học --')}</option>
              {(Array.isArray(allSubjects) ? allSubjects :  allSubjects).map((sub: any) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Lý do */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('profile.tutor.suggestion.reason', 'Lý do đề xuất')} <span className="text-red-500">*</span>
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={3}
            placeholder={t('profile.tutor.suggestion.reasonPlaceholder', 'VD: Rất nhiều sinh viên đang cần học kĩ năng này...')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
          />
        </div>

        {/* Nút Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmittingSuggestion}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-full transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
          >
            {isSubmittingSuggestion ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {t('profile.tutor.suggestion.submitBtn', 'Gửi đề xuất')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubjectSuggestionForm;