"use client";

import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    console.log('Changing language to:', lng); // Debug log
    i18n.changeLanguage(lng);
    // Tự động lưu vào localStorage để lần sau vào web vẫn nhớ ngôn ngữ đó
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => changeLanguage('vi')}
        className={`px-3 py-1 rounded-md ${i18n.language === 'vi' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        🇻🇳 VN
      </button>
      <button 
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded-md ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;