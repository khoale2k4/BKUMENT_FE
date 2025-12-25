'use client'

import React, { useCallback, useState } from 'react';
import ActiveStep from './steps/ActiveStep';
import FileUploader from './steps/Step1';
import FileDescription from './steps/Step2';
import UploadSuccess from './steps/Step3';
import { FileUploadItem } from '@/types/FileUpload';
import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import axios from 'axios';

const FileUpload = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [files, setFiles] = useState<FileUploadItem[]>([]);

    const updateFileState = useCallback((localId: string, updates: Partial<FileUploadItem>) => {
        setFiles((prev) => prev.map(f => f.localId === localId ? { ...f, ...updates } : f));
    }, []);

    const processUploadFile = async (fileItem: FileUploadItem) => {
        const { localId, file } = fileItem;

        try {
            updateFileState(localId, { status: 'getting_url' });

            const initRes = await axios.get(API_ENDPOINTS.RESOURCE.GET_PRESIGNED_URL(fileItem.file.name));

            const uploadUrl = initRes.data.result.url;
            const fileId = initRes.data.result.fileId;

            updateFileState(localId, {
                status: 'uploading',
                presignedUrl: uploadUrl,
                storageId: fileId
            });

            await axios.put(uploadUrl, file, {
                headers: { 'Content-Type': file.type },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        updateFileState(localId, { progress: percent });
                    }
                },
            });

            updateFileState(localId, { status: 'uploaded', progress: 100 });
        } catch (err: any) {
            console.error("Upload error:", err);
            updateFileState(localId, {
                status: 'error',
                errorMessage: err.response?.data?.message || 'Upload failed'
            });
        }
    };

    const handleFileChange = async (e: any) => {
        if (!e.target.files) return;
        const selectedFiles = Array.from(e.target.files) as File[];

        const newFiles: FileUploadItem[] = selectedFiles.map((file) => ({
            localId: crypto.randomUUID(),
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            visibility: 'PUBLIC',
            progress: 0,
            status: 'idle',
            title: file.name.split('.')[0],
            university: '',
            course: '',
            description: ''
        }));

        setFiles((prev) => [...prev, ...newFiles]);

        e.target.value = '';

        newFiles.forEach(fileItem => processUploadFile(fileItem));
    };

    const handleDrop = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        if (!e.dataTransfer.files) return;
        const droppedFiles = Array.from(e.dataTransfer.files) as File[];

        const newFiles: FileUploadItem[] = droppedFiles.map((file) => ({
            localId: crypto.randomUUID(),
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            visibility: 'PUBLIC',
            progress: 0,
            status: 'idle',
            title: file.name.split('.')[0],
        }));

        setFiles((prev) => [...prev, ...newFiles]);
        newFiles.forEach(fileItem => processUploadFile(fileItem));
    };

    const handleDeleteFile = (localId: string) => {
        setFiles((prev) => prev.filter((f) => f.localId !== localId));
    };

    const handleUpdateMetadata = async () => {
        let hasError = false;

        const filesToSave = files.filter(f => f.status === 'uploaded' || f.status === 'success');

        if (filesToSave.length === 0) {
            setActiveStep(3);
            return;
        }

        for (let file of filesToSave) {
            try {
                updateFileState(file.localId, { status: 'saving' });

                await axios.post(API_ENDPOINTS.RESOURCE.UPDATE_METADATA, {
                    assetId: file.storageId,
                    title: file.title,
                    university: file.university,
                    course: file.course,
                    description: file.description,
                    resourceType: 'DOCUMENT',
                    visibility: file.visibility,
                    downloadable: true,
                    documentType: file.type,
                });

                updateFileState(file.localId, { status: 'success' });
            } catch (error) {
                console.error(error);
                hasError = true;
                updateFileState(file.localId, { status: 'error', errorMessage: "Save info failed" });
            }
        }

        if (!hasError) {
            setActiveStep(3);
        }
    }

    const handleRestart = () => {
        setFiles([]);
        setActiveStep(1);
    }

    const isNextDisabled = () => {
        if (activeStep === 1) {
            if (files.length === 0) return true;
            return files.some(f => f.status !== 'uploaded' && f.status !== 'success');
        }
        return false;
    };

    return (
        <div className="flex flex-col items-center w-full p-8 bg-white h-full">
            <div className="w-3/4 flex flex-row mb-8">
                <ActiveStep isActice={activeStep >= 1} title={'Upload'} description={'Upload your documents'} step={1} />
                <div className={`flex-grow h-0.5 mx-4 my-auto ${activeStep > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <ActiveStep isActice={activeStep >= 2} title={'Details'} description={'Describe your documents'} step={2} />
                <div className={`flex-grow h-0.5 mx-4 my-auto ${activeStep > 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <ActiveStep isActice={activeStep >= 3} title={'Done'} description={'Upload completed'} step={3} />
            </div>

            <div className="w-1/2 text-center text-sm font-medium text-gray-500">

                {activeStep == 1 && <FileUploader
                    files={files}
                    onFileChange={handleFileChange}
                    onDrop={handleDrop}
                    onDeleteFile={handleDeleteFile}
                />}

                {activeStep == 2 && <FileDescription
                    files={files}
                    onFilesChange={setFiles}
                />}

                {activeStep == 3 && <UploadSuccess />}

                {activeStep < 3 && <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                    <button
                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50"
                        onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                        disabled={activeStep === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        disabled={isNextDisabled()}
                        onClick={() => {
                            if (activeStep === 2) {
                                handleUpdateMetadata();
                            } else {
                                setActiveStep(Math.min(3, activeStep + 1));
                            }
                        }}
                    >
                        {activeStep == 2 ? 'Save' : 'Next'}
                    </button>
                </div>}
                {activeStep === 3 && <button
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                    onClick={() => handleRestart()}
                >
                    Upload more Documents
                </button>}
            </div>
        </div>
    );
};

export default FileUpload;