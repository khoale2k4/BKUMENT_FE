'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// Import thêm icon cho Modal
import { Heart, Star, Users, PlayCircle, BookOpen, Briefcase, FileText, Calendar, CheckCircle, XCircle, FilePenLine } from 'lucide-react';
import { TutorData, approveTutorApplication, rejectTutorApplication } from '@/lib/redux/features/tutorFindingSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setPendingTargetUserId } from '@/lib/redux/features/chatSlice';

interface TutorCardProps {
  data: TutorData;
}

const TutorCard: React.FC<TutorCardProps> = ({ data }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { tutor, matchingClasses } = data;
  
  const { currentRole } = useAppSelector(state => state.auth);
  const isAdminView = currentRole === 'ADMIN' || currentRole === 'MODERATOR';

  // ==========================================
  // 1. STATE QUẢN LÝ MODAL TỪ CHỐI
  // ==========================================
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleSendMessage = () => {
    dispatch(setPendingTargetUserId(tutor.id));
    router.push('/messages');
  };

  const handleAcceptApplication = () => {
    const isConfirm = window.confirm(`Bạn có chắc chắn muốn DUYỆT hồ sơ của gia sư ${tutor.name}?`);
    if (isConfirm) {
      dispatch(approveTutorApplication(tutor.id));
    }
  }

  // ==========================================
  // 2. LOGIC XỬ LÝ TRONG MODAL
  // ==========================================
  
  // Mở modal
  const handleOpenRejectModal = () => {
    setRejectionReason(""); // Reset lý do cũ
    setShowRejectModal(true);
  }

  // Đóng modal
  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
  }

  // Xác nhận từ chối (Gọi API)
  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      alert("Vui lòng nhập lý do từ chối!");
      return;
    }
    console.log(`Rejecting tutor ${tutor.id} with reason: ${rejectionReason}`); // Debug log
    // Giả sử action rejectTutorApplication nhận vào object { id, reason }
    dispatch(rejectTutorApplication({ tutorId: tutor.id, reason: rejectionReason }));
    
    // Đóng modal sau khi dispatch
    setShowRejectModal(false);
  }

  const handleRejectButton = (reason: string) => {
    console.log("Updating rejection reason:", reason); // Debug log để kiểm tra giá trị nhập vào
    setRejectionReason(reason);
  }

  // Placeholder cho avatar
  const avatarUrl = tutor.avatar && tutor.avatar.startsWith('http') 
    ? tutor.avatar 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name || 'User')}&background=random&color=fff&bold=true`;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Đang chờ duyệt</span>;
      case 'APPROVED': return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Đã duyệt</span>;
      case 'REJECTED': return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Từ chối</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">{status}</span>;
    }
  };

  return (
    <>
      {/* --- THẺ GIA SƯ CHÍNH --- */}
      <div className="relative flex flex-col md:flex-row gap-6 p-6 bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
        
        {!isAdminView && (
          <button className="absolute top-6 right-6 text-gray-300 hover:text-pink-500 transition-colors">
            <Heart size={22} />
          </button>
        )}

        <div className="shrink-0 flex justify-center md:block">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
            <img 
              src={avatarUrl} 
              alt={tutor.name} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        <div className="flex-1 mt-2 md:mt-0">
          {isAdminView ? (
            <>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{tutor.name}</h3>
                {tutor.status && renderStatusBadge(tutor.status)}
              </div>
              
              <div className="space-y-2 mt-4 text-sm text-gray-600">
                {tutor.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span><strong>Ngày đăng ký:</strong> {new Date(tutor.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <Briefcase size={16} className="text-gray-400 mt-0.5" />
                  <span><strong>Kinh nghiệm:</strong> {tutor.experience || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-gray-400" />
                  <span><strong>CV:</strong> </span>
                  {tutor.cvUrl && tutor.cvUrl.startsWith('http') ? (
                    <a href={tutor.cvUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Xem file CV đính kèm</a>
                  ) : <span className="text-gray-400 italic">Không có CV</span>}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong>Giới thiệu:</strong> {tutor.introduction || "Không có giới thiệu."}
                </p>
              </div>
              
              {tutor.status === 'REJECTED' && tutor.rejectionReason && (
                <div className="mt-3 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  <strong>Lý do từ chối:</strong> {tutor.rejectionReason}
                </div>
              )}
            </>
          ) : (
            /* --- UI USER / TUTOR (Giữ nguyên) --- */
            <>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{tutor.name}</h3>
              <p className="text-xs text-gray-500 mb-1">Active Tutor • Verified</p>
              <div className="flex items-center gap-2 mb-4 font-bold text-sm text-gray-800">
                <BookOpen size={16} className="text-purple-600" /> 
                {matchingClasses && matchingClasses.length > 0 ? matchingClasses[0].subjectName : "Đa môn học"}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 pr-8">
                {tutor.introduction || "Gia sư này chưa cập nhật bài giới thiệu bản thân."}
              </p>
            </>
          )}
        </div>

        <div className="shrink-0 flex flex-col md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
          {isAdminView ? (
            /* NÚT BẤM CHO ADMIN */
            <div className="flex flex-col gap-2 w-full md:w-40 mt-auto">
              {tutor.status === 'PENDING' ? (
                <>
                  <button 
                    onClick={handleAcceptApplication}
                    className="w-full flex justify-center items-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-sm"
                  >
                    <CheckCircle size={18} /> Duyệt hồ sơ
                  </button>
                  <button 
                    onClick={handleOpenRejectModal} // Gọi hàm mở Modal
                    className="w-full flex justify-center items-center gap-2 py-2.5 bg-white border-2 border-red-100 hover:bg-red-50 hover:border-red-200 text-red-600 text-sm font-bold rounded-xl transition-all active:scale-95"
                  >
                    <XCircle size={18} /> Từ chối
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => alert('Xem chi tiết user: ' + tutor.id)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-sm"
                >
                  Xem chi tiết
                </button>
              )}
            </div>
          ) : (
            /* NÚT BẤM USER (Giữ nguyên) */
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <button onClick={() => router.push(`/tutors/${tutor.id}`)} className="w-full md:w-40 py-2.5 bg-[#ff6b9e] text-white text-sm font-bold rounded-xl shadow-sm">View more</button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* 3. ĐIỂM NHẤN: UI MODAL TỪ CHỐI (Hộp thoại) */}
      {/* ========================================== */}
      {showRejectModal && (
        // Lớp nền mờ tối toàn màn hình (Backdrop)
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          
          {/* Hộp thoại chính */}
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
            
            {/* Header Modal */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 text-red-600 rounded-full">
                <FilePenLine size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Lý do từ chối hồ sơ</h3>
            </div>
            
            {/* Nội dung Modal */}
            <p className="text-sm text-gray-600 mb-4">
              Vui lòng cho biết lý do bạn từ chối đơn đăng ký của gia sư <strong>{tutor.name}</strong>. Thông tin này sẽ giúp gia sư cải thiện hồ sơ lần sau.
            </p>
            
            <textarea
              value={rejectionReason}
              
              onChange={(e) => handleRejectButton(e.target.value)}
              placeholder="Ví dụ: Bằng cấp chưa phù hợp, thiếu thông tin kinh nghiệm giảng dạy..."
              rows={5}
              className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all resize-none text-sm leading-relaxed bg-gray-50 focus:bg-white"
            />
            
            {/* Footer Modal (Nút bấm) */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={handleCloseRejectModal}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-all active:scale-95"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmReject}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!rejectionReason.trim()} // Khóa nút nếu chưa nhập lý do
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TutorCard;