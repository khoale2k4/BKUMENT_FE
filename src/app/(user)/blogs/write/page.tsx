import CreatePostPage from '@/screens/blogs/write/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Blogs | VBook",
    description: "Social media for education",
};

export default async function BlogWriteApp() {
    return (
        <CreatePostPage />
    );
}