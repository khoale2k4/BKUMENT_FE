'use client';

import React from 'react';
import { Search } from 'lucide-react';

const MembersTab = () => {
  const adminModerators = [
    { name: 'Ly Thanh Nhat Quang', followers: '88K', following: '1', date: '30 May', avatar: 'https://i.pravatar.cc/150?u=quang' },
    { name: 'Tran Thanh Phuc', followers: '88K', following: '1', date: '30 May', avatar: 'https://i.pravatar.cc/150?u=phuc' },
  ];

  const commonMembers = [
    { name: 'Le Vo Dang Khoa', followers: '88K', following: '1', date: '30 May', avatar: 'https://i.pravatar.cc/150?u=khoa' },
    { name: 'Ly Thanh Nhat Quang', followers: '88K', following: '1', date: '30 May', avatar: 'https://i.pravatar.cc/150?u=quang2' },
    { name: 'Tran Thanh Phuc', followers: '88K', following: '1', date: '30 May', avatar: 'https://i.pravatar.cc/150?u=phuc2' },
    { name: 'Ly Thanh Nhat Quang', followers: '88K', following: '1', date: '30 May', avatar: 'https://i.pravatar.cc/150?u=quang3' },
    { name: 'Tran Thanh Phuc', followers: '88K', following: '1', date: '30 May', avatar: 'https://i.pravatar.cc/150?u=phuc3' },
  ];

  return (
    <div className="w-full bg-white font-serif text-[#1c1e21]">
      {/* Header Info */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">Members : 300,005</h2>
        <p className="text-sm text-gray-500">New people and Pages who join this group will appear here</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-10">
        <input
          type="text"
          placeholder="Find a member"
          className="w-full py-3 px-5 pr-12 bg-gray-50 border border-gray-200 rounded-full text-base focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all"
        />
        <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
      </div>

      {/* Admin & Moderators Section */}
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-6">Admin & moderators</h3>
        <div className="space-y-6">
          {adminModerators.map((member, idx) => (
            <MemberItem key={`admin-${idx}`} member={member} />
          ))}
        </div>
      </section>

      {/* Members Section */}
      <section className="mb-10">
        <h3 className="text-lg font-bold mb-6">Members</h3>
        <div className="space-y-6">
          {commonMembers.map((member, idx) => (
            <MemberItem key={`member-${idx}`} member={member} />
          ))}
        </div>
      </section>

      {/* See All Button */}
      <div className="flex justify-center mt-10">
        <button className="px-12 py-2.5 border border-black rounded-full text-base font-bold hover:bg-gray-50 transition-colors">
          See All
        </button>
      </div>
    </div>
  );
};

// Sub-component cho từng dòng member
const MemberItem = ({ member }: { member: any }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-4">
      <img
        src={member.avatar}
        alt={member.name}
        className="w-14 h-14 rounded-full object-cover border border-gray-100 shadow-sm"
      />
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-base hover:underline cursor-pointer">{member.name}</h4>
          <span className="text-xs text-gray-500 font-normal">
            {member.followers} followers • {member.following} following
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-tight">
          Joined from {member.date}
        </p>
      </div>
    </div>
    
  </div>
);

export default MembersTab;