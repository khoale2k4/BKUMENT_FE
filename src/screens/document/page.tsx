'use client';
import { Download, Eye, Share2, Bookmark } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useEffect } from 'react';
import { clearCurrentDocument, fetchCommentsByDocId, fetchDocumentById } from '@/lib/redux/features/documentSlice';
import CommentSection from './commentSection/page';

const PDFViewer = dynamic(() => import('./pdfViewer/page'), {
    ssr: false,
});

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
    const dispatch = useAppDispatch();

    const { currentDocument, detailStatus } = useAppSelector((state) => state.documents);

    useEffect(() => {
        if (params.id) {
            dispatch(fetchDocumentById(params.id));
            dispatch(fetchCommentsByDocId(params.id));
        }

        return () => {
            dispatch(clearCurrentDocument());
        };
    }, [params.id, dispatch]);

    if (detailStatus === 'loading' || !currentDocument) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (detailStatus === 'failed') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-gray-500">Không tìm thấy tài liệu.</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white pb-20">

            <div className="max-w-4xl mx-auto px-4 pt-10 pb-6">
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        Documents
                    </span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-500 text-xs">Software Testing</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight text-center md:text-left">
                    {currentDocument.title}
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 shrink-0">
                            <img src={currentDocument.author.avatar} alt={currentDocument.author.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900">{currentDocument.author.name}</div>
                            <div className="text-xs text-gray-500">{currentDocument.author.role} • {currentDocument.stats.date}</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:opacity-80 transition cursor-pointer"
                            onClick={() => window.open(currentDocument.fileUrl, '_blank')}
                        >
                            <Download size={18} />
                            <span>Download</span>
                        </button>
                        <button className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition">
                            <Bookmark size={20} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed text-justify">
                        {currentDocument.description}
                    </p>
                </div>

                <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mb-8 shadow-sm">
                    <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between text-xs">
                        <span>{currentDocument.stats.pages} Pages</span>
                        <div className="flex gap-4">
                            <span className="cursor-pointer hover:text-gray-300">-</span>
                            <span>100%</span>
                            <span className="cursor-pointer hover:text-gray-300">+</span>
                        </div>
                    </div>

                    <div className="w-full aspect-[3/4] md:aspect-[16/9] bg-white relative">
                        <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mb-8 shadow-sm">
                            <div className="w-full bg-gray-200 min-h-[500px]">
                                <PDFViewer fileUrl={currentDocument.fileUrl} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-6 text-gray-500 text-sm border-b border-gray-100 pb-8 mb-8">
                    <div className="flex items-center gap-2">
                        <Eye size={18} />
                        <span>{currentDocument.stats.views.toLocaleString()} Views</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Download size={18} />
                        <span>{currentDocument.stats.downloads.toLocaleString()} Downloads</span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4">
                <CommentSection params={params} />
            </div>
        </main>
    );
}