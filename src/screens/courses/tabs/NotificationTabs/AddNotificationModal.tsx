import React, { useState } from 'react';
import { X, Loader2, Send } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { createClassNotification } from '@/lib/redux/features/tutorCourseSlice';

interface AddNotificationModalProps {
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
}

const AddNotificationModal: React.FC<AddNotificationModalProps> = ({ courseId, isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { creatingNotification } = useAppSelector((state) => state.tutorCourse);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const result = await dispatch(
      createClassNotification({ classId: courseId, payload: { title, message } })
    );

    if (createClassNotification.fulfilled.match(result)) {
      setTitle('');
      setMessage('');
      onClose(); // Đóng modal sau khi tạo thành công (bên Slice đã unshift vào mảng rồi)
    } else {
      alert("Lỗi tạo thông báo: " + result.payload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Add Push Notification</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body Modal (Form) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Ngày mai lo đi học"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message <span className="text-red-500">*</span></label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              rows={4}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
              required
            />
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingNotification || !title.trim() || !message.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {creatingNotification ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Send Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNotificationModal;