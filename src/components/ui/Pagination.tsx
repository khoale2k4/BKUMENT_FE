'use client';

import { ArrowLeft, ArrowRight } from "lucide-react";
import clsx from "clsx";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const generatePagination = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage <= 3) {
            return [1, 2, 3, '...', totalPages - 1, totalPages];
        }

        if (currentPage >= totalPages - 2) {
            return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
        }

        return [
            1,
            '...',
            currentPage - 1,
            currentPage,
            currentPage + 1,
            '...',
            totalPages,
        ];
    };

    const pages = generatePagination();

    return (
        <div className="flex items-center justify-between border border-gray-400 rounded-xl px-4 py-1 w-full max-w-xl mx-auto mt-10 select-none bg-white">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={clsx(
                    "h-10 px-3 flex items-center gap-2 text-base font-medium transition-colors rounded-lg",
                    currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                )}
            >
                <ArrowLeft size={18} />
                <span>Previous</span>
            </button>

            <div className="flex items-center gap-1 sm:gap-2">
                {pages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="text-gray-500 px-2">
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => onPageChange(page as number)}
                            className={clsx(
                                "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-sm sm:text-base font-medium transition-all",
                                currentPage === page
                                    ? "bg-[#292929] text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                            )}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={clsx(
                    "h-10 px-3 flex items-center gap-2 text-base font-medium transition-colors rounded-lg",
                    currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                )}
            >
                <span>Next</span>
                <ArrowRight size={18} />
            </button>
        </div>
    );
}