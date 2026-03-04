
import EditCoursePage from '@/screens/courses/editCourse/page';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Edit Course | VBook",
  description: "Edit your course details",
};

export default function HomeApp() {
  return (
    <div>
        <EditCoursePage/>
    </div>
  );
}