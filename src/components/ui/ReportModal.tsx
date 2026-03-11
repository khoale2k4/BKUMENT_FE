'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeReportModal } from '@/lib/redux/features/modalSlice';
import { showToast } from '@/lib/redux/features/toastSlice'; 
import { submitReportAsync } from '@/lib/redux/features/reportSlice';
import { CreateReportPayload } from '@/lib/services/report.service';

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

const getReasonLabel = (key: string): string => {
    const mapping: Record<string, string> = {
        "DIRECT_QUOTE_NO_CITATION": "Trích dẫn trực tiếp không có nguồn",
        "SELF_PLAGIARISM": "Đạo văn chính mình",
        "IDEA_PLAGIARISM": "Đạo ý tưởng",
        "STRUCTURE_PLAGIARISM": "Đạo cấu trúc",
        "PARAPHRASED_NO_CITATION": "Diễn đạt lại không có nguồn",
        "POOR_PARAPHRASING": "Diễn đạt kém / Sao chép từ ngữ",
        "INCOMPLETE_CITATION": "Trích dẫn sai / Không đầy đủ",
        "FALSIFIED_SOURCE": "Nguồn giả mạo",
        "MISSING_REFERENCES": "Thiếu danh mục tài liệu tham khảo",
        "OTHERS": "Khác"
    };
    return mapping[key] || key;
};

export default function ReportModal() {
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

        console.log("Dữ liệu report sẽ gửi đi:", reportPayload);

        try {
            // TODO: Gọi API Dispatch ở đây
            await dispatch(submitReportAsync(reportPayload)).unwrap();
            
            dispatch(showToast({ type: 'success', title: 'Thành công', message: 'Cảm ơn bạn đã báo cáo.' }));
            handleClose();
        } catch (error) {
            console.error("Lỗi khi report:", error);
            dispatch(showToast({ type: 'error', title: 'Lỗi', message: 'Không thể gửi báo cáo lúc này.' }));
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
                        Lý do báo cáo
                    </h2>

                    <div className="mb-6">
                        <label className="block text-sm font-light mb-2">Chọn một lý do</label>
                        <select 
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="w-full bg-white text-black rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#E85D45] cursor-pointer"
                        >
                            <option value="" disabled>-- Vui lòng chọn lý do --</option>
                            {REPORT_REASON_KEYS.map((reasonKey) => (
                                <option key={reasonKey} value={reasonKey}>
                                    {getReasonLabel(reasonKey)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedReason === "OTHERS" && (
                        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                            <label className="block text-sm font-light mb-1">Vui lòng nói rõ hơn</label>
                            <input 
                                type="text" 
                                value={otherReason}
                                onChange={(e) => setOtherReason(e.target.value)}
                                placeholder="Nhập chi tiết lý do tại đây..."
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
                            Báo cáo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}