'use client';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { closeConfirmModal } from '@/lib/redux/features/modalSlice';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmationModal() {
    const { isOpen, title, message, onConfirm, confirmText, cancelText } = useAppSelector((state) => state.modal.confirmModal);
    const dispatch = useAppDispatch();

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        dispatch(closeConfirmModal());
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={() => dispatch(closeConfirmModal())}
            />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-red-100 flex-shrink-0">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>

                        <div className="flex-1 pt-1">
                            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{message}</p>
                        </div>

                        <button
                            onClick={() => dispatch(closeConfirmModal())}
                            className="text-gray-400 hover:text-gray-600 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={() => dispatch(closeConfirmModal())}
                            className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition cursor-pointer"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200 cursor-pointer"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
