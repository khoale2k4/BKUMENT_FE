'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { resetEditor } from '@/lib/redux/features/blogSlice';
import CreatePostHeader from './CreatePostHeader';
import PostCoverImage from './PostCoverImage';
import PostTitleInput from './PostTitleInput';
import TiptapEditor from './TiptapEditor';


export default function CreatePostPage() {
    const dispatch = useAppDispatch();

    // useEffect(() => {
    //     return () => {
    //         dispatch(resetEditor());
    //     };
    // }, [dispatch]);

    useEffect(() => {
        // Chỉ gọi resetEditor ngay khi component được render lần đầu (Mount)
        // Để đảm bảo mỗi lần vào trang tạo bài mới là một trang trắng.
        dispatch(resetEditor());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans pb-20">
            <CreatePostHeader />

            <main className="max-w-4xl mx-auto mt-8 px-4 sm:px-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 sm:p-12 min-h-[80vh]">
                    
                    <PostCoverImage />

                    <PostTitleInput />

                    <TiptapEditor />
                </div>
            </main>
        </div>
    );
}