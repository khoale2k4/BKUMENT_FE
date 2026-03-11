import CoursePage from '@/screens/courses/page';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Home | VBook",
  description: "Social media for education",
};

export default function HomeApp() {
  return (
    <div>
      <CoursePage/>
    </div>
  );
}