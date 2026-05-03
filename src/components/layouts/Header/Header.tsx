"use client";

import Link from "next/link";
import { FileText, Send } from "lucide-react"; // [SỬA]: Import thêm Send
import HeaderLeft from "./HeaderLeft";
import SearchBar from "./SearchBar";
import UserDropdown from "./UserDropdown";
import NotificationDropdown from "./NotificationDropdown";
import { AppRoute } from "@/lib/appRoutes";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/lib/redux/hooks"; // [SỬA]: Import hooks của Redux

export default function Header() {
  const { t } = useTranslation();

  // [BỔ SUNG]: Lấy danh sách tin nhắn từ Redux và tính số lượng chưa đọc
  const { conversations } = useAppSelector((state) => state.chat);
  const unreadMessagesCount = conversations.filter(
    (c) => c.isRead === false,
  ).length;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16 px-2 sm:px-4 flex items-center justify-between font-sans">
      <HeaderLeft />

      <SearchBar />

      <div className="flex items-center gap-1 sm:gap-2 md:gap-6 relative shrink-0">
        <Link
          href={AppRoute.blogs.write}
          className="hidden sm:flex items-center gap-1 text-gray-500 hover:text-black text-sm"
        >
          <FileText className="w-5 h-5" strokeWidth={1.5} />
          <span>{t("layout.header.write")}</span>
        </Link>

        {/* [BỔ SUNG]: Icon Message kèm Badge số lượng chưa đọc */}
        <Link
          href={AppRoute.messages}
          className="relative p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
          title={t("layout.sidebar.messages", "Tin nhắn")}
        >
          <Send className="w-5 h-5 sm:w-5 sm:h-5" strokeWidth={1.5} />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-0 right-0 sm:top-0 sm:right-0 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white translate-x-1/4 -translate-y-1/4">
              {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
            </span>
          )}
        </Link>

        <NotificationDropdown />
        <UserDropdown />
      </div>
    </header>
  );
}
