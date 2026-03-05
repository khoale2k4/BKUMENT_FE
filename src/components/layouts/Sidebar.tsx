'use client';
import {
    Home, BookOpen, User, BarChart2, X,
    NotebookText, FileText, Send, UserSearch, Bell,
    PenSquare, Users, Book, File, UploadCloud
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { closeSidebar } from '@/lib/redux/features/layoutSlide';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AppRoute } from '@/lib/appRoutes';
import { useEffect, useRef } from 'react';

export default function Sidebar() {
    const { isSidebarOpen } = useAppSelector((state) => state.ui);
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const sidebarRef = useRef<HTMLElement>(null);

    const mainMenuItems = [
        { icon: Home, label: 'Home', href: AppRoute.home, count: 0 },
        { icon: Book, label: 'Library', href: AppRoute.library, count: 0 },
        { icon: User, label: 'Profile', href: AppRoute.profile, count: 0 },
        { icon: NotebookText, label: 'My Courses', href: AppRoute.courses, count: 0 },
        { icon: FileText, label: 'My Blog', href: AppRoute.blogs.my, count: 0 },
        { icon: File, label: 'My Documents', href: AppRoute.documents.my, count: 0 },
        { icon: Send, label: 'Messages', href: AppRoute.messages, count: 2 },
        // { icon: UserSearch, label: 'Find Tutors', href: AppRoute.tutors, count: 0 },
        { icon: Bell, label: 'Notifications', href: AppRoute.notifications, count: 2 },
    ];

    const secondaryMenuItems = [
        { icon: PenSquare, label: 'Write Blog', href: AppRoute.blogs.write, count: 0 },
        { icon: Users, label: 'Following', href: '/following', count: 2 },
        // { icon: Users, label: 'My Groups', href: '/groups', count: 0 },
    ];

    const renderMenuItem = (item: any, idx: number) => {
        const isActive = pathname === item.href;
        return (
            <Link
                key={idx}
                href={item.href}
                className={clsx(
                    "relative flex items-center space-x-4 p-2 rounded-lg transition group",
                    "text-[#757575] hover:text-black hover:bg-gray-50 font-medium",
                    "whitespace-nowrap"
                )}
            >
                <div className="relative shrink-0">
                    <item.icon
                        size={22}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={clsx(isActive ? "text-[#292929]" : "text-[#757575] group-hover:text-[#292929]")}
                    />

                    {item.count > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full border border-white">
                            {item.count}
                        </span>
                    )}
                </div>

                <span className={clsx(isActive ? "text-[#292929]" : "text-[#757575]", " text-[15px] group-hover:text-[#292929]")}>{item.label}</span>
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
                if (window.innerWidth >= 768) {
                   dispatch(closeSidebar());
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen, dispatch]);

    return (
        <>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => dispatch(closeSidebar())}
                />
            )}

            <aside
                ref={sidebarRef}
                className={clsx(
                    "fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-64px)] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-y-auto custom-scrollbar",
                    "overflow-hidden",
                    isSidebarOpen
                        ? "translate-x-0 w-64 mr-6 md:mr-8"
                        : "-translate-x-full md:translate-x-0 md:w-0 md:border-none md:mr-0"
                )}
            >
                <div className="p-4 pb-20 space-y-1 w-64">
                    <div className="flex justify-end md:hidden mb-2">
                        <button onClick={() => dispatch(closeSidebar())} className="p-2"><X /></button>
                    </div>

                    <div className="mb-6 px-1">
                        <Link
                            href={AppRoute.documents.upload}
                            className="flex items-center justify-center gap-2 w-full bg-[#292929] text-white py-2.5 rounded-full font-medium text-[15px] hover:bg-black transition shadow-sm hover:shadow-md whitespace-nowrap"
                        >
                            <UploadCloud size={18} className="shrink-0" />
                            <span>Upload Document</span>
                        </Link>
                    </div>
                    {mainMenuItems.map(renderMenuItem)}

                    <hr className="my-4 border-gray-100" />

                    {secondaryMenuItems.map(renderMenuItem)}
                </div>
            </aside>
        </>
    );
}