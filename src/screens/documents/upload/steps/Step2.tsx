import React from "react";
import { Trash, FileText, Image as ImageIcon, Globe, Lock } from "lucide-react";
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

const FileDescription = ({ files = [], onFilesChange }: FileDescriptionProps) => {
    const handleDetailChange = (localId: string, field: keyof FileUploadItem, value: string) => {
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
        <div className="w-full space-y-6">
            {files.length === 0 ? (
                <div className="p-10 text-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-400">
                    Chưa có file nào để nhập thông tin
                </div>
            ) : (
                files.map((file) => (
                    <div
                        key={file.localId}
                        className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
                    >
                        <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-100">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="shrink-0">
                                    {getFileIcon(file.type)}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span
                                        className="font-semibold text-gray-700 truncate max-w-[150px] sm:max-w-[250px]"
                                        title={file.name}
                                    >
                                        {file.name}
                                    </span>
                                    <span className="mx-2 text-gray-400">•</span>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDeleteFile(file.localId)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete file"
                            >
                                <Trash className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-8 space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Document Title <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={file.title || ""}
                                        onChange={(e) => handleDetailChange(file.localId, "title", e.target.value)}
                                        placeholder={file.name}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                                    />
                                </div>

                                <div className="md:col-span-4 space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Visibility</label>
                                    <div className="relative">
                                        <select
                                            value={file.visibility}
                                            onChange={(e) => handleDetailChange(file.localId, "visibility", e.target.value)}
                                            className="w-full p-2.5 pl-9 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none text-sm cursor-pointer"
                                        >
                                            <option value="PUBLIC">Public</option>
                                            <option value="PRIVATE">Private</option>
                                        </select>
                                        <div className="absolute left-3 top-2.5 text-gray-500 pointer-events-none">
                                            {file.visibility === 'PRIVATE' ? <Lock size={16} /> : <Globe size={16} />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">University</label>
                                    <input
                                        type="text"
                                        value={file.university || ""}
                                        onChange={(e) => handleDetailChange(file.localId, "university", e.target.value)}
                                        placeholder="School name"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Course</label>
                                    <input
                                        type="text"
                                        value={file.course || ""}
                                        onChange={(e) => handleDetailChange(file.localId, "course", e.target.value)}
                                        placeholder="Course name or code"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={file.description || ""}
                                    onChange={(e) => handleDetailChange(file.localId, "description", e.target.value)}
                                    placeholder="Add a brief description about this document..."
                                    rows={3}
                                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-sm"
                                />
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default FileDescription;