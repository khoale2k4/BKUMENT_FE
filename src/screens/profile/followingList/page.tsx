'use client';

import { useParams } from 'next/navigation'; // Import hook
import FollowingLayout from './components/FollowingLayout';

export default function FollowingPage() {
  // Lấy id từ URL
  const params = useParams();
  const profileId = params.id as string; 

  return (
    <div >
       <FollowingLayout profileId={profileId} listType="followings" />
    </div>
  );
}