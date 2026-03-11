
import FollowersPage from '@/screens/profile/followerList/page';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Home | VBook",
  description: "Social media for education",
};

export default function HomeApp() {
  return (
    <div>
<FollowersPage/>
    </div>
  );
}