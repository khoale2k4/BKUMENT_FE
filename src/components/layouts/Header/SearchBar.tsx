// 'use client';

// import { useState } from 'react';
// import { Search } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useTranslation } from 'react-i18next';

// export default function SearchBar() {
//     const { t } = useTranslation();
//     const [searchQuery, setSearchQuery] = useState('');
//     const router = useRouter();

//     const handleSearch = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (searchQuery.trim()) {
//             router.push(`/home?search=${encodeURIComponent(searchQuery.trim())}`);
//         }
//     };

//     return (
//         <form onSubmit={handleSearch} className="relative flex-1 max-w-2xl mx-4">
//             <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder={t('layout.header.searchPlaceholder')}
//                 className="w-full px-4 py-2 pl-10 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
//             />
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//             <button
//                 type="submit"
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-800 transition cursor-pointer"
//             >
//                 {t('common.confirm.confirm')}
//             </button>
//         </form>
//     );
// }

"use client";

import { useState } from "react";
import { Search, SendHorizonal } from "lucide-react"; // [THÊM]: Icon thay thế text trên mobile
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function SearchBar() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/home?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    // [SỬA]: Giảm mx-4 xuống mx-2, w-full
    <form
      onSubmit={handleSearch}
      className="relative flex-1 max-w-2xl mx-2 sm:mx-4 min-w-[120px]"
    >
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t("layout.header.searchPlaceholder")}
        // [SỬA]: text-sm trên mobile, giảm padding trái/phải/top/bottom để input gọn hơn
        className="w-full px-3 py-1.5 sm:px-4 sm:py-2 pl-8 sm:pl-10 text-sm sm:text-base bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
      />
      <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
      <button
        type="submit"
        // [SỬA]: Giảm padding, đổi flex center cho icon
        className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 sm:px-4 sm:py-1 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-800 transition cursor-pointer flex items-center justify-center"
      >
        {/* [SỬA]: Ẩn text trên mobile, hiện icon. Hiện text trên desktop */}
        <span className="hidden md:block">{t("common.confirm.confirm")}</span>
        <SendHorizonal className="w-3.5 h-3.5 md:hidden" />
      </button>
    </form>
  );
}
