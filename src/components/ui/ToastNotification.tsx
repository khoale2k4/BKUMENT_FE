'use client';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { hideToast } from '@/lib/redux/features/toastSlice';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

export default function GlobalToast() {
    const { isOpen, type, title, message, id } = useAppSelector((state) => state.toastNotification);
    const dispatch = useAppDispatch();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => dispatch(hideToast()), 300);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, id, dispatch]);

    if (!isOpen && !isVisible) return null;

    const styles = {
        success: { icon: CheckCircle2, color: 'text-green-600', border: 'border-l-green-500', bgIcon: 'bg-green-100' },
        error: { icon: XCircle, color: 'text-red-600', border: 'border-l-red-500', bgIcon: 'bg-red-100' },
        warning: { icon: AlertCircle, color: 'text-orange-500', border: 'border-l-orange-500', bgIcon: 'bg-orange-100' },
        info: { icon: Info, color: 'text-blue-500', border: 'border-l-blue-500', bgIcon: 'bg-blue-100' },
    }[type];

    const Icon = styles.icon;

    return (
        <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 items-end">
            <div
                className={clsx(
                    "relative w-auto min-w-[300px] max-w-[90vw] bg-white shadow-lg rounded-lg pointer-events-auto flex overflow-hidden transition-all duration-300 ease-in-out transform",
                    "border-l-4", styles.border,
                    isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                )}
            >
                <div className="p-4 flex items-start gap-3">
                    <div className={clsx("flex-shrink-0 p-1 rounded-full mt-0.5", styles.bgIcon)}>
                        <Icon className={clsx("h-5 w-5", styles.color)} />
                    </div>

                    <div className="flex-1 pr-6">
                        <p className="text-sm font-bold text-gray-900 whitespace-nowrap">{title}</p>
                        <p className="mt-1 text-sm text-gray-500 leading-snug whitespace-nowrap">{message}</p>
                    </div>

                </div>

                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(() => dispatch(hideToast()), 300);
                    }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition focus:outline-none"
                >
                    <span className="sr-only">Close</span>
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}