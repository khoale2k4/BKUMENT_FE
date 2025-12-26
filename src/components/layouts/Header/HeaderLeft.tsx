"use client";
import { Menu } from "lucide-react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { toggleSidebar } from "@/lib/redux/features/layoutSlide";
import { useRouter } from "next/navigation";
import { AppRoute } from "@/lib/appRoutes";

export default function HeaderLeft() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    return (
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
                onClick={() => router.push(AppRoute.home)}
            />
        </div>
    );
}