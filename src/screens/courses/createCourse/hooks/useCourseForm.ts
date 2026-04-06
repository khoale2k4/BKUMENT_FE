import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { createClass, updateClass, getMySubjects, uploadCoverImage } from '@/lib/redux/features/tutorCourseSlice';

// Thêm Interface để nhận Props (Dùng cho Update)
interface UseCourseFormProps {
  initialData?: any; // Dữ liệu của khóa học nếu đang ở chế độ Edit
  classId?: string;  // ID của khóa học nếu đang Edit
}

export const useCourseForm = ({ initialData, classId }: UseCourseFormProps = {}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { submitting, subjects, loading, isCoverUploading } = useAppSelector((state) => state.tutorCourse);
    const isEditMode = !!classId;

  // 1. Khởi tạo Form: Nếu có initialData (chế độ Edit) thì lấy data cũ, nếu không thì rỗng
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    coverImageUrl: initialData?.coverImageUrl || '',
    topicId: initialData?.topicId || '',
    schedules: initialData?.schedules?.length > 0 
      ? initialData.schedules 
      : [{ dayOfWeek: 'MONDAY', startTime: '18:00:00', endTime: '20:00:00' }]
  });

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  // 2. Fetch Subjects khi mount
  useEffect(() => {
    dispatch(getMySubjects());
  }, [dispatch]);

  // 3. Logic tự động map SubjectId từ TopicId (Dành riêng cho Edit Mode)
  // Khi load dữ liệu cũ lên, chúng ta chỉ có topicId, cần tìm xem topic đó thuộc môn nào để dropdown Subject hiển thị đúng.
  useEffect(() => {
    if (isEditMode && subjects.length > 0 && formData.topicId && !selectedSubjectId) {
      const foundSubject = subjects.find(s => 
        s.topics.some(t => t.id === formData.topicId)
      );
      if (foundSubject) {
        setSelectedSubjectId(foundSubject.id);
      }
    }
  }, [isEditMode, subjects, formData.topicId, selectedSubjectId]);

  // 4. Compute Available Topics
  const availableTopics = useMemo(() => {
    if (!selectedSubjectId) return [];
    const subject = subjects.find((s) => s.id === selectedSubjectId);
    return subject ? subject.topics : [];
  }, [selectedSubjectId, subjects]);

  // --- Handlers ---
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    handleInputChange('topicId', ''); // Đổi môn học thì reset luôn chủ đề
  };

  const handleAddSchedule = () => {
    setFormData((prev) => ({
      ...prev,
      schedules: [...prev.schedules, { dayOfWeek: 'MONDAY', startTime: '00:00:00', endTime: '00:00:00' }]
    }));
  };

  const handleRemoveSchedule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((_ : any, i: number) => i !== index)
    }));
  };

  const handleUpdateSchedule = (index: number, field: string, value: string) => {
    const newSchedules = [...formData.schedules];
    // Auto-format time to HH:MM:SS
    const formattedValue = (field === 'startTime' || field === 'endTime') && value.length === 5 
      ? `${value}:00` 
      : value;
    
    newSchedules[index] = { ...newSchedules[index], [field]: formattedValue };
    setFormData((prev) => ({ ...prev, schedules: newSchedules }));
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await dispatch(uploadCoverImage(file)).unwrap();
        setFormData((prev) => ({ ...prev, coverImageUrl: url }));
      } catch (err) {
        console.error('Failed to upload cover image', err);
      }
    }
  };

  // 5. Hàm Submit xử lý song song cả Create và Update
  const handleSubmit = async () => {
    if (!formData.name || !formData.topicId) {
      alert("Vui lòng điền tên lớp học và chọn chủ đề.");
      return;
    }

    let resultAction;

    // Phân nhánh logic dựa vào isEditMode
    if (isEditMode) {
      resultAction = await dispatch(updateClass({ classId, courseData: formData }));
    } else {
      resultAction = await dispatch(createClass(formData));
    }

    // Kiểm tra kết quả
    if (createClass.fulfilled.match(resultAction) || updateClass.fulfilled.match(resultAction)) {
      alert(isEditMode ? 'Cập nhật lớp học thành công!' : 'Tạo lớp học thành công!');
      router.push('/profile');
    } else {
      alert('Lỗi: ' + resultAction.payload);
    }
  };

  return {
    formData,
    loading,
    submitting,
    subjects,
    availableTopics,
    selectedSubjectId,
    isEditMode,
    handleInputChange,
    handleSubjectChange,
    handleAddSchedule,
    handleRemoveSchedule,
    handleUpdateSchedule,
    handleCoverImageChange,
    handleSubmit,
    router,
    isCoverUploading
  };
};
