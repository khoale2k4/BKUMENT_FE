import { BsTrash, BsThreeDotsVertical } from "react-icons/bs";
import { FaFileWord } from "react-icons/fa";

const FileDescription = ({ files = [], onFilesChange }) => {
    const handleDetailChange = (fileId, field, value) => {
        if (!onFilesChange) return;
        const updatedFiles = files.map((file) =>
            file.id === fileId ? { ...file, [field]: value } : file
        );
        onFilesChange(updatedFiles);
    };

    const handleDeleteFile = (fileId) => {
        if (!onFilesChange) return;
        onFilesChange(files.filter((f) => f.id !== fileId));
    };

    return (
        <div className="p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-inner space-y-6">
            {files.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    Chưa có file nào được upload
                </div>
            ) : (
                files.map((file) => (
                    <div
                        key={file.id}
                        className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <FaFileWord className="text-2xl text-blue-600" />
                                <span className="font-medium text-gray-800">{file.name}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => handleDeleteFile(file.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <BsTrash className="w-5 h-5" />
                                </button>
                                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <BsThreeDotsVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium mr-5">University:</label>
                                <input
                                    type="text"
                                    value={file.university || ""}
                                    onChange={(e) => handleDetailChange(file.id, "university", e.target.value)}
                                    placeholder="example"
                                    className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium mr-5">Course:</label>
                                <input
                                    type="text"
                                    value={file.course || ""}
                                    onChange={(e) => handleDetailChange(file.id, "course", e.target.value)}
                                    placeholder="example"
                                    className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium mr-5">Title:</label>
                                <input
                                    type="text"
                                    value={file.name || ""}
                                    onChange={(e) => handleDetailChange(file.id, "name", e.target.value)}
                                    placeholder="example"
                                    className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-start">
                                <label className="w-32 text-gray-700 font-medium pt-3 mr-5">Description:</label>
                                <textarea
                                    value={file.description || ""}
                                    onChange={(e) => handleDetailChange(file.id, "description", e.target.value)}
                                    placeholder="example"
                                    rows="4"
                                    className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
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
