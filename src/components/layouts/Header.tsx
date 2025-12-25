
"use client";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  Search,
  Settings,
  Bell,
  LogOut,
  BookMarked,
  FileText,
  BarChart2,
  HelpCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"; // 1. Import useAppSelector
import { toggleSidebar } from "@/lib/redux/features/layoutSlide";
import { logout } from "@/lib/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { AppRoute } from "@/lib/appRoutes";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/apiEndPoints";

export default function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // 2. Get token and user info from Redux
  const { token, user } = useAppSelector((state) => state.auth);


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 3. Updated Handle Logout Function
  const handleLogout = async () => {
    try {
      // Only call API if we actually have a token
      if (token) {
        const response = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token, // Pass the token exactly as required
          }),
        });

        const data = await response.json();
        console.log("Logout response:", data);

        // Optional: Check code 1000 if needed, but usually we force logout anyway
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // 4. IMPORTANT: Always clear client state and redirect,
      // even if the server request failed or network is down.
      dispatch(logout());
      router.push("/");
    }
  };

  // Close dropdown when clicking outside
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16 px-4 flex items-center justify-between font-sans">
      {/* --- Left Section --- */}
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

      {/* --- Middle Section (Search) --- */}
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

      {/* --- Right Section --- */}
      <div className="flex items-center gap-2 md:gap-6">
        <Link
          href="#"
          className="hidden sm:flex items-center gap-1 text-gray-500 hover:text-black text-sm"
        >
          <FileText className="w-5 h-5" strokeWidth={1.5} />
          <span>Write</span>
        </Link>

        <button className="p-2 text-gray-500 hover:text-black">
          <Bell className="w-6 h-6" strokeWidth={1.5} />
        </button>

        {/* --- Avatar & Dropdown --- */}
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

          {/* === DROPDOWN MENU === */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-white rounded shadow-[0_2px_10px_rgba(0,0,0,0.15)] border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-100 z-50">
              {/* Group 1: Library, Stories, Stats */}
              <div className="py-2 ">
                <Link
                  href="#"
                  className="flex items-center gap-4 px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer text-black transition-color"
                >
                  <BookMarked
                    className="w-5 h-5 text-gray-500"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm">Library</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer text-black transition-color"
                >
                  <FileText
                    className="w-5 h-5 text-gray-500"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm">Stories</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer text-black transition-color"
                >
                  <BarChart2
                    className="w-5 h-5 text-gray-500"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm">Stats</span>
                </Link>
              </div>

              <div className="h-px bg-gray-100 my-1 mx-6"></div>

              {/* Group 2: Settings & Help */}
              <div className="py-2">
                <Link
                  href="/settings"
                  className="flex items-center gap-4 px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer text-black transition-color"
                >
                  <Settings
                    className="w-5 h-5 text-gray-500"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm">Settings</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer text-black transition-color"
                >
                  <HelpCircle
                    className="w-5 h-5 text-gray-500"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm">Help</span>
                </Link>
              </div>

              <div className="h-px bg-gray-100 my-1 mx-6"></div>

              {/* Group 3: Promotions */}
              <div className="py-2 px-6 space-y-2">
                <Link
                  href="#"
                  className="flex items-center gap-4 px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer text-black transition-color"
                >
                  Become a Member <span className="text-yellow-500">✨</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-6 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer text-black transition-color"
                >
                  Apply to the Partner Program
                </Link>
              </div>

              <div className="h-px bg-gray-100 my-1 mx-6"></div>

              {/* Group 4: Sign out & User Info */}
              <div
                onClick={handleLogout} // Chuyển sự kiện click lên đây
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

              {/* Footer Links */}
              <div className="px-6 py-3 flex flex-wrap gap-x-3 gap-y-1">
                {[
                  "About",
                  "Blog",
                  "Careers",
                  "Privacy",
                  "Terms",
                  "Text to speech",
                  "Teams",
                ].map((item) => (
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
      </div>
    </header>
  );
}
