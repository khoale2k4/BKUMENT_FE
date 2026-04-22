import React from "react";
import { useTranslation } from "react-i18next";
import { FileUploadItem } from "@/types/FileUpload";
import FileItemEditor from "./FileItemEditor";

interface FileDescriptionProps {
    files: FileUploadItem[];
    onFilesChange: (files: FileUploadItem[]) => void;
}

const FileDescription = ({ files = [], onFilesChange }: FileDescriptionProps) => {
    const { t } = useTranslation();
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
        <div className="w-full max-w-5xl mx-auto overflow-visible">
            {files.length === 0 ? (
                <div className="p-10 text-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-400">
                    {t('documents.upload.step2.placeholderNoFiles', 'No files to enter information')}
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