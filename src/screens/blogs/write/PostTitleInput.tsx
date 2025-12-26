'use client';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setTitle } from '@/lib/redux/features/blogSlice';

export default function PostTitleInput() {
    const dispatch = useAppDispatch();
    const title = useAppSelector(state => state.blogs.title);

    return (
        <input
            type="text"
            placeholder="Tiêu đề bài viết"
            className="w-full text-4xl md:text-5xl font-extrabold text-gray-900 placeholder:text-gray-300 border-none outline-none focus:ring-0 bg-transparent py-2 mb-6 leading-tight"
            value={title}
            onChange={(e) => dispatch(setTitle(e.target.value))}
            autoFocus
        />
    );
}