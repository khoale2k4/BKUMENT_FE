'use client';
import { Button, Select } from '@mantine/core';
import { IconWorld, IconLock } from '@tabler/icons-react';
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

<<<<<<< HEAD
    const handlePublish = async () => {
        try {
            // 1. Gọi dispatch và dùng unwrap() để chờ kết quả trả về
            // Nếu validation trong thunk thất bại (thiếu title/content), nó sẽ nhảy xuống catch
            await dispatch(submitPost()).unwrap();

            // 2. Nếu thành công, chuyển hướng sang trang chi tiết
            // Vì là mock data, ta chuyển sang một đường dẫn giả định, ví dụ ID là 'preview-new'
            // Đảm bảo bạn đã có file page xử lý đường dẫn này (vd: app/blog/[id]/page.tsx) blogs/9f30a3ce-a937-42ca-a3e5-faff19931f09
            router.push('/blogs/9f30a3ce-a937-42ca-a3e5-faff19931f09'); 

        } catch (error) {
            // 3. Xử lý lỗi (ví dụ: chưa nhập tiêu đề)
            // Bạn có thể dùng Mantine notifications ở đây thay vì alert
            alert(error); 
        }
    };
=======
    useEffect(() => {
        if (status === 'succeeded' && id) {
            router.push(AppRoute.blogs.id(id.toString()));
        }
    }, [status, router]);
>>>>>>> 93dd54e3919f111619c531ad07a324ab8603bb13

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Phần bên trái Header (nếu có) */}
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
<<<<<<< HEAD
                        onClick={handlePublish} 
=======
                        onClick={() => {
                            console.log("Submiting");
                            dispatch(submitPost());
                        }}
>>>>>>> 93dd54e3919f111619c531ad07a324ab8603bb13
                    >
                        Xuất bản
                    </Button>
                </div>
            </div>
        </header>
    );
}