'use client';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { hideNotification } from '@/lib/redux/features/modalSlice';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

export default function ModalNotification() {
    const { isOpen, type, title, message } = useAppSelector((state) => state.notification);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                dispatch(hideNotification());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, dispatch]);

    if (!isOpen) return null;

    const config = {
        success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' },
        error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' },
        warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
        info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
    }[type];

    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={() => dispatch(hideNotification())}
            />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={clsx("p-3 rounded-full flex-shrink-0", config.bg)}>
                            <Icon className={clsx("w-6 h-6", config.color)} />
                        </div>

                        <div className="flex-1 pt-1">
                            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{message}</p>
                        </div>

                        <button
                            onClick={() => dispatch(hideNotification())}
                            className="text-gray-400 hover:text-gray-600 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className={clsx("h-1 w-full", config.bg)}>
                    <div className={clsx("h-full animate-shrink", config.color.replace('text', 'bg'))} style={{ width: '100%' }}></div>
                </div>
            </div>
        </div>
    );
}