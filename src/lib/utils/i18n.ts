import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import các file JSON từ điển vừa tạo
import viTranslation from '../../locales/vi.json';
import enTranslation from '../../locales/en.json';

i18n
  // Phát hiện ngôn ngữ trình duyệt tự động
  .use(LanguageDetector)
  // Kết nối với React
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      vi: { translation: viTranslation }
    },
    fallbackLng: 'vi', // Nếu không tìm thấy ngôn ngữ, mặc định dùng Tiếng Việt
    interpolation: {
      escapeValue: false // React đã tự động chống XSS rồi
    }
  });

export default i18n;