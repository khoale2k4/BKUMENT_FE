'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// ĐÃ THÊM: Briefcase, Paperclip cho 2 field mới
import { User, Image as ImageIcon, BookOpen, FileText, Loader2, CheckCircle2, AlertCircle, Briefcase, Paperclip } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { registerTutorProfile, RegisterTutorRequest } from '@/lib/redux/features/profileSlice';
import { getSearchSubjects } from '@/lib/redux/features/tutorFindingSlice';
import { refreshToken } from '@/lib/redux/features/authSlice';
import { showToast } from '@/lib/redux/features/toastSlice'; // Thay đổi đường dẫn nếu cần
const RegisterTutorForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { isTutorRegistering, tutorError } = useAppSelector((state) => state.profile);
  const { subjects, loadingSubjects } = useAppSelector((state) => state.tutorFinding);

  const [formData, setFormData] = useState<RegisterTutorRequest>({
    name: '',
    introduction: '',
    avatar: '',
    subjectIds: [],
    experience: '', // Mới thêm
    cvUrl: '',      // Mới thêm
  });
  
  const [isSuccess, setIsSuccess] = useState(false);

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
            <ImageIcon size={16} className="text-purple-600" /> Link ảnh đại diện (URL)
          </label>
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 shrink-0 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-full h-full p-3 text-gray-300" />
              )}
            </div>
            <input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleInputChange}
              placeholder="https://example.com/avatar.jpg"
              className="flex-grow px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* --- FIELD MỚI: Kinh nghiệm --- */}
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

        {/* --- FIELD MỚI: Link CV --- */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <Paperclip size={16} className="text-purple-600" /> Link CV (Không bắt buộc)
          </label>
          <input
            type="url"
            name="cvUrl"
            value={formData.cvUrl}
            onChange={handleInputChange}
            placeholder="Link Google Drive hoặc web CV của bạn (VD: TopCV, Notion)..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Bài giới thiệu */}
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

        {/* Chọn môn học (Multi Select từ API) */}
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
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                      isSelected 
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

        {/* Nút Submit */}
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