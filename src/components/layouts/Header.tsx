'use client';
import { Menu, Search, Settings, Bell } from 'lucide-react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { toggleSidebar } from '@/lib/redux/features/layoutSlide';
import { useRouter } from 'next/navigation';

export default function Header() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16 px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => dispatch(toggleSidebar())}
                    className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition"
                >
                    <Menu className="w-6 h-6 text-gray-700" />
                </button>

                <img
                    src="/images/icon-noen.png"
                    alt="Logo"
                    className="w-10 h-10 rounded-sm object-contain cursor-pointer hover:opacity-80 transition"
                    onClick={() => router.push("/")}
                />
            </div>

            <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-black focus:border-black block pl-10 p-2.5 outline-none transition"
                />
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <button className="hidden sm:block p-2 text-gray-500 hover:text-black">
                    <Settings className="w-6 h-6" strokeWidth={1.5} />
                </button>
                <button className="p-2 text-gray-500 hover:text-black">
                    <Bell className="w-6 h-6" strokeWidth={1.5} />
                </button>

                <button className="hidden sm:block border border-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-black hover:text-white transition text-black">
                    Upgrade
                </button>

                <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-300 cursor-pointer">
                    <img
                        src="https://placehold.co/100x100"
                        alt="User"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </header>
    );
}