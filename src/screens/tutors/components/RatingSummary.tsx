// import React from "react";
// import StarDisplay from "./StarDisplay";

// interface RatingSummaryProps {
//   averageScore?: number;
//   totalRatings?: number;
// }

// const RatingSummary: React.FC<RatingSummaryProps> = ({
//   averageScore = 0,
//   totalRatings = 0,
// }) => {
//   return (
//     <div className="flex items-center gap-6 mb-10 bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
//       <div className="text-center">
//         <div className="text-5xl font-black text-slate-900 mb-2">
//           {averageScore ? Number(averageScore).toFixed(1) : "0.0"}
//         </div>
//         <div className="flex justify-center mb-1">
//           <StarDisplay score={Math.round(averageScore)} />
//         </div>
//         <div className="text-sm text-gray-500 mt-1 font-medium">
//           Dựa trên {totalRatings} lượt đánh giá
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RatingSummary;

import React from "react";
import StarDisplay from "./StarDisplay";

interface RatingSummaryProps {
  averageScore?: number;
  totalRatings?: number;
}

const RatingSummary: React.FC<RatingSummaryProps> = ({
  averageScore = 0,
  totalRatings = 0,
}) => {
  return (
    // CHANGE: p-6 -> p-4 sm:p-6 để giảm padding bên trong trên mobile
    <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 bg-orange-50/50 p-4 sm:p-6 rounded-2xl border border-orange-100">
      <div className="text-center">
        {/*
          CHANGE: text-5xl -> text-4xl sm:text-5xl để giảm cỡ chữ số điểm trên mobile.
          mb-2 vẫn giữ.
        */}
        <div className="text-4xl sm:text-5xl font-black text-slate-900 mb-2">
          {averageScore ? Number(averageScore).toFixed(1) : "0.0"}
        </div>
        <div className="flex justify-center mb-1">
          <StarDisplay score={Math.round(averageScore)} />
        </div>
        {/* CHANGE: text-sm -> text-xs sm:text-sm cho label bên dưới */}
        <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
          Dựa trên {totalRatings} lượt đánh giá
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;
