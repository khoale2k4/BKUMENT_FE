import React from 'react';
import { Search } from 'lucide-react';

interface MemberSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const MemberSearch: React.FC<MemberSearchProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative mb-10">
      <input
        type="text"
        placeholder="Find a member by name or email..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full py-3 px-5 pr-12 bg-gray-50 border border-gray-200 rounded-full text-base focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all placeholder:font-sans"
      />
      <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
    </div>
  );
};

export default MemberSearch;