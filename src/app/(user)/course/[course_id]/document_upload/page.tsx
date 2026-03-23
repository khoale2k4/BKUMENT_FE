import FileUpload from '@/screens/documents/upload/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Upload Document | Course | VBook",
    description: "Upload a new document to the course",
};

export default async function CourseDocumentUploadPage() {
    return (
        <FileUpload />
    );
}
