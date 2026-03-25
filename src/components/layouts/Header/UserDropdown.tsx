"use client";
import { useState, useEffect, useRef } from "react";
import {
    Settings,
    BookMarked,
    FileText,
    BarChart2,
    HelpCircle,
    LucideIcon, 
    GraduationCap,
    Globe // Thêm icon Globe cho phần đổi ngôn ngữ thêm đẹp
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logoutUser, switchRole } from "@/lib/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { AppRoute } from "@/lib/appRoutes";
import Link from "next/link";
import { AuthenticatedImage } from "@/components/ui/AuthenticatedImage";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation(); 
    
    const { token, roles, currentRole } = useAppSelector((state) => state.auth);
    const { user } = useAppSelector((state) => state.profile);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSwitch = () => {
        const nextRole = currentRole === 'USER' ? 'TUTOR' : 'USER';
        dispatch(switchRole(nextRole));
        setIsDropdownOpen(false); 
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

    const hasTutorRole = roles?.includes('TUTOR');

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-300 cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition"
            >
                {user && user.avatarUrl && <AuthenticatedImage src={user.avatarUrl} className="w-full h-full object-cover" />}
                {!user && <img
                    src="https://placehold.co/100x100"
                    alt="User"
                    className="w-full h-full object-cover"
                />}
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-white rounded shadow-[0_2px_10px_rgba(0,0,0,0.15)] border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-100 z-50">

                    <div className="py-2">
                        {/* Đã bọc hàm t() */}
                        <DropdownItem href="#" icon={BookMarked} label={t('dropdown.library', 'Library')} />
                        <DropdownItem href="#" icon={FileText} label={t('dropdown.stories', 'Stories')} />
                        <DropdownItem href="#" icon={BarChart2} label={t('dropdown.stats', 'Stats')} />
                    </div>

                    <div className="h-px bg-gray-100 my-1 mx-6"></div>

                    <div className="py-2">
                        {/* Đã bọc hàm t() */}
                        <DropdownItem href={AppRoute.settings} icon={Settings} label={t('dropdown.settings', 'Settings')} />
                        <DropdownItem href="#" icon={HelpCircle} label={t('dropdown.help', 'Help')} />
                        
                        {/* Khu vực ngôn ngữ được style lại cho đẹp */}
                        <div className="py-2 px-6 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <Globe className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
                                <span className="text-sm text-black">{t('dropdown.language', 'Language')}</span>
                            </div>
                            <LanguageSwitcher />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 my-1 mx-6"></div>

                    {hasTutorRole && (
                        <>
                            <div className="py-2 px-6">
                                <button 
                                    onClick={handleSwitch}
                                    className="flex w-full items-center gap-4 text-sm text-black hover:text-gray-600 transition-colors"
                                >
                                    {/* Thay đổi text tùy theo role hiện tại */}
                                    {currentRole === 'USER' ? t('dropdown.switchTutor', 'Change to tutor account') : t('dropdown.switchUser', 'Change to user account')} <span className="text-blue-500">👩‍🏫</span>
                                </button>
                            </div>
                            <div className="h-px bg-gray-100 my-1 mx-6"></div>
                        </>
                    )}

                    {!hasTutorRole && (
                        <>
                            <div className="py-1">
                                <Link 
                                    href="/register-tutor" 
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex items-center gap-4 px-6 py-2.5 group hover:bg-purple-50 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center justify-center p-1.5 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                                        <GraduationCap className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                                    </div>
                                    
                                    <div className="flex flex-col">
                                        {/* Đã bọc hàm t() */}
                                        <span className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                                            {t('dropdown.becomeTutor', 'Become a Tutor')}
                                        </span>
                                        <span className="text-[11px] text-gray-500">
                                            {t('dropdown.becomeTutorDesc', 'Share your knowledge & earn')}
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
                            {/* Đã bọc hàm t() */}
                            {t('dropdown.signOut', 'Sign out')}
                        </button>
                        <p className="text-xs text-gray-400 truncate">
                            {user?.email || "user@example.com"}
                        </p>
                    </div>

                    <div className="h-px bg-gray-100 my-1"></div>

                    <div className="px-6 py-3 flex flex-wrap gap-x-3 gap-y-1">
                        {/* Footer Links - Có thể tùy chọn bọc t() nếu bạn muốn dịch luôn phần này */}
                        {["About", "Blog", "Careers", "Privacy", "Terms", "Text to speech", "Teams"].map((item) => (
                            <Link
                                href="#"
                                key={item}
                                className="text-[11px] text-gray-400 hover:text-gray-600"
                            >
                                {t(`dropdown.footer.${item.toLowerCase()}`, item)}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}