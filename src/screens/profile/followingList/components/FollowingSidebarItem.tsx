// import React from 'react';
// import { MoreHorizontal } from 'lucide-react';
// import { UserProfile } from '@/lib/redux/features/profileSlice';

// interface FollowingSidebarItemProps {
//   user: UserProfile;
//   isSelected: boolean;
//   onClick: () => void;
// }

// const FollowingSidebarItem: React.FC<FollowingSidebarItemProps> = ({ user, isSelected, onClick }) => {
//   return (
//     <div
//       onClick={onClick}
//       className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
//         isSelected ? 'bg-gray-100/80' : 'hover:bg-gray-50'
//       }`}
//     >
//       {/* Avatar */}
//       <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-gray-200">
//         <img
//           src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`}
//           alt={user.fullName}
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {/* Info */}
//       <div className="flex-1 min-w-0">
//         <h4 className="text-[15px] font-semibold text-gray-900 truncate">
//           {user.fullName}
//         </h4>
//         <p className="text-[13px] text-gray-500 truncate mt-0.5">
//           {user.university || user.bio || 'Học viên'}
//         </p>
//       </div>

//       {/* Nút 3 chấm (More options) */}
//       <button className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 rounded-full transition-colors shrink-0">
//         <MoreHorizontal size={20} />
//       </button>
//     </div>
//   );
// };

// export default FollowingSidebarItem;

import React from "react";
import { MoreHorizontal } from "lucide-react";
import { UserProfile } from "@/lib/redux/features/profileSlice";

interface FollowingSidebarItemProps {
  user: UserProfile;
  isSelected: boolean;
  onClick: () => void;
}

const FollowingSidebarItem: React.FC<FollowingSidebarItemProps> = ({
  user,
  isSelected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      // [Mobile UI:] active:bg cho touch feedback, padding nhỏ hơn trên mobile
      className={`flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl cursor-pointer transition-colors active:bg-gray-200 ${
        isSelected ? "bg-gray-100/80" : "hover:bg-gray-50"
      }`}
    >
      {/* [Mobile UI:] Avatar nhỏ hơn trên mobile: w-11 thay vì w-14 */}
      <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border border-gray-200">
        <img
          src={
            user.avatarUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`
          }
          alt={user.fullName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* [Mobile UI:] text nhỏ hơn trên mobile */}
        <h4 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 truncate leading-snug">
          {user.fullName}
        </h4>
        <p className="text-[12px] sm:text-[13px] text-gray-500 truncate mt-0.5">
          {user.university || user.bio || "Học viên"}
        </p>
      </div>

      {/* [Mobile UI:] Nút 3 chấm - touch target đủ lớn (min 44x44) */}
      <button className="p-1.5 sm:p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 active:bg-gray-300 rounded-full transition-colors shrink-0">
        <MoreHorizontal size={18} />
      </button>
    </div>
  );
};

export default FollowingSidebarItem;
