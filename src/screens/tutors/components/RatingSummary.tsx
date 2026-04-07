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
    <div className="flex items-center gap-6 mb-10 bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
      <div className="text-center">
        <div className="text-5xl font-black text-slate-900 mb-2">
          {averageScore ? Number(averageScore).toFixed(1) : "0.0"}
        </div>
        <div className="flex justify-center mb-1">
          <StarDisplay score={Math.round(averageScore)} />
        </div>
        <div className="text-sm text-gray-500 mt-1 font-medium">
          Dựa trên {totalRatings} lượt đánh giá
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;
