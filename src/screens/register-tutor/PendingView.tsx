import React from 'react';
import { Clock, User, FileText } from 'lucide-react';
import { AuthenticatedImage } from '@/components/ui/AuthenticatedImage';

interface PendingViewProps {
  application: any;
}

export const PendingView: React.FC<PendingViewProps> = ({ application }) => {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-sm border border-gray-100 animate-in fade-in duration-500">
      <div className="bg-purple-50 border border-purple-200 text-purple-800 px-6 py-5 rounded-2xl mb-8 flex items-start gap-4">
        <Clock size={28} className="mt-0.5 text-purple-600" />
        <div>
          <h3 className="font-bold text-lg mb-1">Đơn đăng ký đang được xử lý</h3>
          <p className="text-purple-700 text-sm">Hệ thống đã ghi nhận đơn đăng ký của bạn và đang chờ quản trị viên phê duyệt. Quá trình này thường mất từ 1-3 ngày làm việc.</p>
        </div>
      </div>

      <h4 className="font-bold text-xl text-gray-900 border-b border-gray-100 pb-4 mb-6">Thông tin bạn đã gửi</h4>
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
           {application.avatar ? (
              <AuthenticatedImage src={application.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
           ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center"><User className="text-gray-400" /></div>
           )}
           <div>
              <h5 className="font-bold text-gray-900">{application.name}</h5>
              <p className="text-sm text-gray-500">Ứng viên Gia sư</p>
           </div>
        </div>

        <div>
          <span className="block text-sm font-bold text-gray-700 mb-2">Giới thiệu bản thân</span>
          <div className="bg-gray-50 p-4 rounded-xl text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">{application.introduction}</div>
        </div>
        
        <div>
          <span className="block text-sm font-bold text-gray-700 mb-2">Kinh nghiệm</span>
          <div className="bg-gray-50 p-4 rounded-xl text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">{application.experience}</div>
        </div>
        
        {application.cvUrl && (
          <div>
            <span className="block text-sm font-bold text-gray-700 mb-2">Hồ sơ đính kèm (CV)</span>
            <a href={application.cvUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium bg-purple-50 px-4 py-2.5 rounded-xl transition-colors text-sm">
              <FileText size={18} />
              Xem tài liệu đã tải lên
            </a>
          </div>
        )}
      </div>
    </div>
  );
};