"use client";

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { clsx } from 'clsx';

interface StarRatingProps {
    rating: number | null;
    averageRating: number | null;
    onRate?: (rating: number) => void;
    readonly?: boolean;
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export default function StarRating({ 
    rating, 
    averageRating, 
    onRate, 
    readonly = false,
    size = 'md',
    isLoading = false
}: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const starSizeClass = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-7 h-7',
    }[size];

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 animate-pulse">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <div key={star} className={clsx(starSizeClass, "bg-gray-200 rounded-sm m-0.5")} />
                        ))}
                    </div>
                    <div className="flex items-center gap-1.5 animate-pulse">
                        <div className="h-6 w-8 bg-gray-200 rounded" />
                        <div className="h-3 w-12 bg-gray-100 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    const displayRating = hoverRating !== null ? hoverRating : (rating || averageRating || 0);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                    {[1, 2, 3, 4, 5].map((starIndex) => {
                        const fillAmount = Math.min(1, Math.max(0, displayRating - (starIndex - 1)));
                        const fillPercentage = fillAmount * 100;

                        return (
                            <button
                                key={starIndex}
                                type="button"
                                disabled={readonly}
                                onMouseEnter={() => !readonly && setHoverRating(starIndex)}
                                onMouseLeave={() => !readonly && setHoverRating(null)}
                                onClick={() => !readonly && onRate?.(starIndex)}
                                className={clsx(
                                    "transition-all duration-150 focus:outline-none p-0.5 relative group",
                                    !readonly && "hover:scale-125 active:scale-90 cursor-pointer",
                                    readonly && "cursor-default"
                                )}
                            >
                                {/* Background star (empty) */}
                                <Star
                                    className={clsx(starSizeClass, "text-gray-200")}
                                    strokeWidth={2}
                                />
                                
                                {/* Foreground star (filled) */}
                                {fillPercentage > 0 && (
                                    <div 
                                        className="absolute top-0.5 left-0.5 overflow-hidden transition-all duration-300"
                                        style={{ width: `calc(${fillPercentage}% - 0.25rem)` }}
                                    >
                                        <Star
                                            className={clsx(starSizeClass, "fill-yellow-400 text-yellow-400 shrink-0")}
                                            strokeWidth={1}
                                        />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
                
                {averageRating !== null && averageRating > 0 && (
                    <div className="flex items-center gap-1.5">
                        <span className="text-lg font-bold text-gray-900 leading-none">
                            {averageRating.toFixed(1)}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                            Rating
                        </span>
                    </div>
                )}
            </div>
            
            {rating !== null && typeof rating === 'number' && !readonly && (
                <div className="flex items-center gap-1.5 px-1">
                    <div className="w-1 h-1 rounded-full bg-blue-400" />
                    <p className="text-[11px] text-gray-500 font-medium">
                        Your rating: <span className="text-gray-900 font-bold">{rating} stars</span>
                    </p>
                </div>
            )}
        </div>
    );
}
