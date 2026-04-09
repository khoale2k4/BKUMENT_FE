'use client';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchMyDocuments, resetMyDocuments } from '@/lib/redux/features/myDocumentSlice';
import ContentCard from '../home/contentCard/ContentCard';
import ContentCardSkeleton from '../home/contentCard/ContentCardSkeleton';
import Pagination from '@/components/ui/Pagination';
import { Frown, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AppRoute } from '@/lib/appRoutes';

const PAGE_SIZE = 10;

export default function DocumentListScreen() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { items, status, currentPage, totalPages, totalElements } = useAppSelector((state) => state.myDocuments);
    const { token } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchMyDocuments({ page: 0, size: PAGE_SIZE }));
        return () => {
            dispatch(resetMyDocuments());
        };
    }, [dispatch]);

    const handlePageChange = (newPage: number) => {
        dispatch(fetchMyDocuments({ page: newPage - 1, size: PAGE_SIZE }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const onDocumentClick = (id: string) => {
        router.push(AppRoute.documents.id(id));
    };

    return (
        <div className="flex w-full items-start justify-center gap-8 min-h-screen">
            <main className="w-full max-w-3xl py-8 px-4">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {t('documents.list.title', 'My Documents')}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {t('documents.list.subtitle', 'Manage {{count}} documents you have uploaded.', { count: totalElements })}
                        </p>
                    </div>
                    <button
                        onClick={() => router.push(AppRoute.documents.upload)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all cursor-pointer shadow-lg shadow-gray-200"
                    >
                        <Plus size={18} />
                        {t('documents.list.uploadNew', 'Upload New')}
                    </button>
                </div>

                {status === 'loading' && items.length === 0 && (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <ContentCardSkeleton key={'skeleton-' + i} />
                        ))}
                    </div>
                )}

                {status === 'failed' && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500 font-bold text-2xl">!</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{t('documents.list.loadFail', 'Could not load documents')}</h3>
                        <p className="text-gray-500 mb-6">{t('documents.list.loadFailDesc', 'An error occurred while loading data.')}</p>
                        <button
                            onClick={() => dispatch(fetchMyDocuments({ page: 0, size: PAGE_SIZE }))}
                            className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                            {t('documents.list.retry', 'Retry')}
                        </button>
                    </div>
                )}

                {status === 'succeeded' && (
                    <>
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <Frown size={40} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('documents.list.empty', 'You have no documents yet')}</h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                    {t('documents.list.emptyDesc', 'Share your knowledge by uploading useful documents today.')}
                                </p>
                                <button
                                    onClick={() => router.push(AppRoute.documents.upload)}
                                    className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all cursor-pointer shadow-xl shadow-gray-200"
                                >
                                    {t('documents.list.startUpload', 'Start Uploading')}
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {items.map((doc) => (
                                    <ContentCard
                                        key={doc.id}
                                        data={{
                                            id: doc.id,
                                            title: doc.title,
                                            content: doc.description,
                                            coverImage: doc.previewImageUrl,
                                            author: {
                                                id: doc.author.id,
                                                name: doc.author.name,
                                                avatarUrl: doc.author.avatarUrl
                                            },
                                            type: 'DOC',
                                            time: doc.createdAt.toString(),
                                            tags: [doc.documentType || 'Document'],
                                            onClick: () => onDocumentClick(doc.id),
                                            token: token || '',
                                            views: doc.views || 0
                                        }}
                                    />
                                ))}

                                {totalPages > 1 && (
                                    <div className="mt-8">
                                        <Pagination
                                            currentPage={currentPage + 1}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>

            <aside className="hidden xl:block w-80 pl-10 py-8 border-l border-gray-100">
                <div className="sticky top-24">
                    <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">{t('documents.list.tipsTitle', 'Upload Tips')}</h3>
                    <ul className="space-y-4">
                        <li className="flex gap-3 items-start">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">1</div>
                            <p className="text-sm text-gray-600 leading-relaxed">{t('documents.list.tip1', 'Use clear titles, including subject names and key content.')}</p>
                        </li>
                        <li className="flex gap-3 items-start">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">2</div>
                            <p className="text-sm text-gray-600 leading-relaxed">{t('documents.list.tip2', 'Select the correct university and subject so others can easily find it.')}</p>
                        </li>
                        <li className="flex gap-3 items-start">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">3</div>
                            <p className="text-sm text-gray-600 leading-relaxed">{t('documents.list.tip3', 'A brief description will help increase downloads and your points.')}</p>
                        </li>
                    </ul>

                    <div className="mt-12 p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl text-white shadow-xl">
                        <h4 className="font-bold mb-2">{t('documents.list.pointsTitle', 'Earn Rewards')}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed mb-4">{t('documents.list.pointsDesc', 'Receive points when your documents are downloaded or highly rated.')}</p>
                        <button className="w-full py-2 bg-white text-black rounded-xl text-sm font-bold hover:bg-gray-100 transition whitespace-nowrap">
                            {t('documents.list.detailsBtn', 'Mechanism Details')}
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
}
