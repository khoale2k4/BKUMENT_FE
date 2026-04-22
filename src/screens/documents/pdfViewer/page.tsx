'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useTranslation } from 'react-i18next';
import { PDFLoadingSkeleton } from './skeleton';
import { getAccessToken } from '@/lib/utils/token';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({ fileUrl, token }: { fileUrl: string, token: string | null }) {
    const { t } = useTranslation();
    const [numPages, setNumPages] = useState<number>(0);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
        <div
            className="flex flex-col items-center bg-gray-100 p-4 gap-4 rounded-xl border border-gray-200 min-h-[600px] justify-center" // Thêm min-h để không bị giật
            ref={(el) => {
                if (el) {
                    setContainerWidth(el.clientWidth);
                }
            }}
        >
            <Document
                file={{
                    url: fileUrl,
                }}
                options={{
                    httpHeaders: {
                        Authorization: `Bearer ${token}`,
                    },
                }}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<PDFLoadingSkeleton />}
                noData={
                    <div className="text-gray-400 text-sm">{t('common.noDocumentSelected')}</div>
                }
                error={
                    <div className="flex flex-col items-center text-red-500 py-10 gap-2">
                        <span className="font-semibold">{t('common.error.fileLoad')}</span>
                        <span className="text-sm">{t('common.error.checkPath')}</span>
                    </div>
                }
            >
                {Array.from(new Array(numPages), (el, index) => index + 1)
                    .slice(0, isExpanded ? numPages : 5)
                    .map((pageNumber) => (
                        <div key={`page_${pageNumber}`} className="shadow-lg mb-4 last:mb-0 transition-opacity duration-500">
                            <Page
                                pageNumber={pageNumber}
                                width={containerWidth ? containerWidth - 32 : 600}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                className="bg-white"
                                loading={
                                    <div className="w-full bg-white animate-pulse aspect-[1/1.41]" />
                                }
                            />
                            <div className="text-center text-xs text-gray-400 py-2 bg-gray-50">
                                {t('common.pageInfo', { page: pageNumber, total: numPages })}
                            </div>
                        </div>
                    ))}

                {!isExpanded && numPages > 5 && (
                    <div className="w-full flex justify-center mt-4">
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-full shadow-sm hover:bg-gray-50 transition font-medium text-sm flex items-center gap-2 cursor-pointer"
                        >
                            {t('common.seeMorePages', { count: numPages - 5 })}
                        </button>
                    </div>
                )}
                {isExpanded && numPages > 5 && (
                    <div className="w-full flex justify-center mt-4 pb-4">
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-full shadow-sm hover:bg-gray-50 transition font-medium text-sm flex items-center gap-2"
                        >
                            {t('common.collapse')}
                        </button>
                    </div>
                )}
            </Document>
        </div>
    );
}