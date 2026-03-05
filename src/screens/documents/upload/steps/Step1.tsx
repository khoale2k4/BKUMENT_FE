import React, { useRef } from "react";
import { FileUploadItem } from "@/types/FileUpload";
import { EllipsisVertical, Trash, Upload, FileText } from "lucide-react";
import { FaFileWord, FaFilePdf } from "react-icons/fa";

interface FileUploaderProps {
    files: FileUploadItem[];
    onFileChange: (e: any) => void;
    onDrop: (e: any) => void;
    onDeleteFile: (stringId: string) => void;
}

const FileUploader = ({ files = [], onFileChange, onDrop, onDeleteFile }: FileUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        if (onDrop) {
            onDrop(e);
        }
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleZoneClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const getFileIcon = (fileName: string) => {
        const lowerName = fileName.toLowerCase();
        if (lowerName.endsWith('.pdf')) return <FaFilePdf className="text-2xl text-red-500" />;
        if (lowerName.endsWith('.doc') || lowerName.endsWith('.docx')) return <FaFileWord className="text-2xl text-blue-600" />;
        return <FileText className="text-2xl text-gray-500" />;
    };

    return (
        <div>
            <div
                onClick={handleZoneClick}
                className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <Upload className="text-4xl text-blue-600 mb-4" />
                <p className="text-lg font-semibold text-gray-800">Drag & Drop files</p>
                <p className="text-sm text-gray-500">Or click anywhere to browse</p>

                <button
                    type="button"
                    className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors pointer-events-none" // pointer-events-none để click xuyên qua div cha
                >
                    Browse my files
                </button>

                <input
                    ref={fileInputRef}
                    id="fileInput"
                    type="file"
                    multiple
                    accept=".pdf, .doc, .docx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={onFileChange}
                    className="hidden"
                    onClick={(e) => e.stopPropagation()}
                />

                <p className="mt-4 text-xs text-gray-500">Supported files: PDF, DOC, DOCX</p>
            </div>

            <div className="mt-8 flex-1 overflow-y-auto border border-gray-100 rounded-xl space-y-4 p-2 max-h-[400px] shadow-inner bg-gray-50/50">
                {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <FileText className="w-12 h-12 mb-3 opacity-20" />
                        <p>No files uploaded yet</p>
                    </div>
                ) : (
                    files.map((file) => (
                        <div
                            key={file.localId}
                            className={`group flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm transition-all hover:shadow-md ${file.status === 'analyzing' ? 'ring-2 ring-blue-100 border-blue-200' : ''}`}
                        >
                            <div className="flex items-center space-x-4 overflow-hidden">
                                <div className="shrink-0 transition-transform group-hover:scale-105">
                                    {getFileIcon(file.name)}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-semibold text-gray-700 truncate max-w-[180px] sm:max-w-[250px]" title={file.name}>
                                        {file.name}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                {file.status === 'error' ? (
                                    <div className="flex items-center text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                                        <span className="text-xs font-semibold">Error</span>
                                    </div>
                                ) : file.status === 'analyzing' ? (
                                    <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                        <div className="flex space-x-1">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                                        </div>
                                        <span className="text-xs font-semibold text-blue-600">Analyzing...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        {file.progress === 100 ? (
                                            <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                                <span className="text-xs font-semibold">Ready</span>
                                            </div>
                                        ) : (
                                            <div className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                                                {file.progress}%
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteFile && onDeleteFile(file.localId);
                                        }}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FileUploader;