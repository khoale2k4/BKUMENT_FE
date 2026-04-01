'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchMyBlogs, resetMyBlogs } from '@/lib/redux/features/myBlogSlice';
import ContentCard from '../home/contentCard/ContentCard';
import ContentCardSkeleton from '../home/contentCard/ContentCardSkeleton';
import Pagination from '@/components/ui/Pagination';
import { Frown, PenTool } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AppRoute } from '@/lib/appRoutes';

const PAGE_SIZE = 10;

export default function BlogListScreen() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { items, status, currentPage, totalPages, totalElements } = useAppSelector((state) => state.myBlogs);
    const { token } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchMyBlogs({ page: 0, size: PAGE_SIZE }));
        return () => {
            dispatch(resetMyBlogs());
        };
    }, [dispatch]);

    const handlePageChange = (newPage: number) => {
        dispatch(fetchMyBlogs({ page: newPage - 1, size: PAGE_SIZE }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const onBlogClick = (id: string) => {
        router.push(AppRoute.blogs.id(id));
    };

    return (
        <div className="flex w-full items-start justify-center gap-8 min-h-screen">
            <main className="w-full max-w-3xl py-8 px-4">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Bài viết của tôi
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Quản lý {totalElements} bài viết bạn đã chia sẻ.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push(AppRoute.blogs.write)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all cursor-pointer shadow-lg shadow-gray-200"
                    >
                        <PenTool size={18} />
                        Viết bài mới
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
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Không thể tải bài viết</h3>
                        <p className="text-gray-500 mb-6">Đã có lỗi xảy ra trong quá trình tải dữ liệu.</p>
                        <button
                            onClick={() => dispatch(fetchMyBlogs({ page: 0, size: PAGE_SIZE }))}
                            className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                            Thử lại
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
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Bạn chưa có bài viết nào</h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                    Hãy chia sẻ suy nghĩ và kiến thức của bạn bằng cách viết bài blog đầu tiên ngay nhé!
                                </p>
                                <button
                                    onClick={() => router.push(AppRoute.blogs.write)}
                                    className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all cursor-pointer shadow-xl shadow-gray-200"
                                >
                                    Bắt đầu viết bài
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {items.map((blog) => (
                                    <ContentCard
                                        key={blog.id}
                                        data={{
                                            id: blog.id,
                                            title: blog.name || blog.title,
                                            content: blog.content || '',
                                            coverImage: blog.coverImage,
                                            author: {
                                                id: blog.author.id,
                                                name: blog.author.name,
                                                avatarUrl: blog.author.avatarUrl
                                            },
                                            type: 'BLOG',
                                            time: blog.createdAt ? blog.createdAt.toString() : '',
                                            tags: ['Blog'],
                                            onClick: () => onBlogClick(blog.id),
                                            token: token || ''
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
                    <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Mẹo viết Blog</h3>
                    <ul className="space-y-4">
                        <li className="flex gap-3 items-start">
                            <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">1</div>
                            <p className="text-sm text-gray-600 leading-relaxed">Tiêu đề hấp dẫn sẽ giúp bài viết của bạn nhận được nhiều lượt xem hơn.</p>
                        </li>
                        <li className="flex gap-3 items-start">
                            <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">2</div>
                            <p className="text-sm text-gray-600 leading-relaxed">Sử dụng hình ảnh minh họa chất lượng để bài viết thêm sinh động.</p>
                        </li>
                        <li className="flex gap-3 items-start">
                            <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">3</div>
                            <p className="text-sm text-gray-600 leading-relaxed">Chia sẻ bài viết lên mạng xã hội để kết nối với nhiều độc giả hơn.</p>
                        </li>
                    </ul>

                    <div className="mt-12 p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl text-white shadow-xl">
                        <h4 className="font-bold mb-2">Trở thành tác giả</h4>
                        <p className="text-xs text-gray-400 leading-relaxed mb-4">Xây dựng thương hiệu cá nhân của bạn thông qua những bài viết giá trị.</p>
                        <button className="w-full py-2 bg-white text-black rounded-xl text-sm font-bold hover:bg-gray-100 transition whitespace-nowrap">
                            Công cụ hỗ trợ
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
}
