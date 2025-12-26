'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2 } from 'lucide-react'; // Nếu bạn có lucide-react
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { PDFLoadingSkeleton } from './skeleton';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({ fileUrl }: { fileUrl: string }) {
    const [numPages, setNumPages] = useState<number>(0);
    const [containerWidth, setContainerWidth] = useState<number>(0);

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
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<PDFLoadingSkeleton />} 
                noData={ 
                    <div className="text-gray-400 text-sm">Chưa có tài liệu nào được chọn</div>
                }
                error={
                    <div className="flex flex-col items-center text-red-500 py-10 gap-2">
                         <span className="font-semibold">Lỗi tải file</span>
                         <span className="text-sm">Vui lòng kiểm tra lại đường dẫn.</span>
                    </div>
                }
            >
                {Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} className="shadow-lg mb-4 last:mb-0 transition-opacity duration-500">
                        <Page
                            pageNumber={index + 1}
                            width={containerWidth ? containerWidth - 32 : 600}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            className="bg-white"
                            loading={
                                <div className="w-full bg-white animate-pulse aspect-[1/1.41]" />
                            }
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