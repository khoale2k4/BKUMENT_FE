"use client";

import React from "react";
import Image from "next/image";

interface AppLoadingProps {
    fullScreen?: boolean;
    text?: string;
}

export default function AppLoading({
    fullScreen = true,
    text = "Đang tải dữ liệu..."
}: AppLoadingProps) {

    const loaderContent = (
        <div className="flex flex-col items-center justify-center gap-6 p-4">

            <div className="relative w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md animate-loading-pulse">
                <Image
                    src="/images/icon-tet.png"
                    alt="VBook Loading"
                    fill
                    sizes="(max-w-768px) 80px, 96px"
                    className="object-contain"
                    priority
                />
            </div>

            {text && (
                <p className="text-sm sm:text-base font-medium text-gray-600 tracking-wide animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-white/95 backdrop-blur-sm">
                {loaderContent}
            </div>
        );
    }

    return loaderContent;
}