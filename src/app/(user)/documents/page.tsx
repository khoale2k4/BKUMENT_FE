import DocumentListScreen from "@/screens/documents/DocumentListScreen";

export const metadata = {
    title: 'Tài liệu của tôi - VBook',
    description: 'Quản lý các tài liệu học tập của bạn trên VBook.',
};

export default function MyDocumentsPage() {
    return <DocumentListScreen />;
}
