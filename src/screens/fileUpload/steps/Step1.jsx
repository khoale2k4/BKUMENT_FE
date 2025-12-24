import React from "react";
import { BsUpload, BsTrash, BsThreeDotsVertical } from "react-icons/bs";
import { FaFileWord } from "react-icons/fa";

const FileUploader = ({ files = [], onFileChange, onDeleteFile }) => {
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onFileChange) {
            onFileChange(e); 
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    return (
        <div>
            <div
                className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <BsUpload className="text-4xl text-blue-600 mb-4" />
                <p className="text-lg font-semibold text-gray-800">Drag & Drop files</p>
                <p className="text-sm text-gray-500">Or if you prefer</p>

                <label
                    htmlFor="fileInput"
                    className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition-colors"
                >
                    Browse my files
                </label>
                <input
                    id="fileInput"
                    type="file"
                    multiple
                    onChange={onFileChange} 
                    className="hidden"
                />

                <p className="mt-4 text-xs text-gray-500">Support files: pdf, doc, docx.</p>
            </div>

            <div className="mt-8 flex-1 overflow-y-auto border rounded-lg space-y-4 p-4">
                {files.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        Chưa có file nào được upload
                    </div>
                ) : (
                    files.map((file) => (
                        <div
                            key={file.id}
                            className="flex justify-between items-center p-4 border-b border-gray-200"
                        >
                            <div className="flex items-center space-x-3">
                                <FaFileWord className="text-2xl text-blue-600" />
                                <span className="font-medium text-gray-800">{file.name}</span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-500">
                                    {file.progress}%
                                </span>
                                <button
                                    onClick={() => onDeleteFile && onDeleteFile(file.id)}
                                    className="text-gray-500 hover:text-red-600"
                                >
                                    <BsTrash className="w-5 h-5" />
                                </button>
                                <button className="text-gray-500 hover:text-gray-800">
                                    <BsThreeDotsVertical className="w-5 h-5" />
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
