import PeopleProfileLayout from '@/screens/people/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "User Profile | VBook",
  description: "Social media for education",
};

interface PageProps {
  params: Promise<{
    id: string; 
  }>;
}

// 2. Thêm 'async' vào function
export default async function PeopleProfilePage({ params }: PageProps) {
  // 3. Dùng await để "mở khóa" params
  const resolvedParams = await params;

  return (
    <main>
       <PeopleProfileLayout userId={resolvedParams.id} />
    </main>
  );
}