'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, Image as ImageIcon, BookOpen, FileText, Loader2, CheckCircle2, AlertCircle, Briefcase, Paperclip, Camera, Upload } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { registerTutorProfile, RegisterTutorRequest, uploadFile } from '@/lib/redux/features/profileSlice';
import { getSearchSubjects } from '@/lib/redux/features/tutorFindingSlice';
import { refreshToken } from '@/lib/redux/features/authSlice';
import { showToast } from '@/lib/redux/features/toastSlice';
import { AuthenticatedImage } from '@/components/ui/AuthenticatedImage';
const RegisterTutorForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isTutorRegistering, tutorError, isResourceUploading } = useAppSelector((state) => state.profile);
  const { subjects, loadingSubjects } = useAppSelector((state) => state.tutorFinding);

  const [formData, setFormData] = useState<RegisterTutorRequest>({
    name: '',
    introduction: '',
    avatar: '',
    subjectIds: [],
    experience: '',
    cvUrl: '',
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [isAvatarUploadingLocal, setIsAvatarUploadingLocal] = useState(false);
  const [isCvUploadingLocal, setIsCvUploadingLocal] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!subjects || subjects.length === 0) {
      dispatch(getSearchSubjects());
    }
  }, [dispatch, subjects]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectToggle = (subjectId: string) => {
    setFormData((prev) => {
      const isSelected = prev.subjectIds.includes(subjectId);
      if (isSelected) {
        return { ...prev, subjectIds: prev.subjectIds.filter(id => id !== subjectId) };
      } else {
        return { ...prev, subjectIds: [...prev.subjectIds, subjectId] };
      }
    });
  };

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsAvatarUploadingLocal(true);
      try {
        const url = await dispatch(uploadFile(file)).unwrap();
        setFormData((prev) => ({ ...prev, avatar: url }));
        dispatch(showToast({ type: 'success', title: 'Thành công', message: 'Đã tải ảnh đại diện lên!' }));
      } catch (err) {
        dispatch(showToast({ type: 'error', title: 'Lỗi', message: 'Tải ảnh đại diện thất bại' }));
      } finally {
        setIsAvatarUploadingLocal(false);
      }
    }
  };

  const handleCvClick = () => {
    cvInputRef.current?.click();
  };

  const handleCvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCvUploadingLocal(true);
      try {
        const url = await dispatch(uploadFile(file)).unwrap();
        setFormData((prev) => ({ ...prev, cvUrl: url }));
        dispatch(showToast({ type: 'success', title: 'Thành công', message: 'Đã tải CV lên!' }));
      } catch (err) {
        dispatch(showToast({ type: 'error', title: 'Lỗi', message: 'Tải CV thất bại' }));
      } finally {
        setIsCvUploadingLocal(false);
      }
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // ĐÃ CẬP NHẬT: Kiểm tra thêm trường experience nếu bạn muốn nó là bắt buộc
  //   if (!formData.name || !formData.introduction || !formData.experience || formData.subjectIds.length === 0) {
  //     alert("Vui lòng điền đầy đủ thông tin bắt buộc và chọn ít nhất 1 môn học!");
  //     return;
  //   }

  //   try {
  //     await dispatch(registerTutorProfile(formData)).unwrap();
  //     await dispatch(refreshToken()).unwrap(); 

  //     setIsSuccess(true);

  //     setTimeout(() => {
  //       router.push('/profile'); 
  //     }, 2000);

  //   } catch (error) {
  //     console.error("Đăng ký thất bại:", error);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Đã thay thế alert mặc định bằng Toast thông báo lỗi
    if (!formData.name || !formData.introduction || !formData.experience || formData.subjectIds.length === 0) {
      dispatch(showToast({
        type: "error",
        title: "Thiếu thông tin!",
        message: "Vui lòng điền đầy đủ thông tin bắt buộc và chọn ít nhất 1 môn học."
      }));
      return;
    }

    try {
      await dispatch(registerTutorProfile(formData)).unwrap();
      // await dispatch(refreshToken()).unwrap(); 

      // Bắn Toast thành công
      dispatch(showToast({
        type: "success",
        title: "Thành công!",
        message: "Đã gửi hồ sơ đăng ký gia sư thành công!"
      }));

      setIsSuccess(true);

      setTimeout(() => {
        router.push('/profile');
      }, 2000);

    } catch (error: any) {
      // Bắn Toast báo lỗi dựa trên message từ Backend trả về (nếu có)
      const errorMessage = error?.message || typeof error === 'string' ? error : "Đã có lỗi xảy ra, vui lòng thử lại sau.";

      dispatch(showToast({
        type: "error",
        title: "Đăng ký thất bại!",
        message: errorMessage
      }));

      console.error("Đăng ký thất bại:", error);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-10 bg-white rounded-3xl shadow-xl text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-green-600 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký thành công!</h2>
        <p className="text-gray-500">Chào mừng bạn gia nhập đội ngũ Gia sư. Hệ thống đang chuyển hướng...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-sm border border-gray-100 animate-in fade-in duration-500">

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-serif tracking-tight">Trở thành Gia sư</h2>
        <p className="text-gray-500">Chia sẻ kiến thức của bạn và tạo thu nhập ngay hôm nay.</p>
      </div>

      {tutorError && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle size={18} />
          {tutorError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Tên hiển thị */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <User size={16} className="text-purple-600" /> Tên hiển thị của bạn
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="VD: Gia sư Quang"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        {/* Ảnh đại diện */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <ImageIcon size={16} className="text-purple-600" /> Ảnh đại diện của bạn
          </label>
          <div className="flex gap-6 items-center">
            <div
              onClick={handleAvatarClick}
              className="relative group w-20 h-20 shrink-0 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all"
            >
              {formData.avatar ? (
                <AuthenticatedImage
                  src={formData.avatar}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.currentTarget.src = "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-purple-500">
                  <Camera size={24} />
                  <span className="text-[10px] font-bold mt-1">UPLOAD</span>
                </div>
              )}

              {/* Overlay on hover */}
              {formData.avatar && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white w-6 h-6" />
                </div>
              )}

              {/* Loading State */}
              {isAvatarUploadingLocal && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <Loader2 className="animate-spin text-purple-600 w-6 h-6" />
                </div>
              )}
            </div>

            <div className="flex-grow space-y-2">
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                placeholder="Dán link ảnh hoặc click ô bên cạnh để upload"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all text-sm"
              />
              <p className="text-[11px] text-gray-400 italic">* Khuyên dùng ảnh vuông, dung lượng dưới 2MB.</p>
            </div>

            <input
              type="file"
              ref={avatarInputRef}
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <Briefcase size={16} className="text-purple-600" /> Kinh nghiệm giảng dạy
          </label>
          <textarea
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            placeholder="VD: 3 năm kinh nghiệm dạy kèm Toán cấp 3, từng làm trợ giảng tại trung tâm..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all resize-none"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <Paperclip size={16} className="text-purple-600" /> Link CV / Chứng chỉ (Không bắt buộc)
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              name="cvUrl"
              value={formData.cvUrl}
              onChange={handleInputChange}
              placeholder="Dán link (Google Drive, Notion...) hoặc upload file"
              className="flex-grow px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all"
            />
            <button
              type="button"
              onClick={handleCvClick}
              disabled={isCvUploadingLocal}
              className="px-4 bg-purple-50 text-purple-600 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors flex items-center gap-2 font-semibold text-sm disabled:opacity-50"
            >
              {isCvUploadingLocal ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              Upload
            </button>
            <input
              type="file"
              ref={cvInputRef}
              onChange={handleCvChange}
              className="hidden"
              accept=".pdf,.doc,.docx,image/*"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <FileText size={16} className="text-purple-600" /> Giới thiệu bản thân
          </label>
          <textarea
            name="introduction"
            value={formData.introduction}
            onChange={handleInputChange}
            placeholder="Hãy viết vài dòng giới thiệu về phương pháp giảng dạy, tính cách của bạn..."
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all resize-none"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <BookOpen size={16} className="text-purple-600" /> Các môn học bạn có thể dạy
          </label>

          {loadingSubjects ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
              <Loader2 className="animate-spin" size={16} /> Đang tải danh sách môn học...
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 max-h-48 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-gray-200">
              {subjects.map((subject) => {
                const isSelected = formData.subjectIds.includes(subject.id);
                return (
                  <button
                    type="button"
                    key={subject.id}
                    onClick={() => handleSubjectToggle(subject.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${isSelected
                        ? 'bg-purple-600 border-purple-600 text-white shadow-md transform scale-105'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                  >
                    {subject.name}
                  </button>
                );
              })}
            </div>
          )}

          {formData.subjectIds.length === 0 && !loadingSubjects && (
            <p className="text-xs text-red-500 mt-2">* Vui lòng chọn ít nhất 1 môn học.</p>
          )}
        </div>

        <div className="pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={isTutorRegistering || formData.subjectIds.length === 0 || loadingSubjects}
            className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isTutorRegistering ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Đang xử lý...
              </>
            ) : (
              'Hoàn tất Đăng ký'
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default RegisterTutorForm;