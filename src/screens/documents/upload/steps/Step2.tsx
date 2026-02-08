import React, { useState } from "react";
import { Trash, FileText, Image as ImageIcon, Globe, Lock, X, Plus, Sparkles } from "lucide-react";
import { FaFileWord, FaFilePdf } from "react-icons/fa";
import { FileUploadItem } from "@/types/FileUpload";

interface FileDescriptionProps {
    files: FileUploadItem[];
    onFilesChange: (files: FileUploadItem[]) => void;
}

const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return <FaFilePdf className="text-2xl text-red-500" />;
    if (fileType.includes("word") || fileType.includes("document")) return <FaFileWord className="text-2xl text-blue-600" />;
    if (fileType.includes("image")) return <ImageIcon className="w-6 h-6 text-purple-500" />;
    return <FileText className="w-6 h-6 text-gray-500" />;
};

const FileItemEditor = ({
    file,
    onUpdate,
    onDelete
}: {
    file: FileUploadItem;
    onUpdate: (field: keyof FileUploadItem, value: any) => void;
    onDelete: () => void;
}) => {
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [newTag, setNewTag] = useState("");

    const handleAddTag = () => {
        if (newTag.trim()) {
            const currentTags = file.keywords || [];
            if (!currentTags.includes(newTag.trim())) {
                onUpdate("keywords", [...currentTags, newTag.trim()]);
            }
            setNewTag("");
            setIsAddingTag(false);
        } else {
            setIsAddingTag(false);
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const currentTags = file.keywords || [];
        onUpdate("keywords", currentTags.filter(t => t !== tagToRemove));
    };

    return (
        <div className={`bg-white border rounded-3xl shadow-sm overflow-hidden transition-all hover:shadow-md mb-8 ${file.status === 'analyzing' ? 'border-blue-200 ring-4 ring-blue-50' : 'border-gray-200'}`}>
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="shrink-0">
                        {getFileIcon(file.type)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <span className="font-semibold text-gray-700 truncate max-w-[200px]" title={file.name}>
                            {file.name}
                        </span>
                        {file.progress < 100 && (
                            <span className="ml-2 text-xs text-blue-500">{file.progress}%</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Status Indicator Logic: Prioritize Analyzing state */}
                    {file.status === 'analyzing' ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full shadow-sm">
                            <div className="flex space-x-0.5">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                            </div>
                            <span className="text-xs font-bold text-blue-700">Analyzing...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full shadow-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-green-700">{file.progress === 100 ? "Completed" : `${file.progress}%`}</span>
                        </div>
                    )}

                    <button
                        onClick={onDelete}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete file"
                    >
                        <Trash className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                        <span className="text-xl">•••</span>
                    </button>
                </div>
            </div>

            {/* Form Fields */}
            <div className="p-6 md:p-8 space-y-6">

                {/* Subject (Dropdown) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <label className="md:col-span-3 text-base font-bold text-black">Subject:</label>
                    <div className="md:col-span-9">
                        <div className="relative w-full">
                            <select
                                value={file.subject || ""}
                                onChange={(e) => onUpdate("subject", e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-full outline-none focus:bg-white focus:ring-2 focus:ring-black/20 text-sm appearance-none cursor-pointer transition-all"
                            >
                                <option value="" disabled>Select a Subject</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Physics">Physics</option>
                                <option value="Literature">Literature</option>
                            </select>
                            <div className="absolute right-4 top-3 pointer-events-none text-gray-500">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Topic (Dropdown) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <label className="md:col-span-3 text-base font-bold text-black">Topic:</label>
                    <div className="md:col-span-9">
                        <div className="relative w-full">
                            <select
                                value={file.topic || ""}
                                onChange={(e) => onUpdate("topic", e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-full outline-none focus:bg-white focus:ring-2 focus:ring-black/20 text-sm appearance-none cursor-pointer transition-all"
                            >
                                <option value="" disabled>Select a Topic</option>
                                <option value="Networking">Networking</option>
                                <option value="Algorithms">Algorithms</option>
                                <option value="Web Development">Web Development</option>
                                <option value="Database Design">Database Design</option>
                            </select>
                            <div className="absolute right-4 top-3 pointer-events-none text-gray-500">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Tag */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <label className="md:col-span-3 text-base font-bold text-black pt-2">Search Tag:</label>
                    <div className="md:col-span-9 flex flex-wrap gap-2 items-center">
                        {file.keywords?.map((tag, idx) => (
                            <div key={idx} className="flex items-center bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm group relative hover:bg-gray-200 transition-colors">
                                <span>{tag}</span>
                                <button
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-2 w-4 h-4 flex items-center justify-center bg-gray-300 text-gray-600 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        ))}

                        {isAddingTag ? (
                            <input
                                autoFocus
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onBlur={handleAddTag}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddTag();
                                    if (e.key === 'Escape') setIsAddingTag(false);
                                }}
                                className="border border-gray-300 rounded-full px-3 py-1.5 text-sm outline-none focus:border-black min-w-[100px]"
                                placeholder="Add tag..."
                            />
                        ) : (
                            <button
                                onClick={() => setIsAddingTag(true)}
                                className="w-7 h-7 flex items-center justify-center rounded-full border border-dashed border-gray-400 text-gray-500 hover:border-black hover:text-black hover:bg-gray-50 transition-all"
                            >
                                <Plus size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Document Title */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <label className="md:col-span-3 text-base font-bold text-black">Document Title:</label>
                    <div className="md:col-span-9">
                        <input
                            type="text"
                            value={file.title || ""}
                            onChange={(e) => onUpdate("title", e.target.value)}
                            className="w-full px-4 py-2.5 border border-black rounded-full outline-none focus:ring-2 focus:ring-black/20 focus:border-black text-sm transition-all"
                        />
                    </div>
                </div>

                {/* Visibility */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <label className="md:col-span-3 text-base font-bold text-black">Visibility:</label>
                    <div className="md:col-span-9">
                        <div className="relative w-full">
                            <select
                                value={file.visibility}
                                onChange={(e) => onUpdate("visibility", e.target.value)}
                                className="w-full px-4 py-2.5 border border-black rounded-full outline-none focus:ring-2 focus:ring-black/20 text-sm appearance-none bg-white cursor-pointer transition-all"
                            >
                                <option value="PUBLIC">Public</option>
                                <option value="PRIVATE">Private</option>
                            </select>
                            <div className="absolute right-4 top-3 pointer-events-none text-gray-500">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* University (Dropdown) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <label className="md:col-span-3 text-base font-bold text-black">University:</label>
                    <div className="md:col-span-9">
                        <div className="relative w-full">
                            <select
                                value={file.university || ""}
                                onChange={(e) => onUpdate("university", e.target.value)}
                                className="w-full px-4 py-2.5 border border-black rounded-full outline-none focus:ring-2 focus:ring-black/20 text-sm appearance-none bg-white cursor-pointer transition-all"
                            >
                                <option value="" disabled>Select University</option>
                                <option value="Bach Khoa University">Bach Khoa University</option>
                                <option value="University of Science">University of Science</option>
                                <option value="University of Information Technology">University of Information Technology</option>
                            </select>
                            <div className="absolute right-4 top-3 pointer-events-none text-gray-500">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <label className="md:col-span-3 text-base font-bold text-black pt-2">Description:</label>
                    <div className="md:col-span-9 relative">
                        <div className="relative group rounded-2xl p-[2px] bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 shadow-lg transition-all hover:shadow-xl hover:scale-[1.01]">
                            <div className="absolute inset-0 bg-white rounded-2xl opacity-20 blur-lg group-hover:opacity-30 transition-opacity"></div>
                            <textarea
                                value={file.description || ""}
                                onChange={(e) => onUpdate("description", e.target.value)}
                                placeholder="Enter description..."
                                rows={4}
                                className="relative w-full p-4 bg-white rounded-2xl border-none outline-none resize-none text-sm text-gray-700 shadow-sm focus:ring-0"
                            />
                        </div>
                        {/* Sparkle Icon at bottom right with animation */}
                        <div className="absolute bottom-4 right-4 pointer-events-none animate-pulse">
                            <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const FileDescription = ({ files = [], onFilesChange }: FileDescriptionProps) => {
    const handleDetailChange = (localId: string, field: keyof FileUploadItem, value: string | string[]) => {
        if (!onFilesChange) return;

        const updatedFiles = files.map((file) =>
            file.localId === localId ? { ...file, [field]: value } : file
        );

        onFilesChange(updatedFiles);
    };

    const handleDeleteFile = (localId: string) => {
        if (!onFilesChange) return;

        const updatedFiles = files.filter((f) => f.localId !== localId);
        onFilesChange(updatedFiles);
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            {files.length === 0 ? (
                <div className="p-10 text-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-400">
                    Chưa có file nào để nhập thông tin
                </div>
            ) : (
                files.map((file) => (
                    <FileItemEditor
                        key={file.localId}
                        file={file}
                        onUpdate={(field, value) => handleDetailChange(file.localId, field, value)}
                        onDelete={() => handleDeleteFile(file.localId)}
                    />
                ))
            )}
        </div>
    );
};

export default FileDescription;