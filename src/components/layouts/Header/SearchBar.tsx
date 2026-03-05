'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/home?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative flex-1 max-w-2xl mx-4">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm tài liệu, bài viết..."
                className="w-full px-4 py-2 pl-10 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-800 transition cursor-pointer"
            >
                Tìm
            </button>
        </form>
    );
}