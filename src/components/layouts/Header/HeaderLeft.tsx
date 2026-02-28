"use client";
import { Menu } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toggleSidebar } from "@/lib/redux/features/layoutSlide";
import { useRouter } from "next/navigation";
import { AppRoute } from "@/lib/appRoutes";
import clsx from "clsx"; 

export default function HeaderLeft() {
    const { isSidebarOpen } = useAppSelector((state) => state.ui);
    const dispatch = useAppDispatch();
    const router = useRouter();

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={() => dispatch(toggleSidebar())}
                className={clsx(
                    "p-2 rounded-full transition-all duration-300 ease-in-out", 
                    isSidebarOpen 
                        ? "opacity-0 -translate-x-4 pointer-events-none" 
                        : "opacity-100 translate-x-0 cursor-pointer hover:bg-gray-100" 
                )}
                aria-hidden={isSidebarOpen}
                tabIndex={isSidebarOpen ? -1 : 0}
            >
                <Menu className="w-6 h-6 text-gray-700" />
            </button>

            <img
                src="/images/icon-tet.png"
                alt="Logo"
                className="w-10 h-10 rounded-sm object-contain cursor-pointer hover:opacity-80 transition"
                onClick={() => router.push(AppRoute.home)}
            />
        </div>
    );
}