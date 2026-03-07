"use client";
import { useState, useEffect, useRef } from "react";
import {
    Settings,
    BookMarked,
    FileText,
    BarChart2,
    HelpCircle,
    LucideIcon, GraduationCap
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logoutUser, switchRole } from "@/lib/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { AppRoute } from "@/lib/appRoutes";
import Link from "next/link";

// 1. Added proper TypeScript interface instead of 'any'
interface DropdownItemProps {
    href: string;
    icon: LucideIcon;
    label: string;
}

const DropdownItem = ({ href, icon: Icon, label }: DropdownItemProps) => (
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
    
    // 2. Consolidated Redux selectors into one clean line
    const { token, user, roles, currentRole } = useAppSelector((state) => state.auth);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSwitch = () => {
        const nextRole = currentRole === 'USER' ? 'TUTOR' : 'USER';
        dispatch(switchRole(nextRole));
        setIsDropdownOpen(false); // Optional: close dropdown after switching
    };

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

    // Helper to check if user actually has the Tutor role
    const hasTutorRole = roles?.includes('TUTOR');

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

                    {/* 3. ONLY show the switch option if the user has the TUTOR role */}
                    {hasTutorRole && (
                        <>
                            <div className="py-2 px-6">
                                {/* 4. Changed <Link> to <button> for non-navigation actions */}
                                <button 
                                    onClick={handleSwitch}
                                    className="flex w-full items-center gap-4 text-sm text-black hover:text-gray-600 transition-colors"
                                >
                                    Change to the {currentRole === 'USER' ? 'tutor' : 'user'} account <span className="text-blue-500">👩‍🏫</span>
                                </button>
                            </div>
                            <div className="h-px bg-gray-100 my-1 mx-6"></div>
                        </>
                    )}

{!hasTutorRole && (
                        <>
                            <div className="py-1">
                                <Link 
                                    href="/register-tutor" // Đổi đường dẫn này tới trang đăng ký gia sư của bạn
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex items-center gap-4 px-6 py-2.5 group hover:bg-purple-50 transition-colors cursor-pointer"
                                >
                                    {/* Icon Box */}
                                    <div className="flex items-center justify-center p-1.5 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                                        <GraduationCap className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                                    </div>
                                    
                                    {/* Text Content */}
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                                            Become a Tutor
                                        </span>
                                        <span className="text-[11px] text-gray-500">
                                            Share your knowledge & earn
                                        </span>
                                    </div>
                                </Link>
                            </div>
                            <div className="h-px bg-gray-100 my-1 mx-6"></div>
                        </>
                    )}

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