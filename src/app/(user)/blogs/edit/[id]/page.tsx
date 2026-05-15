
'use client';
// 1. Nhớ import thêm hook `use` từ react
import React, { useEffect, use } from 'react'; 
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchPost, resetEditor } from '@/lib/redux/features/blogSlice';
import { Loader2 } from 'lucide-react';

// // Chú ý: Bạn hãy sửa lại các đường dẫn import này cho đúng với thư mục components của bạn nhé
import CreatePostHeader from '../../../../../screens/blogs/write/CreatePostHeader'; // Ví dụ đường dẫn
import PostCoverImage from '../../../../../screens/blogs/write/PostCoverImage';
import PostTitleInput from '../../../../../screens/blogs/write/PostTitleInput';
import TiptapEditor from '../../../../../screens/blogs/write/TiptapEditor';

// 2. Định nghĩa lại kiểu dữ liệu của params thành Promise
interface EditBlogPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
    // 3. Sử dụng React.use() để "mở khóa" params
    const resolvedParams = use(params);
    const blogId = resolvedParams.id;

    const dispatch = useAppDispatch();
    const { status } = useAppSelector(state => state.blogs);

    useEffect(() => {
        // 4. Sử dụng blogId thay vì params.id
        if (blogId) {
            dispatch(fetchPost(blogId));
        }

        return () => {
            dispatch(resetEditor());
        };
    }, [dispatch, blogId]); // Cập nhật dependency

    if (status === 'getting' || status === 'idle') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-3 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    <span className="text-sm font-medium">Đang tải dữ liệu bài viết...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <CreatePostHeader />
            <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500">
                <PostCoverImage />
                <PostTitleInput />
                <TiptapEditor />
            </main>
        </div>
    );
}