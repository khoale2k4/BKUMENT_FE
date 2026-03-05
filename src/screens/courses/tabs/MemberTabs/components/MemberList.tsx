import React from 'react';
import MemberItem, { CourseMember } from './MemberItem';

interface MemberListProps {
  members: CourseMember[];
}

const MemberList: React.FC<MemberListProps> = ({ members }) => {
  if (members.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 font-sans italic">
        No members found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {members.map((member) => (
        <MemberItem key={member.id} member={member} />
      ))}
    </div>
  );
};

export default MemberList;