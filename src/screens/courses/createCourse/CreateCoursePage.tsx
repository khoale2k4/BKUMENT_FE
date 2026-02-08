'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { createClass } from '@/lib/redux/features/tutorCourseSlice';

// 1. Mock Data chuẩn dựa trên ảnh database bạn cung cấp
const MOCK_TOPICS = [
  // Nhóm môn Cơ sở dữ liệu (INT1005)
  { id: "3c46a94f-d8ae-4606-a380-9574b7cec880", name: "Mô hình thực thể kết hợp (ERD)", subjectId: "INT1005" },
  { id: "2e7c6837-15ec-4864-bbf4-447c242acf8d", name: "Ngôn ngữ truy vấn SQL", subjectId: "INT1005" },
  { id: "a30de17e-d653-4094-818b-cdf438c07565", name: "Chuẩn hóa dữ liệu", subjectId: "INT1005" },
  
  // Nhóm môn Trí tuệ nhân tạo (AI1014)
  { id: "af00e66c-d0e8-404c-8e18-699c72d11aa1", name: "Các thuật toán tìm kiếm (Search Algorithms)", subjectId: "AI1014" },
  { id: "cc929469-37f0-4f03-ba1f-3c375baf80d2", name: "Mạng nơ-ron nhân tạo", subjectId: "AI1014" },
  { id: "4602a955-5262-4a29-a1e1-e0bddcbe9988", name: "Học máy (Machine Learning) cơ bản", subjectId: "AI1014" },

  // Nhóm môn Web (WEB1011)
  { id: "0a523c71-9568-4f4e-9e8d-54d809b0c001", name: "CSS3 và Responsive Design", subjectId: "WEB1011" },
  { id: "2a414da5-fc4a-4916-a79a-5449c403b002", name: "JavaScript ES6+ và DOM", subjectId: "WEB1011" },
  
  // Nhóm An toàn thông tin (SEC1015)
  { id: "06cde5de-1174-41ec-92b7-95973726003", name: "Các lỗ hổng web phổ biến (OWASP)", subjectId: "SEC1015" }
];

const CreateCoursePage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { submitting } = useAppSelector((state) => state.tutorCourse);

  // Khởi tạo State (Mặc định chọn topic đầu tiên hoặc để rỗng)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    topicId: MOCK_TOPICS[0].id, // Mặc định chọn bài ERD
    schedules: [
      { dayOfWeek: 'MONDAY', startTime: '18:00:00', endTime: '20:00:00' }
    ]
  });

  // --- Các hàm xử lý (Logic giữ nguyên) ---
  const addSchedule = () => {
    setFormData({
      ...formData,
      schedules: [...formData.schedules, { dayOfWeek: 'MONDAY', startTime: '00:00:00', endTime: '00:00:00' }]
    });
  };

  const removeSchedule = (index: number) => {
    const newSchedules = formData.schedules.filter((_, i) => i !== index);
    setFormData({ ...formData, schedules: newSchedules });
  };

  const updateSchedule = (index: number, field: string, value: string) => {
    const newSchedules = [...formData.schedules];
    const formattedValue = (field === 'startTime' || field === 'endTime') && value.length === 5 ? `${value}:00` : value;
    newSchedules[index] = { ...newSchedules[index], [field]: formattedValue };
    setFormData({ ...formData, schedules: newSchedules });
  };

  const handleSubmit = async () => {
    // Validation cơ bản
    if (!formData.name || !formData.topicId) {
        alert("Vui lòng điền tên lớp học và chọn chủ đề.");
        return;
    }

    const resultAction = await dispatch(createClass(formData));
    if (createClass.fulfilled.match(resultAction)) {
      alert('Tạo lớp học thành công!');
      router.push('/profile');
    } else {
      alert('Lỗi: ' + resultAction.payload);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-10 bg-white min-h-screen font-sans">
      <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-gray-500 hover:text-black font-medium">
        <ChevronLeft size={20} /> Back to Profile
      </button>

      <div className="space-y-8">
        {/* Course Name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Course Name</label>
          <input 
            type="text" 
            placeholder="Ví dụ: Lớp thực hành ERD căn bản"
            className="w-full p-3 border border-gray-200 rounded-md outline-none focus:border-orange-500"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        {/* Start & End Date */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
            <input type="date" className="w-full p-3 border border-gray-200 rounded-md"
              value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
            <input type="date" className="w-full p-3 border border-gray-200 rounded-md"
              value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
          </div>
        </div>

        {/* --- PHẦN CHỈNH SỬA: TOPIC DROPDOWN --- */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Course Topic</label>
          <div className="relative">
            <select
                className="w-full p-3 border border-gray-200 rounded-md outline-none bg-white appearance-none focus:border-orange-500"
                value={formData.topicId}
                onChange={(e) => setFormData({...formData, topicId: e.target.value})}
            >
                <option value="" disabled>-- Select a Topic --</option>
                {/* Render Group theo Subject ID nếu muốn, hoặc flat list */}
                {MOCK_TOPICS.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                        [{topic.subjectId}] {topic.name}
                    </option>
                ))}
            </select>
            {/* Custom arrow icon cho đẹp */}
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">Chọn chủ đề môn học bạn muốn giảng dạy.</p>
        </div>
        {/* --------------------------------------- */}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
          <textarea className="w-full p-3 border border-gray-200 rounded-md min-h-[100px]"
            placeholder="Mô tả chi tiết về lớp học..."
            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        </div>

        {/* Quản lý Schedules */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-bold text-gray-700">Class Schedules</label>
            <button onClick={addSchedule} className="flex items-center gap-1 text-sm text-blue-600 font-bold hover:underline">
              <Plus size={16} /> Add Schedule
            </button>
          </div>
          
          {formData.schedules.map((sched, index) => (
            <div key={index} className="flex items-end gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Day</label>
                <select 
                  className="w-full p-2 bg-white border border-gray-200 rounded-md mt-1"
                  value={sched.dayOfWeek}
                  onChange={(e) => updateSchedule(index, 'dayOfWeek', e.target.value)}
                >
                  {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Start Time</label>
                <input type="time" className="w-full p-2 bg-white border border-gray-200 rounded-md mt-1"
                  onChange={(e) => updateSchedule(index, 'startTime', e.target.value)} />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase">End Time</label>
                <input type="time" className="w-full p-2 bg-white border border-gray-200 rounded-md mt-1"
                  onChange={(e) => updateSchedule(index, 'endTime', e.target.value)} />
              </div>
              <button onClick={() => removeSchedule(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 flex justify-end">
        <button 
          disabled={submitting}
          className={`px-10 py-3 bg-[#FF6636] text-white font-bold rounded-sm transition-all ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e55b30]'}`}
          onClick={handleSubmit}
        >
          {submitting ? 'Creating...' : 'Save & Next'}
        </button>
      </div>
    </div>
  );
};

export default CreateCoursePage;