// HomeTab.tsx
import { Home } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Thay đổi import tùy theo thư viện i18n bạn đang dùng

const HomeTab = () => {
  const { t } = useTranslation(); // Khởi tạo hàm t()

  return (
    <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200 animate-in fade-in">
      <Home size={48} className="mx-auto text-gray-300 mb-4" />
      <h3 className="text-lg font-bold text-gray-600">{t('profile.user.home.dashboardOverview')}</h3>
      <p className="text-gray-400 mt-2">{t('profile.user.home.overviewDescription')}</p>
    </div>
  );
};

export default HomeTab;