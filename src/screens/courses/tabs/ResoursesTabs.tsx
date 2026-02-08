'use client';

import React from 'react';
import { MoreHorizontal, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';

const ResourcesTab = () => {
  // Mock Data matching the screenshot
  const resources = [
    {
      id: 1,
      author: 'Amit Das',
      avatar: 'https://i.pravatar.cc/150?u=amit',
      date: '4 days ago',
      title: 'Báo cáo môn Software Testing ok',
      description: 'An intense way to learn about the process and practice your designs skills — My 1st hackathon Hackathons have been on my mind since I heard it was a good way to gain experience as a junior UX designer. As my portfolio...',
      tag: 'Software Testing',
      readTime: '3 min read',
      thumbnail: 'https://placehold.co/200x140/f3f4f6/9ca3af?text=Doc+Preview', // Placeholder for document image
      type: 'doc'
    },
    {
      id: 2,
      author: 'Amit Das',
      avatar: 'https://i.pravatar.cc/150?u=amit', // Same author in image
      date: '4 days ago',
      title: 'Đề bài tập lớn môn Kỹ thuật lập trình',
      description: 'An intense way to learn about the process and practice your designs skills — My 1st hackathon Hackathons have been on my mind since I heard it was a good way to gain experience as a junior UX designer. As my portfolio...',
      tag: 'Coding',
      readTime: '3 min read',
      thumbnail: 'https://placehold.co/200x140/f3f4f6/9ca3af?text=Doc+Preview',
      type: 'doc'
    },
    {
      id: 3,
      author: 'Amit Das',
      avatar: 'https://i.pravatar.cc/150?u=amit',
      date: '4 days ago',
      title: 'Chương 8: Hồi quy bội',
      description: 'An intense way to learn about the process and practice your designs skills — My 1st hackathon Hackathons have been on my mind since I heard it was a good way to gain experience as a junior UX designer. As my portfolio...',
      tag: 'Mathematics',
      readTime: '4 min read',
      thumbnail: 'https://placehold.co/200x140/3b49df/ffffff?text=Hồi+quy+bội', // Blue banner style
      type: 'banner'
    },
    {
      id: 4,
      author: 'Amit Das',
      avatar: 'https://i.pravatar.cc/150?u=amit',
      date: '4 days ago',
      title: 'Báo cáo môn Software Testing ok',
      description: 'An intense way to learn about the process and practice your designs skills — My 1st hackathon Hackathons have been on my mind since I heard it was a good way to gain experience as a junior UX designer. As my portfolio...',
      tag: 'Software Testing',
      readTime: '3 min read',
      thumbnail: 'https://placehold.co/200x140/f3f4f6/9ca3af?text=Doc+Preview',
      type: 'doc'
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-8 font-sans">
      <div className="space-y-8">
        {resources.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-8 last:border-0">
            
            {/* Left Content */}
            <div className="flex-1">
              {/* Header: Author Info */}
              <div className="flex items-center gap-2 mb-3">
                <img src={item.avatar} alt={item.author} className="w-6 h-6 rounded-full object-cover" />
                <span className="text-sm font-medium text-gray-900">{item.author}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-400">{item.date}</span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-orange-500 cursor-pointer transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                {item.description}
              </p>

              {/* Footer: Tags & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    {item.tag}
                  </span>
                  <span className="text-xs text-gray-400">{item.readTime}</span>
                  <span className="text-xs text-gray-400 hidden sm:inline">Selected for you</span>
                </div>

                <div className="flex items-center gap-3 text-gray-400">
                  <button className="hover:text-gray-600"><Bookmark size={20} /></button>
                  <button className="hover:text-gray-600"><MoreHorizontal size={20} /></button>
                </div>
              </div>
            </div>

            {/* Right Content: Thumbnail */}
            <div className="w-full md:w-48 h-32 flex-shrink-0">
              <img 
                src={item.thumbnail} 
                alt={item.title} 
                className={`w-full h-full object-cover rounded-md border ${item.type === 'doc' ? 'border-gray-100 p-2 bg-white' : ''}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Section */}
      <div className="flex justify-center items-center mt-12 gap-2 text-sm font-medium">
        <button className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50">
          <ChevronLeft size={16} /> Previous
        </button>
        
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 flex items-center justify-center bg-[#333] text-white rounded-lg">1</button>
          <button className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-lg">2</button>
          <button className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-lg">3</button>
          <span className="w-9 h-9 flex items-center justify-center text-gray-400">...</span>
          <button className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-lg">67</button>
          <button className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-lg">68</button>
        </div>

        <button className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ResourcesTab;