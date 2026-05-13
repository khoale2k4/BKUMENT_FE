import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface SuccessViewProps {
  isApproved: boolean;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ isApproved }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-xl mx-auto mt-20 p-10 bg-white rounded-3xl shadow-xl text-center animate-in zoom-in duration-500">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="text-green-600 w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {isApproved ? "Bạn đã là Gia sư!" : t('tutors.register.successTitle', 'Gửi đơn thành công!')}
      </h2>
      <p className="text-gray-500 mb-6">
        {isApproved 
          ? "Bạn có thể chuyển đổi sang vai trò Gia sư ở menu góc phải phía trên." 
          : t('tutors.register.redirecting', 'Chúng tôi sẽ xét duyệt đơn của bạn sớm nhất có thể.')}
      </p>
      <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors">
        Trở về trang chủ
      </Link>
    </div>
  );
};