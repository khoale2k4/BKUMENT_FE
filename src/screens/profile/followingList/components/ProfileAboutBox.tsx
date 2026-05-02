// import React from 'react';
// import { GraduationCap, MapPin, Award, Mail, Phone, Calendar } from 'lucide-react';
// import { useTranslation } from 'react-i18next';
// import { UserProfile } from '@/lib/redux/features/profileSlice';

// interface ProfileAboutBoxProps {
//   profile: UserProfile;
// }

// const ProfileAboutBox: React.FC<ProfileAboutBoxProps> = ({ profile }) => {
//   const { t } = useTranslation();

//   return (
//     <div className="max-w-5xl mx-auto px-6 sm:px-10 mt-6 pb-10">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//         {/* Cột trái: Giới thiệu ngắn */}
//         <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-fit">
//           <h3 className="text-[16px] font-bold text-gray-900 mb-3">{t('profile.user.about.intro')}</h3>

//           {profile.bio && (
//             <div className="text-center text-[14px] text-gray-700 italic mb-4 pb-4 border-b border-gray-100">
//               "{profile.bio}"
//             </div>
//           )}

//           <div className="space-y-3">
//             {profile.university && (
//               <div className="flex items-start gap-2 text-gray-700 text-[14px]">
//                 <GraduationCap size={18} className="text-gray-400 shrink-0" />
//                 <span><span className="font-semibold">{profile.university}</span></span>
//               </div>
//             )}

//             {profile.address && (
//               <div className="flex items-start gap-2 text-gray-700 text-[14px]">
//                 <MapPin size={18} className="text-gray-400 shrink-0" />
//                 <span>{t('profile.user.about.livesAt')} <span className="font-semibold">{profile.address}</span></span>
//               </div>
//             )}

//             <div className="flex items-start gap-2 text-gray-700 text-[14px]">
//               <Award size={18} className="text-orange-400 shrink-0" />
//               <span>{t('profile.user.about.points')}: <span className="font-semibold">{profile.points || 0} {t('profile.user.about.score')}</span></span>
//             </div>
//           </div>
//         </div>

//         {/* Cột phải: Thông tin liên hệ */}
//         <div className="lg:col-span-2">
//           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
//             <h3 className="text-[16px] font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">{t('profile.user.about.contactInfo')}</h3>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               {profile.email && (
//                 <div>
//                   <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5"><Mail size={12}/> {t('profile.user.about.email')}</p>
//                   <p className="text-[14px] text-gray-900 font-medium break-all">{profile.email}</p>
//                 </div>
//               )}

//               {profile.phone && (
//                 <div>
//                   <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5"><Phone size={12}/> {t('profile.user.about.phone')}</p>
//                   <p className="text-[14px] text-gray-900 font-medium">{profile.phone}</p>
//                 </div>
//               )}

//               {profile.dob && (
//                 <div>
//                   <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5"><Calendar size={12}/> {t('profile.user.about.dob')}</p>
//                   <p className="text-[14px] text-gray-900 font-medium">{profile.dob}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ProfileAboutBox;

import React from "react";
import {
  GraduationCap,
  MapPin,
  Award,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { UserProfile } from "@/lib/redux/features/profileSlice";

interface ProfileAboutBoxProps {
  profile: UserProfile;
}

const ProfileAboutBox: React.FC<ProfileAboutBoxProps> = ({ profile }) => {
  const { t } = useTranslation();

  return (
    // [Mobile UI:] px và mt nhỏ hơn trên mobile
    <div className="max-w-5xl mx-auto px-3 sm:px-6 sm:px-10 mt-3 sm:mt-6 pb-4 sm:pb-10">
      {/*
        [Mobile UI:] Mobile = 1 cột (stack dọc), Desktop lg+ = 3 cột
        gap nhỏ hơn trên mobile
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
        {/* Cột trái: Giới thiệu ngắn */}
        {/* [Mobile UI:] padding nhỏ hơn trên mobile */}
        <div className="lg:col-span-1 bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm h-fit">
          <h3 className="text-[14px] sm:text-[16px] font-bold text-gray-900 mb-2 sm:mb-3">
            {t("profile.user.about.about.intro")}
          </h3>

          {profile.bio && (
            // [Mobile UI:] text nhỏ hơn trên mobile
            <div className="text-center text-[13px] sm:text-[14px] text-gray-700 italic mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-100">
              "{profile.bio}"
            </div>
          )}

          <div className="space-y-2 sm:space-y-3">
            {profile.university && (
              <div className="flex items-start gap-2 text-gray-700 text-[13px] sm:text-[14px]">
                <GraduationCap
                  size={16}
                  className="text-gray-400 shrink-0 mt-0.5"
                />
                <span className="font-semibold leading-snug">
                  {profile.university}
                </span>
              </div>
            )}

            {profile.address && (
              <div className="flex items-start gap-2 text-gray-700 text-[13px] sm:text-[14px]">
                <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                <span>
                  {t("profile.user.about.about.livesAt")}{" "}
                  <span className="font-semibold">{profile.address}</span>
                </span>
              </div>
            )}

            <div className="flex items-start gap-2 text-gray-700 text-[13px] sm:text-[14px]">
              <Award size={16} className="text-orange-400 shrink-0 mt-0.5" />
              <span>
                {t("profile.user.about.about.points")}:{" "}
                <span className="font-semibold">
                  {profile.points || 0} {t("profile.user.about.about.score")}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Cột phải: Thông tin liên hệ */}
        <div className="lg:col-span-2">
          {/* [Mobile UI:] padding nhỏ hơn trên mobile */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-[14px] sm:text-[16px] font-bold text-gray-900 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-100">
              {t("profile.user.about.about.contactInfo")}
            </h3>

            {/* [Mobile UI:] 1 cột trên mobile, 2 cột trên sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {profile.email && (
                <div>
                  <p className="text-gray-400 text-[10px] sm:text-xs uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
                    <Mail size={11} /> {t("profile.user.about.about.email")}
                  </p>
                  {/* [Mobile UI:] break-all để email dài không tràn */}
                  <p className="text-[13px] sm:text-[14px] text-gray-900 font-medium break-all">
                    {profile.email}
                  </p>
                </div>
              )}

              {profile.phone && (
                <div>
                  <p className="text-gray-400 text-[10px] sm:text-xs uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
                    <Phone size={11} /> {t("profile.user.about.about.phone")}
                  </p>
                  <p className="text-[13px] sm:text-[14px] text-gray-900 font-medium">
                    {profile.phone}
                  </p>
                </div>
              )}

              {profile.dob && (
                <div>
                  <p className="text-gray-400 text-[10px] sm:text-xs uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
                    <Calendar size={11} /> {t("profile.user.about.about.dob")}
                  </p>
                  <p className="text-[13px] sm:text-[14px] text-gray-900 font-medium">
                    {profile.dob}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAboutBox;
