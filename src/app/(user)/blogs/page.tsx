import BlogListScreen from "@/screens/blogs/BlogListScreen";

export const metadata = {
    title: 'Bài viết của tôi - VBook',
    description: 'Quản lý các bài viết blog của bạn trên VBook.',
};

export default function MyBlogsPage() {
    return <BlogListScreen />;
}
