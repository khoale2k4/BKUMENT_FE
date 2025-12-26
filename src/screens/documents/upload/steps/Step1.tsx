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

            <div className="mt-8 flex-1 overflow-y-auto border rounded-lg space-y-4 p-4 max-h-[400px]">
                {files.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        Chưa có file nào được upload
                    </div>
                ) : (
                    files.map((file) => (
                        <div
                            key={file.localId}
                            className="flex justify-between items-center p-4 border-b border-gray-200 last:border-0"
                        >
                            <div className="flex items-center space-x-3">
                                {getFileIcon(file.name)}
                                <span className="font-medium text-gray-800 truncate max-w-[200px]" title={file.name}>
                                    {file.name}
                                </span>
                            </div>

                            <div className="flex items-center space-x-4">
                                {file.status === 'error' ? (
                                    <span className="text-xs text-red-500 font-medium">Error</span>
                                ) : (
                                    <span className="text-xs font-medium text-blue-600">
                                        {file.progress === 100 ? "Ready" : `${file.progress}%`}
                                    </span>
                                )}

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteFile && onDeleteFile(file.localId);
                                    }}
                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                >
                                    <Trash className="w-5 h-5" />
                                </button>
                                <button className="text-gray-400 hover:text-gray-800 transition-colors">
                                    <EllipsisVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FileUploader;