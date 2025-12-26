'use client';
import { Download, Eye, Share2, Bookmark } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useEffect } from 'react';
import { clearCurrentDocument, fetchAuthorById, fetchCommentsByDocId, fetchDocumentById } from '@/lib/redux/features/documentSlice';
import CommentSection from './commentSection/page';

const PDFViewer = dynamic(() => import('./pdfViewer/page'), { ssr: false, });
const WordViewer = dynamic(() => import('./wordViewer/page'), { ssr: false });

const Skeleton = ({ className }: { className: string }) => (
    <div className={`bg-gray-200 animate-pulse rounded ${className}`}></div>
);

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
    const dispatch = useAppDispatch();
    const { currentDocument, currentAuthor, detailStatus, authorStatus } = useAppSelector((state) => state.documents);

    useEffect(() => {
        if (params.id) {
            dispatch(fetchDocumentById(params.id));
            dispatch(fetchAuthorById(params.id));
            dispatch(fetchCommentsByDocId(params.id));
        }

        return () => {
            dispatch(clearCurrentDocument());
        };
    }, [params.id, dispatch]);

    const renderViewer = () => {
        if (detailStatus === 'loading' || !currentDocument) {
            return (
                <div className="flex items-center justify-center h-96 bg-gray-50">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            );
        }

        if (!currentDocument.downloadUrl) return <div className="p-8 text-center text-gray-500">Không có tài liệu</div>;

        const fileExtension = currentDocument.documentType || 'application/pdf'; // Giả sử fallback

        if (fileExtension === 'application/pdf') {
            return (
                <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mb-8 shadow-sm">
                    <PDFViewer fileUrl={currentDocument.downloadUrl} />
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center h-full text-gray-500 p-8">
                Định dạng này không hỗ trợ xem trước. Vui lòng tải về.
            </div>
        );
    };

    if (detailStatus === 'failed') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-gray-500">Không tìm thấy tài liệu.</div>
            </div>
        );
    }

    const isDocLoading = detailStatus === 'loading' || !currentDocument;
    const isAuthorLoading = authorStatus === 'loading' || !currentAuthor;

    return (
        <main className="min-h-screen bg-white pb-20">
            <div className="max-w-4xl mx-auto px-4 pt-10 pb-6">
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        Documents
                    </span>
                    <span className="text-gray-400 text-xs">•</span>
                    {isDocLoading ? (
                        <Skeleton className="h-4 w-32" />
                    ) : (
                        <span className="text-gray-500 text-xs">{currentDocument?.title}</span>
                    )}
                </div>

                {isDocLoading ? (
                    <Skeleton className="h-10 w-3/4 mb-6" />
                ) : (
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight text-center md:text-left">
                        {currentDocument?.title}
                    </h1>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                        {isAuthorLoading ? (
                            <>
                                <Skeleton className="w-12 h-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 shrink-0">
                                    <img src={currentAuthor?.avatar} alt={currentAuthor?.user} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">{currentAuthor?.user}</div>
                                    <div className="text-xs text-gray-500">
                                        {currentDocument?.course
                                            ? `Học ${currentDocument.course} tại ${currentDocument.university}`
                                            : `Học tại ${currentDocument?.university}`
                                        }
                                        {" - "}
                                        {currentDocument?.createdAt && new Date(currentDocument.createdAt).toLocaleDateString("vi-VN")}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center justify-center gap-3">
                        <button
                            disabled={isDocLoading || !currentDocument?.downloadable}
                            onClick={() => currentDocument && window.open(currentDocument.downloadUrl, '_blank')}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition
                                ${!isDocLoading && currentDocument?.downloadable
                                    ? "bg-black text-white hover:opacity-80 cursor-pointer shadow-sm"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }
                            `}
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
                    {isDocLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    ) : (
                        <p className="text-gray-600 leading-relaxed text-justify">
                            {currentDocument?.description}
                        </p>
                    )}
                </div>

                <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mb-8 shadow-sm">
                    <div className="w-full aspect-[3/4] md:aspect-[16/9] bg-white relative">
                        {renderViewer()}
                    </div>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-6 text-gray-500 text-sm border-b border-gray-100 pb-8 mb-8">
                    {isDocLoading ? (
                        <Skeleton className="h-5 w-40" />
                    ) : (
                        <>
                            <div className="flex items-center gap-2">
                                <Eye size={18} />
                                <span>{currentDocument?.downloadCount?.toLocaleString()} Views</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Download size={18} />
                                <span>{currentDocument?.downloadCount?.toLocaleString()} Downloads</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4">
                <CommentSection params={params} />
            </div>
        </main>
    );
}