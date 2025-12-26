'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchFeed } from '@/lib/redux/features/articleSlice';
import clsx from 'clsx';
import Pagination from '@/components/ui/Pagination';
import ContentCardSkeleton from './contentCard/ContentCardSkeleton';
import ContentCard from './contentCard/ContentCard';
import { useRouter } from 'next/navigation';
import { AppRoute } from '@/lib/appRoutes';
import { showToast } from '@/lib/redux/features/toastSlice'; // Giả sử bạn có toast

export default function HomePage() {
    const dispatch = useAppDispatch();
    const { items, status, currentPage, totalPages } = useAppSelector((state) => state.articles);
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('Following');
    const [page, setPage] = useState(1);

    const tabs = ['Following', 'Recommended', 'Documents'];

    useEffect(() => {
        const promise = dispatch(fetchFeed({ category: activeTab, page: page }));

        promise
            .unwrap()
            .then((originalPromiseResult) => {
                console.log("Fetched data successfully:", originalPromiseResult);
            })
            .catch((serializedError) => {
                if (serializedError.name !== 'AbortError') {
                    console.error("Fetch failed:", serializedError);
                    dispatch(showToast({
                        type: 'error',
                        title: 'Error',
                        message: 'Failed to load feed. Please try again.'
                    }));
                }
            });

        return () => {
            promise.abort();
        }
    }, [activeTab, page, dispatch]);

    const onTabChange = (tab: string) => {
        if (tab === activeTab) return;
        setActiveTab(tab);
        setPage(1);
    }

    const onPageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const onDocumentClick = (id: string) => {
        router.push(AppRoute.documents.id(id));
    }

    return (
        <div className="flex w-full items-start justify-center gap-8">
            <main className="w-full max-w-3xl py-8 transition-all duration-300">
                <div className="flex items-center gap-8 mb-8 border-b border-gray-100 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab)}
                            className={clsx(
                                "pb-4 text-sm font-medium whitespace-nowrap transition-all border-b-2",
                                activeTab === tab
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-black"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div>
                    {status !== 'succeeded' && status !== 'idle' && (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <ContentCardSkeleton key={"skeleton-" + i} />
                            ))}
                        </div>
                    )}

                    {status === 'succeeded' && (
                        <>
                            <div className="divide-y divide-gray-100">
                                {items.map((content: any) => (
                                    <ContentCard
                                        key={content.id}
                                        data={{
                                            ...content,
                                            onClick: (activeTab === 'Documents' ? () => onDocumentClick(content.id) : null)
                                        }}
                                    />
                                ))}
                            </div>

                            {items.length > 0 && (
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={onPageChange}
                                />
                            )}
                        </>
                    )}
                </div>
            </main>

            <aside className="hidden xl:block w-80 pl-10 py-8 border-l border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Recommended topics</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                    {['Technology', 'Money', 'Business', 'Productivity', 'Art', 'Mindfulness'].map(tag => (
                        <span
                            key={tag}
                            className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-700 cursor-pointer hover:bg-gray-200 transition"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </aside>
        </div>
    );
}