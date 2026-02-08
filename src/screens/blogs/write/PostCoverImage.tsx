'use client';
import { useRef, useState } from 'react';
import { IconPlus, IconX } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setCoverImage, uploadImage } from '@/lib/redux/features/blogSlice';
import { AuthenticatedImage } from '../../../components/ui/AuthenticatedImage';

export default function PostCoverImage() {
    const dispatch = useAppDispatch();
    const coverImage = useAppSelector(state => state.blogs.coverImage);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await dispatch(uploadImage(file)).unwrap();
            dispatch(setCoverImage(url));
        } catch (err) {
            alert('Upload failed');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="mb-8">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

            {!coverImage && !isUploading && (
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-gray-400 hover:text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                    <IconPlus size={16} stroke={1.5} />
                    <span>Thêm ảnh bìa</span>
                </button>
            )}

            {isUploading && (
                <div className="w-full h-48 bg-gray-50 rounded-lg flex items-center justify-center animate-pulse">
                    <span className="text-sm text-gray-400">Đang tải ảnh lên...</span>
                </div>
            )}

            {coverImage && (
                <div className="relative w-full group animate-in fade-in">
                    <div className="aspect-[21/9] w-full overflow-hidden rounded-lg border border-gray-100">
                        <AuthenticatedImage src={coverImage} className="w-full h-full object-cover" />
                    </div>
                    <button
                        onClick={() => dispatch(setCoverImage(null))}
                        className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-gray-600 hover:text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <IconX size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}