"use client";
import Link from "next/link";
import { FileText } from "lucide-react";
import HeaderLeft from "./HeaderLeft";
import SearchBar from "./SearchBar";
import UserDropdown from "./UserDropdown";
import NotificationDropdown from "./NotificationDropdown";
import { AppRoute } from "@/lib/appRoutes";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16 px-4 flex items-center justify-between font-sans">
      <HeaderLeft />
      
      <SearchBar />

      <div className="flex items-center gap-2 md:gap-6 relative">
        <Link
          href={AppRoute.blogs.write}
          className="hidden sm:flex items-center gap-1 text-gray-500 hover:text-black text-sm"
        >
          <FileText className="w-5 h-5" strokeWidth={1.5} />
          <span>{t('layout.header.write')}</span>
        </Link>

        {/* Gọi Component Dropdown ở đây */}
        <NotificationDropdown />

        <UserDropdown />
      </div>
    </header>
  );
}