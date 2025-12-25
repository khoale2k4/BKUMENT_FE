'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({ fileUrl }: { fileUrl: string }) {
    const [numPages, setNumPages] = useState<number>(0);
    const [containerWidth, setContainerWidth] = useState<number>(0);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
        <div
            className="flex flex-col items-center bg-gray-100 p-4 gap-4 rounded-xl border border-gray-200"
            ref={(el) => {
                if (el) {
                    setContainerWidth(el.clientWidth);
                }
            }}
        >
            <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                    <div className="flex items-center gap-2 py-10 text-gray-500">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                        <span>Đang tải tài liệu...</span>
                    </div>
                }
                error={
                    <div className="text-red-500 py-10">
                        Không thể tải file PDF. Vui lòng kiểm tra lại đường dẫn.
                    </div>
                }
            >
                {Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} className="shadow-lg mb-4 last:mb-0">
                        <Page
                            pageNumber={index + 1}
                            width={containerWidth ? containerWidth - 32 : 600}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            className="bg-white"
                        />
                        <div className="text-center text-xs text-gray-400 py-2 bg-gray-50">
                            Page {index + 1} of {numPages}
                        </div>
                    </div>
                ))}
            </Document>
        </div>
    );
}