'use client';
import { Button, Select, ActionIcon } from '@mantine/core';
import { IconChevronLeft, IconWorld, IconLock } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setVisibility, submitPost } from '@/lib/redux/features/blogSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppRoute } from '@/lib/appRoutes';

export default function CreatePostHeader() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { visibility, status, id } = useAppSelector(state => state.blogs);
    const isSubmitting = status === 'submitting';

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
                        onClick={() => {
                            console.log("Submiting");
                            dispatch(submitPost());
                        }}
                    >
                        Xuất bản
                    </Button>
                </div>
            </div>
        </header>
    );
}