import React, { useState } from "react";
import { X, Plus } from "lucide-react";

interface TagManagerProps {
    tags: string[];
    onAdd: (tag: string) => void;
    onRemove: (tag: string) => void;
    maxTags?: number;
    placeholder?: string;
    label?: string;
}

const TagManager: React.FC<TagManagerProps> = ({
    tags,
    onAdd,
    onRemove,
    maxTags,
    placeholder = "Add a keyword...",
    label = "Keywords"
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newTag, setNewTag] = useState("");

    const handleAdd = () => {
        const trimmedTag = newTag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            if (!maxTags || tags.length < maxTags) {
                onAdd(trimmedTag);
                setNewTag("");
                setIsAdding(false);
            }
        } else {
            setIsAdding(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        } else if (e.key === "Escape") {
            setNewTag("");
            setIsAdding(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <label className="md:col-span-3 text-base font-bold text-black pt-2">{label}:</label>
            <div className="md:col-span-9">
                <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => onRemove(tag)}
                                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {isAdding ? (
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onBlur={handleAdd}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            placeholder={placeholder}
                            className="px-3 py-1.5 border border-blue-300 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
                        />
                    ) : (
                        (!maxTags || tags.length < maxTags) && (
                            <button
                                type="button"
                                onClick={() => setIsAdding(true)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-full text-sm hover:border-blue-400 hover:text-blue-600 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add keyword
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default TagManager;
