'use client';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setTitle } from '@/lib/redux/features/blogSlice';

export default function PostTitleInput() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const title = useAppSelector(state => state.blogs.title);

    return (
        <input
            type="text"
            placeholder={t('blogs.write.titlePlaceholder', 'Post title')}
            className="w-full text-4xl md:text-5xl font-extrabold text-gray-900 placeholder:text-gray-300 border-none outline-none focus:ring-0 bg-transparent py-2 mb-6 leading-tight"
            value={title}
            onChange={(e) => dispatch(setTitle(e.target.value))}
            autoFocus
        />
    );
}