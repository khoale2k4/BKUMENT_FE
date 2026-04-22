import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TutorData } from '@/lib/redux/features/tutorFindingSlice';
import TutorCard from './TutorCard'

interface TutorListProps {
  tutors: TutorData[];
  loading: boolean;
  error: string | null;
}

const TutorList: React.FC<TutorListProps> = ({ tutors, loading, error }) => {
  const { t } = useTranslation();
  
  // 1. Trạng thái Đang tải
  if (loading && tutors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-purple-600">
        <Loader2 size={40} className="animate-spin mb-4" />
        <p className="font-medium">{t('tutors.list.loading')}</p>
      </div>
    );
  }

  // 2. Trạng thái Báo lỗi
  if (error) {
    return (
      <div className="p-4 mb-6 text-red-600 bg-red-50 border border-red-200 rounded-xl text-center font-medium">
        {t('common.error.prefix')}{error}
      </div>
    );
  }

  // 3. Trạng thái Trống (Không có kết quả)
  if (!loading && tutors.length === 0 && !error) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 text-gray-500">
        <p className="text-lg font-bold mb-2 text-gray-700">{t('tutors.list.notFound')}</p>
        <p>{t('tutors.list.filterHint')}</p>
      </div>
    );
  }

  // 4. Trạng thái Có dữ liệu
  return (
    <div className="space-y-6">
      {tutors.map((data, index) => (
        <TutorCard key={data.tutor.id || index} data={data} />
  
      ))}
    </div>
  );
};

export default TutorList;