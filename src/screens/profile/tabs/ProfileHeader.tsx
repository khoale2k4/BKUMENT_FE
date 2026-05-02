// "use client";

// import React from "react";
// import { MoreHorizontal } from "lucide-react";
// import { useAppSelector } from "@/lib/redux/hooks";

// import { useTranslation } from "react-i18next";

// // Định nghĩa kiểu dữ liệu cho các Tab
// export type TabType =
//   | "home"
//   | "my-teaching-class"
//   | "about"
//   | "my-studying-class";

// interface ProfileHeaderProps {
//   tutorName: string;
//   activeTab: TabType;
//   onTabChange: (tab: TabType) => void;
// }

// const ProfileHeader: React.FC<ProfileHeaderProps> = ({
//   tutorName,
//   activeTab,
//   onTabChange,
// }) => {
//   const { t } = useTranslation();
//   const tabs: { id: TabType; label: string }[] = [
//     { id: "home", label: t("profile.user.tabs.home") },
//     { id: "my-teaching-class", label: t("profile.user.tabs.teachingClasses") },
//     { id: "my-studying-class", label: t("profile.user.tabs.studyingClasses") },
//     { id: "about", label: t("profile.user.tabs.about") },
//   ];

//   const { roles, currentRole } = useAppSelector((state) => state.auth);
//   const isTutor = roles.includes("USER");
//   console.log("User Roles:", isTutor);

//   return (
//     <header className="flex justify-between items-start mb-8">
//       <div>
//         {/* Tên Gia sư */}
//         <h1 className="text-4xl font-bold text-slate-900 mb-8">
//           {tutorName} - {currentRole}
//         </h1>

//         {/* Navigation Tabs */}
//         <nav className="flex gap-8 text-sm font-medium text-slate-600 border-b border-gray-100 pb-0">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => onTabChange(tab.id)}
//               className={`pb-3 transition-colors border-b-2 ${
//                 activeTab === tab.id
//                   ? "text-black border-black"
//                   : "border-transparent hover:text-black hover:border-gray-300"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Settings Button */}
//       <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
//         <MoreHorizontal size={24} />
//       </button>
//     </header>
//   );
// };

// export default ProfileHeader;

"use client";

import React from "react";
import { MoreHorizontal } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";
import { useTranslation } from "react-i18next";

export type TabType =
  | "home"
  | "my-teaching-class"
  | "about"
  | "my-studying-class";

interface ProfileHeaderProps {
  tutorName: string;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  tutorName,
  activeTab,
  onTabChange,
}) => {
  const { t } = useTranslation();
  const tabs: { id: TabType; label: string }[] = [
    { id: "home", label: t("profile.user.tabs.home") },
    { id: "my-teaching-class", label: t("profile.user.tabs.teachingClasses") },
    { id: "my-studying-class", label: t("profile.user.tabs.studyingClasses") },
    { id: "about", label: t("profile.user.tabs.about") },
  ];

  const { roles, currentRole } = useAppSelector((state) => state.auth);
  const isTutor = roles.includes("USER");
  console.log("User Roles:", isTutor);

  return (
    // [Mobile UI:] flex-col trên mobile, justify-between trên sm+
    <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 sm:mb-8 gap-3 sm:gap-0">
      <div className="flex-1 min-w-0">
        {/* [Mobile UI:] font nhỏ hơn trên mobile để không tràn */}
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-4 sm:mb-8 truncate">
          {tutorName}
          {currentRole && (
            <span className="text-base sm:text-2xl font-normal text-gray-400 ml-2">
              - {currentRole}
            </span>
          )}
        </h1>

        {/*
          [Mobile UI:] Tab bar cuộn ngang trên mobile (overflow-x-auto)
          Ẩn scrollbar với hide-scrollbar hoặc scrollbar-hide (cần plugin)
          gap nhỏ hơn, text nhỏ hơn
        */}
        <nav className="flex gap-2 sm:gap-8 text-sm font-medium border-b border-gray-100 pb-0 overflow-x-auto whitespace-nowrap hide-scrollbar -mx-1 px-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              // [Mobile UI:] padding khoảng cách nhỏ hơn, font size nhỏ hơn
              className={`pb-2.5 sm:pb-3 px-1 text-[13px] sm:text-sm transition-colors border-b-2 shrink-0 ${
                activeTab === tab.id
                  ? "text-black border-black"
                  : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* [Mobile UI:] Nút settings - absolute top-right hoặc inline */}
      <button className="self-end sm:self-auto p-2 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors text-gray-500 shrink-0">
        <MoreHorizontal size={22} />
      </button>
    </header>
  );
};

export default ProfileHeader;
