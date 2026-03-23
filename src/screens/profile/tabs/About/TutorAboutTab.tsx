'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Star, ShieldCheck, Loader2, BookOpen, CheckCircle2, Save, Edit3, Camera } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

// Các Actions từ Redux
import { getMyTutorProfile, updateTutorProfile, UpdateTutorRequest, uploadAvatar } from '@/lib/redux/features/profileSlice';
import { getMySubjects } from '@/lib/redux/features/tutorCourseSlice';
import { getSearchSubjects } from '@/lib/redux/features/tutorFindingSlice';

import ProfileField from './ProfileField';
import { AuthenticatedImage } from '@/components/ui/AuthenticatedImage';

const TutorAboutTab = () => {
  const dispatch = useAppDispatch();

  // 1. Lấy dữ liệu từ Redux
  const { tutor, isTutorLoading, isAvatarUploading } = useAppSelector((state) => state.profile);
  // Danh sách môn học GIA SƯ ĐANG DẠY
  const { subjects: mySubjects, loading: mySubjectsLoading } = useAppSelector((state) => state.tutorCourse);
  // Danh sách TẤT CẢ môn học có trong hệ thống (Dùng để hiển thị lúc Edit)
  const { subjects: allSubjects, loadingSubjects: allSubjectsLoading } = useAppSelector((state) => state.tutorFinding);

  // 2. Local State quản lý Edit Form
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateTutorRequest>({
    name: '',
    introduction: '',
    avatar: '',
    subjectIds: []
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await dispatch(uploadAvatar(file)).unwrap();
        setFormData((prev) => ({ ...prev, avatar: url }));
      } catch (err) {
        console.error('Failed to upload avatar', err);
      }
    }
  };

  // 3. Khởi tạo dữ liệu khi mount
  useEffect(() => {
    if (!tutor) dispatch(getMyTutorProfile());
    if (!mySubjects || mySubjects.length === 0) dispatch(getMySubjects());
    if (!allSubjects || allSubjects.length === 0) dispatch(getSearchSubjects());
  }, [dispatch, tutor, mySubjects?.length, allSubjects?.length]);

  // 4. Đồng bộ dữ liệu gốc vào formData mỗi khi bật chế độ Edit
  useEffect(() => {
    if (tutor && mySubjects) {
      // Trường hợp API trả về thẳng mảng, hoặc object phân trang chứa thuộc tính .data hoặc .content
      const subjectsArray = Array.isArray(mySubjects) ? mySubjects : (mySubjects as any)?.data || (mySubjects as any)?.content || [];

      setFormData({
        name: tutor.name || '',
        introduction: tutor.introduction || '',
        avatar: tutor.avatar || '',
        subjectIds: subjectsArray.map((sub: any) => sub.id) // Trích xuất mảng các ID môn học hiện tại an toàn
      });
    }
  }, [tutor, mySubjects, isEditing]);

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectToggle = (subjectId: string) => {
    setFormData((prev) => {
      if (prev.subjectIds.includes(subjectId)) {
        return { ...prev, subjectIds: prev.subjectIds.filter(id => id !== subjectId) };
      } else {
        return { ...prev, subjectIds: [...prev.subjectIds, subjectId] };
      }
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.introduction || formData.subjectIds.length === 0) {
      alert("Vui lòng nhập tên, lời giới thiệu và chọn ít nhất 1 môn học.");
      return;
    }

    try {
      setIsSaving(true);
      // Gọi API Cập nhật
      await dispatch(updateTutorProfile(formData)).unwrap();

      // Gọi lại API lấy danh sách môn học để UI cập nhật lại tên và Topics mới
      await dispatch(getMySubjects()).unwrap();

      setIsEditing(false);
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      alert("Đã xảy ra lỗi khi cập nhật.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Form data sẽ tự động reset về giá trị cũ nhờ useEffect phía trên
  };

  // --- Loading State ---
  if (isTutorLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-purple-600" size={32} /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-700 font-sans pb-20">

      {/* --- Action Bar (Edit / Save / Cancel) --- */}
      <div className="flex justify-end mb-8 h-10 items-center mt-6">
        {isEditing ? (
          <div className="flex gap-3 animate-in slide-in-from-right-5 fade-in">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-black transition-colors rounded-full"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-[#1a8917] hover:bg-[#156d12] text-white text-sm font-medium rounded-full transition-all shadow-sm active:scale-95 disabled:opacity-70"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="group flex items-center gap-2 text-gray-400 hover:text-[#1a8917] transition-colors"
          >
            <span className="text-sm font-medium group-hover:underline">Edit Profile</span>
            <Edit3 size={18} />
          </button>
        )}
      </div>

      {/* --- Profile Header Section --- */}
      <div className="flex flex-col md:flex-row items-start gap-10 mb-12 border-b border-gray-100 pb-12">
        {/* Avatar Area */}
        <div className="relative group shrink-0 mx-auto md:mx-0 flex flex-col items-center">
          <div
            onClick={handleAvatarClick}
            className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-purple-100 shadow-xl bg-gray-100 relative ${isEditing ? 'cursor-pointer hover:border-purple-500 transition-colors' : ''
              }`}
          >
            {(isEditing ? formData.avatar : tutor?.avatar) ? (
              <AuthenticatedImage
                src={(isEditing ? formData.avatar : tutor?.avatar) as string}
                alt="Tutor Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={`https://ui-avatars.com/api/?name=${isEditing ? formData.name || 'Tutor' : tutor?.name || 'Tutor'}&background=6b21a8&color=fff`}
                alt="Tutor Avatar"
                className="w-full h-full object-cover"
              />
            )}

            {isEditing && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm pointer-events-none">
                <Camera className="text-white" size={24} />
              </div>
            )}

            {isAvatarUploading && (
              <div className="absolute inset-0 bg-white/70 rounded-full flex items-center justify-center pointer-events-none">
                <Loader2 className="animate-spin text-purple-600 w-8 h-8" />
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        {/* Name & Bio Area */}
        <div className="flex-grow w-full text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            {!isEditing ? (
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif tracking-tight">
                {tutor?.name || 'Tutor Name'}
              </h2>
            ) : (
              <div className="w-full max-w-sm">
                <ProfileField
                  label="Display Name"
                  name="name"
                  value={formData.name}
                  isEditing={true}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {tutor?.status === 'ACTIVE' && !isEditing && (
              <ShieldCheck className="text-green-500 mt-2" size={28} />
            )}
          </div>

          <p className="text-sm font-bold text-purple-600 tracking-widest uppercase mb-6 mt-2">Verified Professional Tutor</p>

          <div className="prose prose-lg">
            <ProfileField
              label="Introduction"
              name="introduction"
              value={isEditing ? formData.introduction : tutor?.introduction}
              isEditing={isEditing}
              onChange={handleInputChange}
              type="textarea"
            />
          </div>
        </div>
      </div>

      {/* --- Tutor Stats Section (Chỉ hiện khi KHÔNG edit) --- */}
      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 bg-purple-50 p-8 rounded-3xl mb-12">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Average Rating
            </label>
            <div className="flex items-center gap-2 text-3xl font-bold text-gray-900">
              <Star className="text-orange-400 fill-orange-400" size={32} />
              {tutor?.averageRating || "0.0"} <span className="text-sm text-gray-500 font-normal">/ 5.0</span>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Total Reviews
            </label>
            <div className="text-3xl font-bold text-gray-900">
              {tutor?.ratingCount || 0} <span className="text-sm text-gray-500 font-normal">students</span>
            </div>
          </div>
        </div>
      )}

      {/* --- Subjects & Expertise Section --- */}
      <div className={isEditing ? "bg-gray-50 p-8 rounded-3xl border border-gray-100" : ""}>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif tracking-tight flex items-center gap-2">
          <BookOpen className="text-purple-600" size={24} />
          {isEditing ? "Edit Your Subjects" : "Subjects & Expertise"}
        </h3>

        {/* CHẾ ĐỘ CHỈNH SỬA MÔN HỌC */}
        {isEditing ? (
          <div>
            {allSubjectsLoading ? (
              <p className="text-sm text-gray-500"><Loader2 className="animate-spin inline mr-2" size={16} /> Đang tải toàn bộ môn học...</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {(Array.isArray(allSubjects) ? allSubjects : (allSubjects as any)?.data || (allSubjects as any)?.content || []).map((subject: any) => {
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
            {formData.subjectIds.length === 0 && (
              <p className="text-xs text-red-500 mt-3">* Cần chọn ít nhất 1 môn học để giảng dạy.</p>
            )}
          </div>

        ) : (
          /* CHẾ ĐỘ XEM MÔN HỌC (Như cũ) */
          <>
            {mySubjectsLoading ? (
              <div className="flex items-center py-10 text-gray-500">
                <Loader2 className="animate-spin mr-2" size={20} /> Đang tải danh sách môn học...
              </div>
            ) : mySubjects && mySubjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mySubjects.map((subject) => (
                  <div key={subject.id} className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-start gap-2">
                      <CheckCircle2 className="text-green-500 mt-1 shrink-0" size={18} />
                      <span>{subject.name} <span className="text-xs text-gray-400 font-normal ml-1">({subject.id})</span></span>
                    </h4>
                    {subject.topics && subject.topics.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pl-6">
                        {subject.topics.map((topic) => (
                          <span key={topic.id} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-100">
                            {topic.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic pl-6">Chưa có chủ đề cụ thể.</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-500">
                Gia sư này chưa cập nhật môn học nào.
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default TutorAboutTab;