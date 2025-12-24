'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchArticles } from '@/lib/redux/features/articleSlice';
import Header from '@/components/layouts/Header';
import Sidebar from '@/components/layouts/Sidebar';
import clsx from 'clsx';
import ArticleCardSkeleton from './card/articalecard-skeleton';
import ArticleCard from './card/articalecard';
import Footer from '@/components/layouts/Footer';

export default function HomePage() {
    const dispatch = useAppDispatch();
    const { items, status } = useAppSelector((state) => state.articles);

    const [activeTab, setActiveTab] = useState('Following');

    const tabs = ['Following', 'Recommanded'];

    const onTabChange = (tab: string) => {
        setActiveTab(tab);
        dispatch(fetchArticles());
    }

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchArticles());
        }
    }, [dispatch, status, activeTab]);

    return (
        <>
            <main className="flex-1 px-4 py-8 md:px-12 transition-all duration-300 min-w-0">

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

                <div className="max-w-3xl">
                    {status === 'loading' && (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <ArticleCardSkeleton key={"skeleton-" + i} />
                            ))}
                        </div>
                    )}

                    {status === 'succeeded' && (
                        <div className="divide-y divide-gray-100">
                            {items.map((article: any) => (
                                <ArticleCard key={article.id} data={article} />
                            ))}
                        </div>
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
        </>
    );
}