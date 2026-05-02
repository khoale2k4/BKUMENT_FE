"use client";
import {
  Home,
  BookOpen,
  User,
  BarChart2,
  X,
  NotebookText,
  FileText,
  Send,
  UserSearch,
  Bell,
  PenSquare,
  Users,
  Book,
  File,
  UploadCloud,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { closeSidebar } from "@/lib/redux/features/layoutSlide";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AppRoute } from "@/lib/appRoutes";
import { useEffect, useRef } from "react";

export default function Sidebar() {
  const { t } = useTranslation();
  const { isSidebarOpen } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);

  const {
    data: notifications = [],
    loading,
    unreadCount,
  } = useAppSelector((state) => state.modal.appNotifications) || {};
  const { conversations } = useAppSelector((state) => state.chat);
  const unreadMessagesCount = conversations.filter(
    (c) => c.isRead === false,
  ).length;

  const mainMenuItems = [
    {
      icon: Home,
      label: t("layout.sidebar.home"),
      href: AppRoute.home,
      count: 0,
    },
    // {
    //   icon: Book,
    //   label: t("layout.sidebar.library"),
    //   href: AppRoute.library,
    //   count: 0,
    // },
    {
      icon: User,
      label: t("layout.sidebar.profile"),
      href: AppRoute.profile,
      count: 0,
    },
    {
      icon: NotebookText,
      label: t("layout.sidebar.findTutors"),
      href: AppRoute.tutors,
      count: 0,
    },
    {
      icon: FileText,
      label: t("layout.sidebar.myBlog"),
      href: AppRoute.blogs.my,
      count: 0,
    },
    {
      icon: File,
      label: t("layout.sidebar.myDocuments"),
      href: AppRoute.documents.my,
      count: 0,
    },
    {
      icon: Send,
      label: t("layout.sidebar.messages"),
      href: AppRoute.messages,
      count: unreadMessagesCount,
    },
    {
      icon: Bell,
      label: t("layout.sidebar.notifications"),
      href: AppRoute.notifications,
      count: unreadCount,
    },
  ];

  const secondaryMenuItems = [
    {
      icon: PenSquare,
      label: t("layout.sidebar.writeBlog"),
      href: AppRoute.blogs.write,
      count: 0,
    },
    // {
    //   icon: Users,
    //   label: t("layout.sidebar.following"),
    //   href: "/following",
    //   count: 2,
    // },
  ];

  const renderMenuItem = (item: any, idx: number) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={idx}
        href={item.href}
        // [SỬA]: Thêm mt-1 để các menu item thoáng hơn
        className={clsx(
          "relative flex items-center space-x-4 p-2 rounded-lg transition group mt-1",
          "text-[#757575] hover:text-black hover:bg-gray-50 font-medium whitespace-nowrap",
        )}
        onClick={() => {
          if (window.innerWidth < 768) dispatch(closeSidebar());
        }} // Đóng khi chọn item trên mobile
      >
        <div className="relative shrink-0">
          <item.icon
            size={22}
            strokeWidth={isActive ? 2.5 : 2}
            className={clsx(
              isActive
                ? "text-[#292929]"
                : "text-[#757575] group-hover:text-[#292929]",
            )}
          />
          {item.count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full border border-white">
              {item.count}
            </span>
          )}
        </div>
        <span
          className={clsx(
            isActive ? "text-[#292929]" : "text-[#757575]",
            " text-[15px] group-hover:text-[#292929]",
          )}
        >
          {item.label}
        </span>
      </Link>
    );
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        if (window.innerWidth >= 768) dispatch(closeSidebar());
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen, dispatch]);

  return (
    <>
      {isSidebarOpen && (
        <div
          // [SỬA]: z-index Overlay lên 60 để bao trùm cả Header (z-50)
          className="fixed inset-0 bg-black/50 z-[60] md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => dispatch(closeSidebar())}
        />
      )}

      <aside
        ref={sidebarRef}
        className={clsx(
          // [SỬA]: z-index Sidebar mobile lên 70. Đổi h-[calc...] thành h-full trên mobile để phủ hết cạnh trái.
          "fixed md:sticky top-0 md:top-16 left-0 z-[70] md:z-40 h-full md:h-[calc(100vh-64px)] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-y-auto custom-scrollbar overflow-hidden shadow-2xl md:shadow-none",
          isSidebarOpen
            ? "translate-x-0 w-64 mr-0 sm:mr-6 md:mr-8"
            : "-translate-x-full md:translate-x-0 md:w-0 md:border-none md:mr-0",
        )}
      >
        <div className="p-4 pb-20 space-y-1 w-64">
          <div className="flex justify-between items-center md:hidden mb-4 pb-2 border-b border-gray-100">
            <span className="font-bold text-gray-800 ml-2">Menu</span>
            <button
              onClick={() => dispatch(closeSidebar())}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mb-6 px-1 mt-2 md:mt-0">
            <Link
              href={AppRoute.documents.upload}
              className="flex items-center justify-center gap-2 w-full bg-[#292929] text-white py-2.5 rounded-full font-medium text-[15px] hover:bg-black transition shadow-sm hover:shadow-md whitespace-nowrap"
            >
              <UploadCloud size={18} className="shrink-0" />
              <span>{t("layout.sidebar.uploadDocument")}</span>
            </Link>
          </div>

          {mainMenuItems.map(renderMenuItem)}
          <hr className="my-4 border-gray-100 mx-2" />
          {secondaryMenuItems.map(renderMenuItem)}
        </div>
      </aside>
    </>
  );
}
