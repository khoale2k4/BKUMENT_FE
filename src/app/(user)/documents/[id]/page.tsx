import DocumentPage from '@/screens/document/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Documents | VBook",
  description: "Social media for education",
};

interface PageProps {
  params: {
    id: string;
  };
}

export default async function DocumentApp({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <DocumentPage params={resolvedParams}/>
  );
}