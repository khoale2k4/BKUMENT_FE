import CourseOverview from '@/screens/courses/page';
import HomePage from '@/screens/home/page';
import ProfilePage from '@/screens/profile/page';
import TutorDetailPage from '@/screens/tutors/tutorDetail.tsx/page';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Home | VBook",
  description: "Social media for education",
};

export default function HomeApp() {
  return (
    <div>
        <TutorDetailPage/>
    </div>
  );
}