import React from "react";
import { Trash, FileText, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import { FaFileWord, FaFilePdf } from "react-icons/fa";
import { UploadStatus } from "@/types/FileUpload";

interface FileItemHeaderProps {
    fileName: string;
    fileType: string;
    fileSize: number;
    status: UploadStatus;
    onDelete: () => void;
}

const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return <FaFilePdf className="text-2xl text-red-500" />;
    if (fileType.includes("word") || fileType.includes("document")) return <FaFileWord className="text-2xl text-blue-600" />;
    if (fileType.includes("image")) return <ImageIcon className="w-6 h-6 text-purple-500" />;
    return <FileText className="w-6 h-6 text-gray-500" />;
};

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const FileItemHeader: React.FC<FileItemHeaderProps> = ({
    fileName,
    fileType,
    fileSize,
    status,
    onDelete
}) => {
    const getStatusBadge = () => {
        switch (status) {
            case 'analyzing':
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        AI Analyzing...
                    </div>
                );
            case 'success':
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ready
                    </div>
                );
            case 'uploading':
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Uploading...
                    </div>
                );
            case 'error':
                return (
                    <div className="px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                        Error
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3 overflow-hidden">
                <div className="shrink-0">
                    {getFileIcon(fileType)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium text-gray-900 truncate max-w-[200px]" title={fileName}>
                        {fileName}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{formatFileSize(fileSize)}</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                {getStatusBadge()}
                <button
                    onClick={onDelete}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                    title="Delete file"
                >
                    <Trash className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                </button>
            </div>
        </div>
    );
};

export default FileItemHeader;
