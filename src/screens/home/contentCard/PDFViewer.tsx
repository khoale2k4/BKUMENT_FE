'use client';

import { useRef, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { IconFileText } from '@tabler/icons-react';

pdfjs.GlobalWorkerOptions.workerSrc =
    `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfPreviewProps {
    url: string;
}

export default function PdfPreview({ url }: PdfPreviewProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [file, setFile] = useState<Blob | null>(null);
    const [hasError, setHasError] = useState(false);
    const [isPdf, setIsPdf] = useState(true);

    useEffect(() => {
        if (ref.current) {
            setWidth(ref.current.clientWidth);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function loadFile() {
            try {
                const res = await fetch(url);

                if (!res.ok) throw new Error('Fetch failed');

                const contentType = res.headers.get('content-type') || '';

                if (!contentType.includes('application/pdf')) {
                    setIsPdf(false);
                    return;
                }

                const blob = await res.blob();
                if (!cancelled) setFile(blob);
            } catch {
                if (!cancelled) setHasError(true);
            }
        }

        loadFile();
        return () => {
            cancelled = true;
        };
    }, [url]);

    if (!isPdf) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500 rounded border border-gray-200">
                <IconFileText size={24} className="mb-1 opacity-50" />
                <span className="text-xs font-medium uppercase tracking-wide opacity-60">No Preview</span>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 rounded border border-gray-200">
                <span className="text-xs">Lỗi hiển thị</span>
            </div>
        );
    }

    return (
        <div ref={ref} className="w-full h-full overflow-hidden">
            {width > 0 && file && (
                <Document file={file}>
                    <Page
                        pageNumber={1}
                        width={width}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                </Document>
            )}
        </div>
    );
}
