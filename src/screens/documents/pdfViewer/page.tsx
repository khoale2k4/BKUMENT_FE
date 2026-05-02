"use client";

import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useTranslation } from "react-i18next";
import { PDFLoadingSkeleton } from "./skeleton";

// Khởi tạo worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({
  fileUrl,
  token,
}: {
  fileUrl: string;
  token: string | null;
}) {
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // [THÊM MỚI]: State để kiểm tra Client-side, chặn lỗi Hydration của Next.js
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // [THÊM MỚI]: Đánh dấu Component đã render an toàn trên Client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // [HIỆU NĂNG]: Sử dụng ResizeObserver thay cho inline ref để đo kích thước mượt mà hơn, không gây lỗi
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isMounted]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  // [QUAN TRỌNG]: Chặn không cho render PDF trên Server để tránh lỗi Hydration
  if (!isMounted) return <PDFLoadingSkeleton />;

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center bg-gray-100 p-2 sm:p-4 gap-4 rounded-xl border border-gray-200 min-h-[600px] justify-center overflow-hidden"
    >
      <Document
        file={{ url: fileUrl }}
        options={{
          httpHeaders: {
            Authorization: `Bearer ${token}`,
          },
        }}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<PDFLoadingSkeleton />}
        noData={
          <div className="text-gray-400 text-sm">
            {t("common.noDocumentSelected")}
          </div>
        }
        error={
          <div className="flex flex-col items-center text-red-500 py-10 gap-2 text-center px-4">
            <span className="font-semibold">{t("common.error.fileLoad")}</span>
            <span className="text-sm">{t("common.error.checkPath")}</span>
          </div>
        }
      >
        {Array.from(new Array(numPages), (el, index) => index + 1)
          .slice(0, isExpanded ? numPages : 5)
          .map((pageNumber) => (
            <div
              key={`page_${pageNumber}`}
              className="shadow-lg mb-4 last:mb-0 transition-opacity duration-500 w-full flex flex-col items-center"
            >
              <Page
                pageNumber={pageNumber}
                // [HIỆU NĂNG]: Luôn chừa lề, và set max-width để không tràn màn hình
                width={
                  containerWidth
                    ? containerWidth - 16
                    : Math.min(window.innerWidth - 32, 600)
                }
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="bg-white max-w-full overflow-hidden"
                // [CRASH FIX]: Ép thiết bị iOS (dùng pixel ratio = 3) chỉ render ở mức 2 để chống tràn RAM Safari
                devicePixelRatio={Math.min(window.devicePixelRatio || 1, 2)}
                loading={
                  <div className="w-full bg-white animate-pulse aspect-[1/1.41]" />
                }
              />
              <div className="text-center text-xs text-gray-400 py-2 bg-gray-50 w-full border-t border-gray-100">
                {t("common.pageInfo", { page: pageNumber, total: numPages })}
              </div>
            </div>
          ))}

        {!isExpanded && numPages > 5 && (
          <div className="w-full flex justify-center mt-4">
            <button
              onClick={() => setIsExpanded(true)}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-full shadow-sm hover:bg-gray-50 transition font-medium text-sm flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {t("common.seeMorePages", { count: numPages - 5 })}
            </button>
          </div>
        )}

        {isExpanded && numPages > 5 && (
          <div className="w-full flex justify-center mt-4 pb-4">
            <button
              onClick={() => setIsExpanded(false)}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-full shadow-sm hover:bg-gray-50 transition font-medium text-sm flex items-center gap-2 active:scale-95"
            >
              {t("common.collapse")}
            </button>
          </div>
        )}
      </Document>
    </div>
  );
}
