import FileUpload from '@/screens/documents/upload/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Documents | VBook",
    description: "Social media for education",
};

export default async function DocumentUploadApp() {
    return (
        <FileUpload />
    );
}