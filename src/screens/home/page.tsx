'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchFeed, resetFeed, searchKeyword, clearSearch } from '@/lib/redux/features/articleSlice';
import clsx from 'clsx';
import Pagination from '@/components/ui/Pagination';
import ContentCardSkeleton from './contentCard/ContentCardSkeleton';
import ContentCard from './contentCard/ContentCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppRoute } from '@/lib/appRoutes';
import { showToast } from '@/lib/redux/features/toastSlice';
import { Frown } from 'lucide-react';
import { getAccessToken } from '@/lib/utils/token';

export default function HomePage() {
    const dispatch = useAppDispatch();
    const { items, status, error, currentPage, totalPages, searchQuery, searchResults, searchStatus } = useAppSelector((state) => state.articles);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState<string | null>(() => getAccessToken());

    const [activeTab, setActiveTab] = useState('Following');

    const tabs = ['Following', 'Documents'];

    const urlSearchQuery = searchParams.get('search');

    useEffect(() => {
        if (urlSearchQuery) {
            const promise = dispatch(searchKeyword({
                query: urlSearchQuery,
                page: 0,
                size: 10
            }));

            promise
                .unwrap()
                .then(() => {
                    console.log("Search completed successfully");
                })
                .catch((serializedError) => {
                    if (serializedError.name !== 'AbortError') {
                        console.error("Search failed:", serializedError);
                        dispatch(showToast({
                            type: 'error',
                            title: 'Error',
                            message: 'Search failed. Please try again.'
                        }));
                    }
                });

            return () => {
                promise.abort();
            };
        } else {
            // Normal feed fetch
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
            };
        }
    }, [urlSearchQuery, activeTab, currentPage, dispatch]);

    const onTabChange = (tab: string) => {
        if (tab === activeTab) return;

        // Clear search when switching tabs
        if (urlSearchQuery) {
            router.push('/home');
            dispatch(clearSearch());
        }

        setActiveTab(tab);
        dispatch(resetFeed());
    };

    const onBlogClick = (id: string) => {
        router.push(AppRoute.blogs.id(id));
    }

    const onDocumentClick = (id: string) => {
        router.push(AppRoute.documents.id(id));
    }

    const isSearching = !!urlSearchQuery;
    const displayStatus = isSearching ? searchStatus : status;
    const displayItems = isSearching ? searchResults : items;

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
            Search: {
                title: 'Không tìm thấy kết quả',
                desc: `Không tìm thấy kết quả nào cho "${urlSearchQuery}".`,
            },
        };

        const { title, desc } = messageMap[isSearching ? 'Search' : tab] ?? messageMap.Following;

        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <Frown />
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
                {/* Show search indicator */}
                {isSearching && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-900">
                                    Kết quả tìm kiếm cho: <span className="font-bold">"{urlSearchQuery}"</span>
                                </p>
                                <p className="text-xs text-blue-700 mt-1">
                                    {searchResults.length} kết quả được tìm thấy
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    router.push('/home');
                                    dispatch(clearSearch());
                                }}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Xóa tìm kiếm
                            </button>
                        </div>
                    </div>
                )}

                {/* Only show tabs when not searching */}
                {!isSearching && (
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
                )}

                <div>
                    {displayStatus === 'failed' && (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <Frown className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
                            <p className="text-gray-500 mb-6 max-w-sm">
                                {error || "We couldn't load the feed. Please try again later."}
                            </p>
                            <button
                                onClick={() => {
                                    if (isSearching) {
                                        dispatch(searchKeyword({ query: urlSearchQuery!, page: 0, size: 10 }));
                                    } else {
                                        dispatch(fetchFeed({ category: activeTab, page: currentPage }));
                                    }
                                }}
                                className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {displayStatus !== 'succeeded' && displayStatus !== 'idle' && displayStatus !== 'failed' && (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <ContentCardSkeleton key={"skeleton-" + i} />
                            ))}
                        </div>
                    )}

                    {displayStatus === 'succeeded' && (
                        <>
                            {displayItems.length === 0 ? (
                                <EmptyState tab={activeTab} />
                            ) : (
                                <>
                                    <div className="divide-y divide-gray-100">
                                        {displayItems.map((content: any) => (
                                            <ContentCard
                                                key={content.id}
                                                data={{
                                                    ...content,
                                                    token: token,
                                                    onClick: () => onDocumentClick(content.id),
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <Pagination
                                        currentPage={currentPage + 1}
                                        totalPages={totalPages}
                                        onPageChange={(newPage) => {
                                            if (isSearching) {
                                                dispatch(searchKeyword({
                                                    query: urlSearchQuery!,
                                                    page: newPage - 1,
                                                    size: 10
                                                }));
                                            } else {
                                                dispatch(fetchFeed({
                                                    category: activeTab,
                                                    page: newPage - 1
                                                }));
                                            }
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