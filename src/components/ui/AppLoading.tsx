"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { useTranslation } from "react-i18next";

interface AppLoadingProps {
    fullScreen?: boolean;
    text?: string;
}

export default function AppLoading({
    fullScreen = true,
    text
}: AppLoadingProps) {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Only use translated text after mounting to avoid hydration mismatch
    const displayText = text || (mounted ? t('common.loading') : "");

    const loaderContent = (
        <div className="flex flex-col items-center justify-center gap-6 p-4">

            <div className="relative w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md animate-loading-pulse">
                <Image
                    src="/images/icon-30-4.png"
                    alt="VBook Loading"
                    fill
                    sizes="(max-w-768px) 80px, 96px"
                    className="object-contain"
                    priority
                />
            </div>

            {displayText && (
                <p className="text-sm sm:text-base font-medium text-gray-600 tracking-wide animate-pulse">
                    {displayText}
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