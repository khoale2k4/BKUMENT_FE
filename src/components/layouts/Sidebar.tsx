'use client';
import { 
    Home, BookOpen, User, BarChart2, X, 
    NotebookText, FileText, Send, UserSearch, Bell, 
    PenSquare, Users, Book, File
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { closeSidebar } from '@/lib/redux/features/layoutSlide'; 
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar() {
    const { isSidebarOpen } = useAppSelector((state) => state.ui);
    const dispatch = useAppDispatch();
    const pathname = usePathname();

    const mainMenuItems = [
        { icon: Home, label: 'Home', href: '/', count: 0 },
        { icon: Book, label: 'Library', href: '/library', count: 0 }, 
        { icon: User, label: 'Profile', href: '/profile', count: 0 },
        { icon: NotebookText, label: 'My Courses', href: '/courses', count: 0 },
        { icon: FileText, label: 'My Blog', href: '/blog', count: 0 },
        { icon: File, label: 'Documents', href: '/documents', count: 0 },
        { icon: Send, label: 'Messages', href: '/messages', count: 2 }, 
        { icon: UserSearch, label: 'Find Tutors', href: '/tutors', count: 0 },
        { icon: Bell, label: 'Notifications', href: '/notifications', count: 2 }, 
    ];

    const secondaryMenuItems = [
        { icon: PenSquare, label: 'Write Blog', href: '/write-blog', count: 0 },
        { icon: Users, label: 'Following', href: '/following', count: 2 }, 
        { icon: Users, label: 'My Groups', href: '/groups', count: 0 },
    ];

    const renderMenuItem = (item: any, idx: number) => {
        const isActive = pathname === item.href;
        return (
            <Link
                key={idx}
                href={item.href}
                className={clsx(
                    "relative flex items-center space-x-4 p-1 rounded-lg transition group",
                    "text-[#757575] hover:text-black hover:bg-gray-50 font-medium"
                )}
            >
                <div className="relative">
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

    return (
        <>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => dispatch(closeSidebar())}
                />
            )}

            <aside
                className={clsx(
                    "fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-64px)] w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out overflow-y-auto custom-scrollbar",
                    !isSidebarOpen ? "-translate-x-full md:w-0 md:border-none overflow-hidden" : "translate-x-0"
                )}
            >
                <div className="p-4 pb-20 space-y-1"> 
                    <div className="flex justify-end md:hidden mb-2">
                        <button onClick={() => dispatch(closeSidebar())} className="p-2"><X /></button>
                    </div>

                    {mainMenuItems.map(renderMenuItem)}

                    <hr className="my-4 border-gray-100" />

                    {secondaryMenuItems.map(renderMenuItem)}
                </div>
            </aside>
        </>
    );
}