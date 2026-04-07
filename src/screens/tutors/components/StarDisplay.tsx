import React from "react";
import { Star } from "lucide-react";

interface StarDisplayProps {
  score: number;
}

const StarDisplay: React.FC<StarDisplayProps> = ({ score }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={
            star <= score
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 fill-gray-100"
          }
        />
      ))}
    </div>
  );
};

export default StarDisplay;
