import { Search } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Search"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-black focus:border-black block pl-10 p-2.5 outline-none transition"
            />
        </div>
    );
}