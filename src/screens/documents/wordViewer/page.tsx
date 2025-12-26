'use client';

import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

export default function GenericDocViewer({ fileUrl, fileType }: { fileUrl: string, fileType?: string }) {
    const docs = [
        { uri: fileUrl, fileType: fileType }
    ];

    return (
        <div className="w-full h-[600px] bg-gray-100 rounded-xl border border-gray-200 overflow-hidden">
            <DocViewer 
                documents={docs} 
                pluginRenderers={DocViewerRenderers}
                style={{ height: '100%' }}
                config={{
                    header: {
                        disableHeader: true,
                        disableFileName: true,
                        retainURLParams: false
                    }
                }}
            />
        </div>
    );
}