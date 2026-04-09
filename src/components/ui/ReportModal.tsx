'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeReportModal } from '@/lib/redux/features/modalSlice';
import { showToast } from '@/lib/redux/features/toastSlice'; 
import { submitReportAsync } from '@/lib/redux/features/reportSlice';
import { CreateReportPayload } from '@/lib/services/report.service';
import { useTranslation } from 'react-i18next';

const REPORT_REASON_KEYS = [
    "DIRECT_QUOTE_NO_CITATION",
    "SELF_PLAGIARISM",
    "IDEA_PLAGIARISM",
    "STRUCTURE_PLAGIARISM",
    "PARAPHRASED_NO_CITATION",
    "POOR_PARAPHRASING",
    "INCOMPLETE_CITATION",
    "FALSIFIED_SOURCE",
    "MISSING_REFERENCES",
    "OTHERS" 
];

export default function ReportModal() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    
    const { isOpen, targetId } = useAppSelector((state) => state.modal.reportModal);

    const [selectedReason, setSelectedReason] = useState<string>("");
    const [otherReason, setOtherReason] = useState("");

    const handleClose = () => {
        dispatch(closeReportModal());
        setTimeout(() => {
            setSelectedReason(""); 
            setOtherReason("");
        }, 300);
    };

    const handleReport = async () => {
        if (!targetId) return;

        const reportPayload: CreateReportPayload = {
            targetId,
            type: "DOCUMENT",
            reason: selectedReason,
            detail: otherReason,
        };

        try {
            await dispatch(submitReportAsync(reportPayload)).unwrap();
            
            dispatch(showToast({ 
                type: 'success', 
                title: t('common.report.successTitle'), 
                message: t('common.report.successMsg') 
            }));
            handleClose();
        } catch (error) {
            console.error("Lỗi khi report:", error);
            dispatch(showToast({ 
                type: 'error', 
                title: t('common.report.errorTitle'), 
                message: t('common.report.errorMsg') 
            }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
            
            <div className="bg-[#8B2C1F] text-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                
                <div className="flex justify-end pt-4 pr-4">
                    <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">✕</button>
                </div>

                <div className="px-8 pb-8 overflow-y-auto no-scrollbar">
                    <h2 className="text-2xl font-medium text-center mb-8 tracking-wide">
                        {t('common.report.title')}
                    </h2>

                    <div className="mb-6">
                        <label className="block text-sm font-light mb-2">{t('common.report.selectReason')}</label>
                        <select 
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="w-full bg-white text-black rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#E85D45] cursor-pointer"
                        >
                            <option value="" disabled>{t('common.report.placeholderReason')}</option>
                            {REPORT_REASON_KEYS.map((reasonKey) => (
                                <option key={reasonKey} value={reasonKey}>
                                    {t(`common.report.reasons.${reasonKey}`)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedReason === "OTHERS" && (
                        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                            <label className="block text-sm font-light mb-1">{t('common.report.otherReasonLabel')}</label>
                            <input 
                                type="text" 
                                value={otherReason}
                                onChange={(e) => setOtherReason(e.target.value)}
                                placeholder={t('common.report.otherReasonPlaceholder')}
                                className="w-full bg-white text-black rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#E85D45]"
                            />
                        </div>
                    )}

                    <div className="flex justify-end mt-4">
                        <button 
                            onClick={handleReport}
                            disabled={!selectedReason || (selectedReason === "OTHERS" && !otherReason.trim())}
                            className="bg-[#E85D45] hover:bg-[#d4523d] text-white px-8 py-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t('common.report.submit')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}