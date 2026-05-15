import { useTranslation } from 'react-i18next';
import { Button, Select } from '@mantine/core';
import { IconWorld, IconLock } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setVisibility, submitPost, updateBlogAsync } from '@/lib/redux/features/blogSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppRoute } from '@/lib/appRoutes';
import { showToast } from '@/lib/redux/features/toastSlice';
import { resetEditor } from '@/lib/redux/features/blogSlice';

export default function CreatePostHeader() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const router = useRouter();
    //const { visibility, status, id } = useAppSelector(state => state.blogs);
    const { visibility, status, id, title, contentHTML, coverImage, assetIds } = useAppSelector(state => state.blogs);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(status === 'submitting');

    const handlePublish = async () => {
        // Validate input
        if (!title.trim()) {
            dispatch(
                showToast({
                    type: "error",
                    title: t('blogs.write.header.failTitle', 'Failed!'),
                    message: t('errors.titleRequired', 'Title is required'),
                })
            );
            return;
        }

        if (!contentHTML.trim()) {
            dispatch(
                showToast({
                    type: "error",
                    title: t('blogs.write.header.failTitle', 'Failed!'),
                    message: t('errors.contentRequired', 'Content is required'),
                })
            );
            return;
        }

        setIsSubmitting(true);
        try {
            let finalBlogId = id; // Biến lưu ID bài viết để chuyển trang

            if (id) {
                // ĐÃ CÓ ID => ĐANG EDIT => Gọi thunk Update
                await dispatch(updateBlogAsync({
                    id,
                    title,
                    contentHTML,
                    coverImage,
                    visibility,
                    assetIds: assetIds || [],
                    topicId: "INT1005"
                })).unwrap();

                dispatch(
                    showToast({
                        type: "success",
                        title: t('blogs.write.header.successTitle', 'Success!'),
                        message: t('blogs.detail.updateSuccess', 'Post updated successfully!'),
                    })
                );

                dispatch(resetEditor());
            } else {
                // CHƯA CÓ ID => TẠO MỚI => Gọi thunk Submit
                const result = await dispatch(submitPost()).unwrap();
                finalBlogId = result.id; // Lấy ID của bài viết vừa được tạo mới từ API trả về

                dispatch(
                    showToast({
                        type: "success",
                        title: t('blogs.write.header.successTitle', 'Success!'),
                        message: t('blogs.write.header.successMsg', 'Post published successfully!'),
                    })
                );
            }

            // 👉 Chuyển hướng trực tiếp ở đây sau khi thao tác API thành công 100%
            if (finalBlogId) {
                router.push(AppRoute.blogs.id(finalBlogId.toString()));
            }

        } catch (error: any) {
            if (error && typeof error === 'string') {
                dispatch(
                    showToast({
                        type: "error",
                        title: t('blogs.write.header.failTitle', 'Failed!'),
                        message: error,
                    })
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // useEffect(() => {
    //     if (status === 'succeeded' && id) {
    //         console.log("Redirecting to blog detail page with id:", id);
    //         router.push(AppRoute.blogs.id(id.toString()));
    //     }
    // }, [status, id, router]);


    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                </div>

                <div className="flex items-center gap-3">
                    <Select
                        id="post-visibility"
                        placeholder={t('blogs.write.header.visibility', 'Visibility')}
                        data={[
                            { value: 'PUBLIC', label: t('blogs.write.header.public', 'Public') },
                            { value: 'PRIVATE', label: t('blogs.write.header.private', 'Private') },
                        ]}
                        value={visibility}
                        onChange={(val) => dispatch(setVisibility(val as any))}
                        allowDeselect={false}
                        radius="xl"
                        size="sm"
                        w={140}
                        leftSection={visibility === 'PUBLIC' ? <IconWorld size={16} /> : <IconLock size={16} />}
                        className="font-medium"
                    />

                    <Button
                        radius="xl"
                        size="sm"
                        color="dark"
                        className="px-6 font-medium bg-black hover:bg-gray-800"
                        loading={isSubmitting}
                        onClick={handlePublish}
                    >
                        {isSubmitting ? t('blogs.write.header.publishing', 'Publishing...') : t('blogs.write.header.publish', 'Publish')}
                    </Button>
                </div>
            </div>
        </header>
    );
}