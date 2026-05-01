"use client";

import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    console.log("Changing language to:", lng);
    i18n.changeLanguage(lng);
  };

  return (
    // [SỬA]: Giảm gap trên mobile
    <div className="flex gap-1 sm:gap-2">
      <button
        onClick={() => changeLanguage("vi")}
        // [SỬA]: Giảm padding, thu nhỏ chữ trên mobile cho gọn
        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${i18n.language === "vi" ? "bg-blue-500 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
      >
        🇻🇳 VN
      </button>
      <button
        onClick={() => changeLanguage("en")}
        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${i18n.language === "en" ? "bg-blue-500 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
