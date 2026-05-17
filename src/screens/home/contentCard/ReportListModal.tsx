"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Flag, X } from "lucide-react";

// Export interface để ContentCard có thể tái sử dụng
export interface ReportItem {
  reporter: string;
  reason: string;
  createdAt: string;
}

interface ReportListModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportList: ReportItem[];
}

export default function ReportListModal({ isOpen, onClose, reportList }: ReportListModalProps) {
  const { t } = useTranslation();

  // Hàm tìm lý do bị report nhiều nhất
  const getMostCommonReason = () => {
    if (!reportList || reportList.length === 0) return null;
    const counts: Record<string, number> = {};
    let maxCount = 0;
    let mostCommon = "";

    reportList.forEach((report) => {
      counts[report.reason] = (counts[report.reason] || 0) + 1;
      if (counts[report.reason] > maxCount) {
        maxCount = counts[report.reason];
        mostCommon = report.reason;
      }
    });

    return { reason: mostCommon, count: maxCount };
  };

  const mostCommon = getMostCommonReason();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        e.stopPropagation(); // Ngăn click lọt xuống ContentCard bên dưới
        onClose();
      }}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[85vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()} // Ngăn click bên trong Modal làm đóng Modal
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Flag size={20} className="text-red-500" />
            Chi tiết Báo cáo ({reportList.length})
          </h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Thống kê nhanh */}
        {mostCommon && (
          <div className="px-5 py-4 bg-red-50/50 border-b border-red-50">
            <p className="text-sm text-gray-600">
              Lỗi bị báo cáo nhiều nhất: 
              <span className="font-bold text-red-600 ml-2 px-2 py-0.5 bg-red-100 rounded">
                {t(`common.report.reasons.${mostCommon.reason}`, mostCommon.reason)}
              </span>
              <span className="text-xs text-gray-500 ml-2">({mostCommon.count} lượt)</span>
            </p>
          </div>
        )}

        {/* Danh sách */}
        <div className="p-5 overflow-y-auto custom-scrollbar">
          {reportList.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-4">Chưa có dữ liệu báo cáo chi tiết.</p>
          ) : (
            <div className="space-y-4">
              {reportList.map((report, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm text-gray-900">{report.reporter}</span>
                    <div className="inline-block px-2.5 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-lg border border-red-100">
                    {t(`common.report.reasons.${report.reason}`, { defaultValue: report.reason })}
                  </div>
                    <span className="text-xs text-gray-400">{new Date(report.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}