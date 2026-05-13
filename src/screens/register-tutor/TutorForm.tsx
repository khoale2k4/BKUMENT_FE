import React, { useState, useEffect, useRef } from 'react';
import { User, Image as ImageIcon, BookOpen, FileText, Loader2, AlertCircle, Briefcase, Paperclip, Camera, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { registerTutorProfile, RegisterTutorRequest, uploadFile, getMyTutorApplication } from '@/lib/redux/features/profileSlice';
import { showToast } from '@/lib/redux/features/toastSlice';
import { AuthenticatedImage } from '@/components/ui/AuthenticatedImage';

interface TutorFormProps {
  onSuccess: () => void;
}

export const TutorForm: React.FC<TutorFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { isTutorRegistering, tutorError, tutorApplication } = useAppSelector((state) => state.profile);
  const { subjects, loadingSubjects } = useAppSelector((state) => state.tutorFinding);

  const [formData, setFormData] = useState<RegisterTutorRequest>({
    name: '', introduction: '', avatar: '', subjectIds: [], experience: '', cvUrl: '',
  });

  const [isAvatarUploadingLocal, setIsAvatarUploadingLocal] = useState(false);
  const [isCvUploadingLocal, setIsCvUploadingLocal] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  // Tự động điền lại form nếu đơn bị TỪ CHỐI
  useEffect(() => {
    if (tutorApplication && tutorApplication.status === 'REJECTED') {
      setFormData({
        name: tutorApplication.name || '',
        introduction: tutorApplication.introduction || '',
        avatar: tutorApplication.avatar || '',
        subjectIds: tutorApplication.subjectIds || [],
        experience: tutorApplication.experience || '',
        cvUrl: tutorApplication.cvUrl || '',
      });
    }
  }, [tutorApplication]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectToggle = (subjectId: string) => {
    setFormData((prev) => {
      const isSelected = prev.subjectIds.includes(subjectId);
      return isSelected 
        ? { ...prev, subjectIds: prev.subjectIds.filter(id => id !== subjectId) }
        : { ...prev, subjectIds: [...prev.subjectIds, subjectId] };
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsAvatarUploadingLocal(true);
      try {
        const url = await dispatch(uploadFile(file)).unwrap();
        setFormData((prev) => ({ ...prev, avatar: url }));
        dispatch(showToast({ type: 'success', title: t('common.toast.success'), message: t('tutors.register.avatarSuccess', 'Tải ảnh lên thành công') }));
      } catch (err) {
        dispatch(showToast({ type: 'error', title: t('common.toast.error'), message: t('tutors.register.avatarError', 'Lỗi tải ảnh') }));
      } finally {
        setIsAvatarUploadingLocal(false);
      }
    }
  };

  const handleCvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCvUploadingLocal(true);
      try {
        const url = await dispatch(uploadFile(file)).unwrap();
        setFormData((prev) => ({ ...prev, cvUrl: url }));
        dispatch(showToast({ type: 'success', title: t('common.toast.success'), message: t('tutors.register.cvSuccess', 'Tải CV thành công') }));
      } catch (err) {
        dispatch(showToast({ type: 'error', title: t('common.toast.error'), message: t('tutors.register.cvError', 'Lỗi tải CV') }));
      } finally {
        setIsCvUploadingLocal(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.introduction || !formData.experience || formData.subjectIds.length === 0) {
      dispatch(showToast({ type: "error", title: t('tutors.register.missingInfoTitle'), message: t('tutors.register.missingInfoMessage') }));
      return;
    }

    try {
      await dispatch(registerTutorProfile(formData)).unwrap();
      dispatch(showToast({ type: "success", title: t('common.toast.success'), message: t('tutors.register.successMessage') }));
      dispatch(getMyTutorApplication()); // Refresh data
      onSuccess(); // Gọi callback báo cho parent biết đã submit thành công
    } catch (error: any) {
      console.log("Error submitting tutor application:", error); // In ra để xem cấu trúc error thực tế

      // Lấy code lỗi từ API (Check cả 2 trường hợp phổ biến của Axios/Redux)
      const errorCode = error?.code || error?.response?.data?.code;

      // Xử lý riêng biệt cho lỗi 3010 (Chưa đủ 3 ngày)
      if (errorCode === 3010) {
        dispatch(showToast({ 
          type: "error", // Dùng type error hoặc warning cho nổi bật
          title: t('tutors.register.failTitle', 'Chưa thể nộp lại đơn'), 
          message: error?.message || t('tutors.register.resubmitMessage', 'Bạn chỉ có thể nộp lại đơn đăng ký sau 3 ngày kể từ lần bị từ chối trước.') 
        }));
        return; // Dừng tại đây, không chạy xuống code show lỗi mặc định bên dưới
      }

      // Xử lý các lỗi khác (500, 400 bad request chung chung...)
      const errorMessage = error?.message || error?.response?.data?.message || (typeof error === 'string' ? error : t('common.error.prefix', 'Có lỗi xảy ra'));
      dispatch(showToast({ 
        type: "error", 
        title: t('tutors.register.failTitle', 'Nộp đơn thất bại'), 
        message: errorMessage 
      }));
    }   
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-sm border border-gray-100 animate-in fade-in duration-500">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-serif tracking-tight">{t('tutors.register.title')}</h2>
        <p className="text-gray-500">{t('tutors.register.subtitle')}</p>
      </div>

      {tutorApplication?.status === 'REJECTED' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-start gap-3 text-sm">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-1">Đơn đăng ký trước đó của bạn đã bị từ chối</p>
            <p className="text-red-600 opacity-90">Lý do: {tutorApplication.rejectionReason || "Không đạt yêu cầu. Vui lòng cập nhật lại thông tin."}</p>
          </div>
        </div>
      )}

      {tutorError && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle size={18} /> {tutorError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tên hiển thị */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <User size={16} className="text-purple-600" /> {t('tutors.register.nameLabel')}
          </label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder={t('tutors.register.namePlaceholder')} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all" required />
        </div>

        {/* Ảnh đại diện */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <ImageIcon size={16} className="text-purple-600" /> {t('tutors.register.avatarLabel')}
          </label>
          <div className="flex gap-6 items-center">
            <div onClick={() => avatarInputRef.current?.click()} className="relative group w-20 h-20 shrink-0 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
              {formData.avatar ? (
                <AuthenticatedImage src={formData.avatar} alt="Preview" className="w-full h-full object-cover" onError={(e: any) => { e.currentTarget.src = "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"; }} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-purple-500">
                  <Camera size={24} /> <span className="text-[10px] font-bold mt-1">{t('tutors.register.upload')}</span>
                </div>
              )}
              {isAvatarUploadingLocal && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-purple-600 w-6 h-6" /></div>}
            </div>
            <div className="flex-grow space-y-2">
              <input type="url" name="avatar" value={formData.avatar} onChange={handleInputChange} placeholder={t('tutors.register.avatarLinkPlaceholder')} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400 outline-none text-sm" />
            </div>
            <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
          </div>
        </div>

        {/* Kinh nghiệm */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <Briefcase size={16} className="text-purple-600" /> {t('tutors.register.experienceLabel')}
          </label>
          <textarea name="experience" value={formData.experience} onChange={handleInputChange} placeholder={t('tutors.register.experiencePlaceholder')} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400 outline-none resize-none" required />
        </div>

        {/* CV Upload */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <Paperclip size={16} className="text-purple-600" /> {t('tutors.register.cvLabel')}
          </label>
          <div className="flex gap-3">
            <input type="url" name="cvUrl" value={formData.cvUrl} onChange={handleInputChange} placeholder={t('tutors.register.cvPlaceholder')} className="flex-grow px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400 outline-none" />
            <button type="button" onClick={() => cvInputRef.current?.click()} disabled={isCvUploadingLocal} className="px-4 bg-purple-50 text-purple-600 border border-purple-200 rounded-xl hover:bg-purple-100 flex items-center gap-2 font-semibold text-sm disabled:opacity-50">
              {isCvUploadingLocal ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} {t('tutors.register.upload')}
            </button>
            <input type="file" ref={cvInputRef} onChange={handleCvChange} className="hidden" accept=".pdf,.doc,.docx,image/*" />
          </div>
        </div>

        {/* Giới thiệu */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <FileText size={16} className="text-purple-600" /> {t('tutors.register.introLabel')}
          </label>
          <textarea name="introduction" value={formData.introduction} onChange={handleInputChange} placeholder={t('tutors.register.introPlaceholder')} rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400 outline-none resize-none" required />
        </div>

        {/* Môn học */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <BookOpen size={16} className="text-purple-600" /> {t('tutors.register.subjectsLabel')}
          </label>
          {loadingSubjects ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 py-2"><Loader2 className="animate-spin" size={16} /> {t('tutors.register.loadingSubjects')}</div>
          ) : (
            <div className="flex flex-wrap gap-3 max-h-48 overflow-y-auto p-1">
              {subjects.map((subject) => {
                const isSelected = formData.subjectIds.includes(subject.id);
                return (
                  <button type="button" key={subject.id} onClick={() => handleSubjectToggle(subject.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${isSelected ? 'bg-purple-600 border-purple-600 text-white shadow-md transform scale-105' : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-purple-50'}`}>
                    {subject.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-gray-100">
          <button type="submit" disabled={isTutorRegistering || formData.subjectIds.length === 0 || loadingSubjects} className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
            {isTutorRegistering ? <><Loader2 className="animate-spin" size={20} /> {t('common.processing')}</> : t('tutors.register.submitBtn')}
          </button>
        </div>
      </form>
    </div>
  );
};