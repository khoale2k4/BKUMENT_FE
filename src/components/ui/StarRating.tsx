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
}

export default function StarRating({ 
    rating, 
    averageRating, 
    onRate, 
    readonly = false,
    size = 'md'
}: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const starSizeClass = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-7 h-7',
    }[size];

    const displayRating = hoverRating !== null ? hoverRating : (rating || averageRating || 0);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            disabled={readonly}
                            onMouseEnter={() => !readonly && setHoverRating(star)}
                            onMouseLeave={() => !readonly && setHoverRating(null)}
                            onClick={() => !readonly && onRate?.(star)}
                            className={clsx(
                                "transition-all duration-150 focus:outline-none p-0.5",
                                !readonly && "hover:scale-125 active:scale-90 cursor-pointer",
                                readonly && "cursor-default"
                            )}
                        >
                            <Star
                                className={clsx(
                                    starSizeClass,
                                    star <= displayRating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-200"
                                )}
                                strokeWidth={star <= displayRating ? 1 : 2}
                            />
                        </button>
                    ))}
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
