// import BlogDetailPage from '@/screens/blogs/page';
// import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: "Blogs | VBook",
//   description: "Social media for education",
// };

// interface PageProps {
//   params: Promise<{
//     id: string;
//   }>;
// }

// export default function DocumentApp({ params }: PageProps) {
//   return (
//     <BlogDetailPage params={params}/>
//   );
// } 

import BlogDetailPage from '@/screens/blogs/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blogs | VBook",
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
    <BlogDetailPage params={resolvedParams}/>
  );
}