"use client";
import { useState, useEffect, useRef } from "react";
import {
    Settings,
    BookMarked,
    FileText,
    BarChart2,
    HelpCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logoutUser } from "@/lib/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { AppRoute } from "@/lib/appRoutes";
import Link from "next/link";

const DropdownItem = ({ href, icon: Icon, label }: any) => (
    <Link
        href={href}
        className="flex items-center gap-4 px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
    >
        {Icon && <Icon className="w-5 h-5 text-gray-500" strokeWidth={1.5} />}
        <span className="text-sm text-black">{label}</span>
    </Link>
);

export default function UserDropdown() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { token, user } = useAppSelector((state) => state.auth);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        if (token) {
            await dispatch(logoutUser(token));
        }
        router.push(AppRoute.onboard);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-300 cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition"
            >
                <img
                    src="https://placehold.co/100x100"
                    alt="User"
                    className="w-full h-full object-cover"
                />
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-white rounded shadow-[0_2px_10px_rgba(0,0,0,0.15)] border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-100 z-50">

                    <div className="py-2">
                        <DropdownItem href="#" icon={BookMarked} label="Library" />
                        <DropdownItem href="#" icon={FileText} label="Stories" />
                        <DropdownItem href="#" icon={BarChart2} label="Stats" />
                    </div>

                    <div className="h-px bg-gray-100 my-1 mx-6"></div>

                    <div className="py-2">
                        <DropdownItem href={AppRoute.settings} icon={Settings} label="Settings" />
                        <DropdownItem href="#" icon={HelpCircle} label="Help" />
                    </div>

                    <div className="h-px bg-gray-100 my-1 mx-6"></div>

                    <div className="py-2 px-6 space-y-2">
                        <Link href="#" className="flex items-center gap-4 text-sm text-black hover:text-gray-600">
                            Become a Member <span className="text-yellow-500">✨</span>
                        </Link>
                        <Link href="#" className="flex items-center gap-4 text-sm text-black hover:text-gray-600">
                            Apply to the Partner Program
                        </Link>
                    </div>

                    <div className="h-px bg-gray-100 my-1 mx-6"></div>

                    <div
                        onClick={handleLogout}
                        className="py-3 px-6 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <button className="w-full text-left block text-sm text-gray-600 hover:text-black mb-1">
                            Sign out
                        </button>
                        <p className="text-xs text-gray-400 truncate">
                            {user?.email || "user@example.com"}
                        </p>
                    </div>

                    <div className="h-px bg-gray-100 my-1"></div>

                    <div className="px-6 py-3 flex flex-wrap gap-x-3 gap-y-1">
                        {["About", "Blog", "Careers", "Privacy", "Terms", "Text to speech", "Teams"].map((item) => (
                            <Link
                                href="#"
                                key={item}
                                className="text-[11px] text-gray-400 hover:text-gray-600"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}