'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchFeed, resetFeed } from '@/lib/redux/features/articleSlice';
import clsx from 'clsx';
import Pagination from '@/components/ui/Pagination';
import ContentCardSkeleton from './contentCard/ContentCardSkeleton';
import ContentCard from './contentCard/ContentCard';
import { useRouter } from 'next/navigation';
import { AppRoute } from '@/lib/appRoutes';
import { showToast } from '@/lib/redux/features/toastSlice';
import { Frown } from 'lucide-react';

export default function HomePage() {
    const dispatch = useAppDispatch();
    const { items, status, currentPage, totalPages } = useAppSelector((state) => state.articles);
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('Following');

    const tabs = ['Following', 'Recommended', 'Documents'];

    useEffect(() => {
        const promise = dispatch(fetchFeed({
            category: activeTab,
            page: currentPage
        }));

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
    }, [activeTab, currentPage, dispatch]);

    const onTabChange = (tab: string) => {
        if (tab === activeTab) return;

        setActiveTab(tab);
        dispatch(resetFeed());
    };

    const onBlogClick = (id: string) => {
        router.push(AppRoute.blogs.id(id));
    }

    const onDocumentClick = (id: string) => {
        router.push(AppRoute.documents.id(id));
    }

    function EmptyState({ tab }: { tab: string }) {
        const messageMap: Record<string, { title: string; desc: string }> = {
            Following: {
                title: 'Chưa có nội dung',
                desc: 'Hãy theo dõi thêm tác giả để xem bài viết mới.',
            },
            Recommended: {
                title: 'Chưa có đề xuất',
                desc: 'Chúng tôi sẽ gợi ý nội dung phù hợp hơn sớm thôi.',
            },
            Documents: {
                title: 'Chưa có tài liệu',
                desc: 'Hiện chưa có tài liệu nào được chia sẻ.',
            },
        };

        const { title, desc } = messageMap[tab] ?? messageMap.Following;

        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <Frown/>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                    {desc}
                </p>
            </div>
        );
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
                            {items.length === 0 ? (
                                <EmptyState tab={activeTab} />
                            ) : (
                                <>
                                    <div className="divide-y divide-gray-100">
                                        {items.map((content: any) => (
                                            <ContentCard
                                                key={content.id}
                                                data={{
                                                    ...content,
                                                    onClick: activeTab === 'Documents'
                                                        ? () => onDocumentClick(content.id)
                                                        : () => onBlogClick(content.id),
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <Pagination
                                        currentPage={currentPage + 1}
                                        totalPages={totalPages}
                                        onPageChange={(newPage) => {
                                            dispatch(fetchFeed({
                                                category: activeTab,
                                                page: newPage - 1
                                            }));
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                    />
                                </>
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