"use client";

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
    fetchFeed, resetFeed, searchKeyword, clearSearch,
    fetchPeopleMayKnow, followPerson, resetPeople,
} from '@/lib/redux/features/articleSlice';
import clsx from 'clsx';
import Pagination from '@/components/ui/Pagination';
import ContentCardSkeleton from './contentCard/ContentCardSkeleton';
import ContentCard from './contentCard/ContentCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppRoute } from '@/lib/appRoutes';
import { showToast } from '@/lib/redux/features/toastSlice';
import { Frown, UserPlus, Check } from 'lucide-react';
import { getAccessToken } from '@/lib/utils/token';
import { PersonMayKnow } from '@/lib/services/article.service';
import { AuthenticatedImage } from '@/components/ui/AuthenticatedImage';

const PAGE_SIZE = 10;
const PEOPLE_PAGE_SIZE = 10;

export default function HomePage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const {
        items, status, error, currentPage, totalPages,
        searchQuery, searchResults, searchStatus, totalItems,
        peopleMayKnow, peopleStatus, peopleCurrentPage, peopleTotalPages,
        followingIds,
    } = useAppSelector((state) => state.articles);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState<string | null>(() => getAccessToken());

    const [activeTab, setActiveTab] = useState('Following');
    const [followingLoading, setFollowingLoading] = useState<Set<string>>(new Set());

    const tabs = ['Following', 'Documents', 'People'];

    const tabToText = (tab: string) => {
        if (tab === 'Following') return t('home.tabs.following', 'Articles');
        if (tab === 'Documents') return t('home.tabs.documents', 'Documents');
        return t('home.tabs.people', 'People');
    };

    const urlSearchQuery = searchParams.get('search');

    useEffect(() => {
        if (activeTab === 'People') return;

        if (urlSearchQuery) {
            const promise = dispatch(searchKeyword({
                query: urlSearchQuery,
                page: 0,
                size: PAGE_SIZE
            }));

            promise
                .unwrap()
                .then(() => { console.log('Search completed successfully'); })
                .catch((serializedError) => {
                    if (serializedError.name !== 'AbortError') {
                        console.error('Search failed:', serializedError);
                        dispatch(showToast({
                            type: 'error',
                            title: t('auth.login.error'),
                            message: t('home.search.fail', 'Search failed. Please try again.'),
                        }));
                    }
                });

            return () => { promise.abort(); };
        } else {
            const promise = dispatch(fetchFeed({
                category: activeTab,
                page: currentPage
            }));

            promise
                .unwrap()
                .then(() => { console.log('Fetched data successfully'); })
                .catch((serializedError) => {
                    if (serializedError.name !== 'AbortError') {
                        console.error('Fetch failed:', serializedError);
                        dispatch(showToast({
                            type: 'error',
                            title: t('auth.login.error'),
                            message: t('home.error.desc', "We couldn't load the feed. Please try again later."),
                        }));
                    }
                });

            return () => { promise.abort(); };
        }
    }, [urlSearchQuery, activeTab, currentPage, dispatch]);

    useEffect(() => {
        if (activeTab !== 'People') return;

        const promise = dispatch(fetchPeopleMayKnow({
            page: peopleCurrentPage,
            size: PEOPLE_PAGE_SIZE,
        }));

        promise.catch((err: any) => {
            if (err?.name !== 'AbortError') {
                dispatch(showToast({
                    type: 'error',
                    title: t('auth.login.error'),
                    message: t('home.error.loadPeopleFail', 'Could not load people list.'),
                }));
            }
        });

        return () => { promise.abort?.(); };
    }, [activeTab, peopleCurrentPage, dispatch]);

    const onTabChange = (tab: string) => {
        if (tab === activeTab) return;

        if (urlSearchQuery) {
            router.push('/home');
            dispatch(clearSearch());
        }

        setActiveTab(tab);
        dispatch(resetFeed());
    };

    const onBlogClick = (id: string) => {
        router.push(AppRoute.blogs.id(id));
    };

    const onDocumentClick = (id: string) => {
        router.push(AppRoute.documents.id(id));
    };

    const onPersonClick = (person: PersonMayKnow) => {
        router.push(`${AppRoute.profile}/${person.id}`);
    };

    const getOnClick = (tab: string) => {
        if (tab === 'Following') return onBlogClick;
        if (tab === 'Documents') return onDocumentClick;
        if (tab === 'People') return onPersonClick;
    }

    const onFollow = async (person: PersonMayKnow) => {
        if (followingIds.includes(person.id) || followingLoading.has(person.id)) return;

        setFollowingLoading(prev => new Set(prev).add(person.id));
        try {
            await dispatch(followPerson(person.id)).unwrap();
            dispatch(showToast({
                type: 'success',
                title: t('auth.login.success'),
                message: t('home.people.followSuccess', 'You are now following {{name}}!', { name: person.fullName }),
            }));
        } catch {
            dispatch(showToast({
                type: 'error',
                title: t('auth.login.error'),
                message: t('home.people.followFail', 'Follow failed. Please try again.'),
            }));
        } finally {
            setFollowingLoading(prev => {
                const next = new Set(prev);
                next.delete(person.id);
                return next;
            });
        }
    };

    const isSearching = !!urlSearchQuery;
    const displayStatus = isSearching ? searchStatus : status;
    const displayItems = isSearching ? searchResults : items;

    function EmptyState({ tab }: { tab: string }) {
        const messageMap: Record<string, { title: string; desc: string }> = {
            Following: {
                title: t('home.empty.following.title', 'No content yet'),
                desc: t('home.empty.following.desc', 'Follow more authors to see new articles.'),
            },
            Recommended: {
                title: t('home.empty.recommended.title', 'No recommendations'),
                desc: t('home.empty.recommended.desc', 'We will suggest relevant content soon.'),
            },
            Documents: {
                title: t('home.empty.documents.title', 'No documents'),
                desc: t('home.empty.documents.desc', 'No documents shared yet.'),
            },
            People: {
                title: t('home.empty.people.title', 'No suggestions'),
                desc: t('home.empty.people.desc', 'No connection suggestions available at the moment.'),
            },
            Search: {
                title: t('home.empty.following.title', 'No search results found'),
                desc: t('home.search.results', 'No results for "{{query}}"', { query: urlSearchQuery }),
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

    function PersonCard({ person }: { person: PersonMayKnow }) {
        const isFollowed = followingIds.includes(person.id);
        const isLoading = followingLoading.has(person.id);

        return (
            <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                <button
                    className="flex items-center gap-3 min-w-0 flex-1 text-left group cursor-pointer"
                    onClick={() => onPersonClick(person)}
                >
                    <div className="relative flex-shrink-0">
                        {person.avatarUrl ? (
                            <AuthenticatedImage
                                src={person.avatarUrl}
                                alt={person.fullName}
                                className={"w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-gray-300 transition"}
                                onError={(e: any) => {
                                    e.currentTarget.src = "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";
                                }}
                            />

                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ring-2 ring-gray-100 group-hover:ring-gray-300 transition">
                                <span className="text-lg font-semibold text-gray-600">
                                    {person.fullName?.charAt(0)?.toUpperCase() ?? '?'}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-black truncate leading-snug">
                            {person.fullName}
                        </p>
                        {person.university && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">{person.university}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">
                            {person.followerCount ?? 0} {t('home.people.followers', 'followers')}
                        </p>
                    </div>
                </button>

                <button
                    onClick={() => onFollow(person)}
                    disabled={isFollowed || isLoading}
                    className={clsx(
                        'ml-4 flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer',
                        isFollowed
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-default'
                            : isLoading
                                ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-wait'
                                : 'bg-black text-white border-black hover:bg-gray-800'
                    )}
                >
                    {isFollowed ? (
                        <><Check className="w-3 h-3" /> {t('home.people.following', 'Following')}</>
                    ) : (
                        <><UserPlus className="w-3 h-3" /> {t('home.people.follow', 'Follow')}</>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="flex w-full items-start justify-center gap-8">
            <main className="w-full max-w-3xl py-8 transition-all duration-300">
                {isSearching && (
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {t('home.search.results', 'Results for "{{query}}"', { query: urlSearchQuery })}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {t('home.search.found', 'Found {{count}} results', { count: totalItems })}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                router.push('/home');
                                dispatch(clearSearch());
                            }}
                            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-200 cursor-pointer"
                        >
                            {t('home.search.clear', 'Clear search')}
                        </button>
                    </div>
                )}

                {!isSearching && (
                    <div className="flex items-center gap-8 mb-8 border-b border-gray-100 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => onTabChange(tab)}
                                className={clsx(
                                    'pb-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 cursor-pointer',
                                    activeTab === tab
                                        ? 'border-black text-black'
                                        : 'border-transparent text-gray-500 hover:text-black'
                                )}
                            >
                                {tabToText(tab)}
                            </button>
                        ))}
                    </div>
                )}

                {/* Feed & Documents Tabs */}
                {activeTab !== 'People' && (
                    <div>
                        {displayStatus === 'failed' && (
                            <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border border-gray-100">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <Frown className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{t('home.error.title', 'Oops! Something went wrong')}</h3>
                                <p className="text-gray-500 mb-6 max-w-sm">
                                    {error || t('home.error.desc', "We couldn't load the feed. Please try again later.")}
                                </p>
                                <button
                                    onClick={() => {
                                        if (isSearching) {
                                            dispatch(searchKeyword({ query: urlSearchQuery!, page: 0, size: PAGE_SIZE }));
                                        } else {
                                            dispatch(fetchFeed({ category: activeTab, page: currentPage }));
                                        }
                                    }}
                                    className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                                >
                                    {t('home.error.retry', 'Try again')}
                                </button>
                            </div>
                        )}

                        {displayStatus !== 'succeeded' && displayStatus !== 'idle' && displayStatus !== 'failed' && (
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <ContentCardSkeleton key={'skeleton-' + i} />
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
                                                        onClick: () => getOnClick(activeTab)?.(content.id),
                                                        views: content.views || 0,
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
                                                        size: PAGE_SIZE
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
                )}

                {/* People May Know Tab */}
                {activeTab === 'People' && (
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-1">{t('home.people.title', 'People you may know')}</h2>
                        <p className="text-sm text-gray-500 mb-6">{t('home.people.desc', 'Discover and connect with other users.')}</p>

                        {peopleStatus === 'loading' && (
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="flex items-center gap-3 py-4 border-b border-gray-100 animate-pulse">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3.5 bg-gray-200 rounded w-32" />
                                            <div className="h-3 bg-gray-100 rounded w-24" />
                                        </div>
                                        <div className="w-20 h-7 bg-gray-200 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {peopleStatus === 'failed' && (
                            <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border border-gray-100">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <Frown className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{t('home.error.desc', "We couldn't load the feed. Please try again later.")}</h3>
                                <button
                                    onClick={() => dispatch(fetchPeopleMayKnow({ page: peopleCurrentPage, size: PEOPLE_PAGE_SIZE }))}
                                    className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                                >
                                    {t('home.error.retry', 'Try again')}
                                </button>
                            </div>
                        )}

                        {peopleStatus === 'succeeded' && (
                            <>
                                {peopleMayKnow.length === 0 ? (
                                    <EmptyState tab="People" />
                                ) : (
                                    <>
                                        <div>
                                            {peopleMayKnow.map((person) => (
                                                <PersonCard key={person.id} person={person} />
                                            ))}
                                        </div>
                                        <Pagination
                                            currentPage={peopleCurrentPage + 1}
                                            totalPages={peopleTotalPages}
                                            onPageChange={(newPage) => {
                                                dispatch(fetchPeopleMayKnow({
                                                    page: newPage - 1,
                                                    size: PEOPLE_PAGE_SIZE,
                                                }));
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </main>

            <aside className="hidden xl:block w-80 pl-10 py-8 border-l border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">{t('home.sidebar.recommended', 'Recommended topics')}</h3>
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