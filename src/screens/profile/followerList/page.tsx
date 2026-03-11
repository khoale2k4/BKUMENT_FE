'use client';

import { useParams } from 'next/navigation'; // Import hook
import FollowingLayout from '../followingList/components/FollowingLayout';

export default function FollowersPage() {
  // Lấy id từ URL
  const params = useParams();
  const profileId = params.id as string; 

  return (
    <div >
       <FollowingLayout profileId={profileId} listType="followers" />
    </div>
  );
}