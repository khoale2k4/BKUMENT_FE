'use client';
import { Button, Select } from '@mantine/core';
import { IconWorld, IconLock } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setVisibility, submitPost } from '@/lib/redux/features/blogSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppRoute } from '@/lib/appRoutes';
import { showToast } from '@/lib/redux/features/toastSlice';

export default function CreatePostHeader() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { visibility, status, id } = useAppSelector(state => state.blogs);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(status === 'submitting');

    const handlePublish = async () => {
        try {
            await dispatch(submitPost()).unwrap();

            dispatch(
                showToast({
                    type: "success",
                    title: "Thành công!",
                    message: "Đăng bài viết thành công!",
                })
            );

            // chỗ này nối API vô thì ko cần nữa
            // router.push('/blogs/9f30a3ce-a937-42ca-a3e5-faff19931f09'); 

        } catch (error) {
            dispatch(
                showToast({
                    type: "error",
                    title: "Thất bại!",
                    message: "Đăng bài viết không thành công!",
                })
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (status === 'succeeded' && id) {
            router.push(AppRoute.blogs.id(id.toString()));
        }
    }, [status, router]);


    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                </div>

                <div className="flex items-center gap-3">
                    <Select
                        id="post-visibility"
                        placeholder="Visibility"
                        data={[
                            { value: 'PUBLIC', label: 'Công khai' },
                            { value: 'PRIVATE', label: 'Riêng tư' },
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
                        Xuất bản
                    </Button>
                </div>
            </div>
        </header>
    );
}