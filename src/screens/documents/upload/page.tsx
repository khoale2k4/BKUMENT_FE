"use client";

import { useTranslation } from 'react-i18next';
import React from 'react';
import { useParams } from 'next/navigation';
import ActiveStep from './steps/ActiveStep';
import FileUploader from './steps/Step1';
import UploadSuccess from './steps/Step3';
import { FileUploadItem } from '@/types/FileUpload';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
    setUploadFiles,
    removeUploadFile,
    updateFileMetadataInput,
    setActiveStep,
    resetUploadState,
    uploadFile,
    saveFilesMetadata
} from '@/lib/redux/features/documentSlice';
import FileDescription from './steps/Step2/FileDescription';

const FileUpload = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const params = useParams();
    const courseId = params?.course_id as string | undefined;

    const { files, activeStep, uploadStatus } = useAppSelector((state) => state.documents.upload);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selectedFiles = Array.from(e.target.files);
        processFiles(selectedFiles);
        e.target.value = '';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.dataTransfer.files) return;
        const droppedFiles = Array.from(e.dataTransfer.files);
        processFiles(droppedFiles);
    };

    const processFiles = (fileList: File[]) => {
        const newFilesFull: FileUploadItem[] = fileList.map((file) => ({
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
        } as FileUploadItem));

        const newFilesForRedux = newFilesFull.map(({ file, ...rest }) => rest);

        dispatch(setUploadFiles(newFilesForRedux));

        newFilesFull.forEach(fileItem => {
            dispatch(uploadFile(fileItem));
        });
    };

    const handleDeleteFile = (localId: string) => {
        dispatch(removeUploadFile(localId));
    };

    const handleNextStep = () => {
        if (activeStep === 2) {
            dispatch(saveFilesMetadata(courseId));
        } else {
            dispatch(setActiveStep(Math.min(3, activeStep + 1)));
        }
    };

    const handlePrevStep = () => {
        dispatch(setActiveStep(Math.max(1, activeStep - 1)));
    };

    const handleRestart = () => {
        dispatch(resetUploadState());
    };

    const isNextDisabled = () => {
        if (activeStep === 1) {
            if (files.length === 0) return true;
            return files.some(f => f.status !== 'uploaded' && f.status !== 'success' && f.status !== 'analyzing');
        }
        if (activeStep === 2) {
            return uploadStatus === 'saving';
        }
        return false;
    };

    return (
        <div className="flex flex-col items-center w-full p-8 bg-white h-full">
            <div className="w-3/4 flex flex-row mb-8">
                <ActiveStep isActice={activeStep >= 1} title={t('documents.upload.step1.title', 'Upload Files')} description={''} step={1} />
                <div className={`flex-grow h-0.5 mx-4 my-auto ${activeStep > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <ActiveStep isActice={activeStep >= 2} title={t('documents.upload.step2.title', 'Document Details')} description={''} step={2} />
                <div className={`flex-grow h-0.5 mx-4 my-auto ${activeStep > 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <ActiveStep isActice={activeStep >= 3} title={t('blogs.write.header.successTitle', 'Success!')} description={''} step={3} />
            </div>

            <div className="w-1/2 text-center text-sm font-medium text-gray-500">

                {activeStep === 1 && <FileUploader
                    files={files}
                    onFileChange={handleFileChange}
                    onDrop={handleDrop}
                    onDeleteFile={handleDeleteFile}
                />}

                {activeStep === 2 && <FileDescription
                    files={files}
                    onFilesChange={(updatedFiles) => dispatch(updateFileMetadataInput(updatedFiles))}
                />}

                {activeStep === 3 && <UploadSuccess />}

                {activeStep < 3 && <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                    <button
                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50"
                        onClick={handlePrevStep}
                        disabled={activeStep === 1 || uploadStatus === 'saving'}
                    >
                        {t('documents.upload.back', 'Back')}
                    </button>
                    <button
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        disabled={isNextDisabled()}
                        onClick={handleNextStep}
                    >
                        {activeStep === 2 ? (uploadStatus === 'saving' ? t('blogs.write.header.publishing', 'Saving...') : t('documents.upload.submit', 'Upload now')) : t('documents.upload.next', 'Next Step')}
                    </button>
                </div>}
                {activeStep === 3 && <button
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                    onClick={handleRestart}
                >
                    {t('documents.upload.title', 'Upload Documents')}
                </button>}
            </div>
        </div>
    );
};

export default FileUpload;