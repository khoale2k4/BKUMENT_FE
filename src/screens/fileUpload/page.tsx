import React, { useState } from 'react';
import ActiveStep from './steps/ActiveStep';
import FileUploader from './steps/step1';
import FileDescription from './steps/step2';
import UploadSuccess from './steps/step3';

const FileUpload = () => {
    const [activeStep, setActiveStep] = useState(1);

    const [files, setFiles] = useState([]);

    const handleFileChange = async (e: any) => {
        // const selectedFiles = [...e.target.files];

        // const newFiles = selectedFiles.map((file, index) => ({
        //     id: Date.now() + index,
        //     name: file.name,
        //     progress: 0,
        //     url: null,
        // }));

        // setFiles((prevFiles) => [...prevFiles, ...newFiles]);

        // for (let fileObj of newFiles) {
        //     try {

        //         // 1. Gọi Java lấy URL
        //         const initRes = await axios.get(contants.getPresignUrlEndpoint, {
        //             params: { fileName: fileObj.name },
        //             withCredentials: true
        //         });

        //         const uploadUrl = initRes.data.result.url;
        //         const fileId = initRes.data.result.fileId;

        //         const fileToUpload = selectedFiles.find(f => f.name === fileObj.name);

        //         const response = await fetch(uploadUrl, {
        //             method: 'PUT',
        //             body: fileToUpload,
        //         });

        //         if (!response.ok) {
        //             throw new Error(`Upload failed with status: ${response.status}`);
        //         }

        //         // Nếu cần track progress với fetch thì hơi phức tạp hơn axios
        //         // Để đơn giản, khi upload xong ta set progress = 100%
        //         setFiles((prevFiles) =>
        //             prevFiles.map((f) =>
        //                 f.id === fileObj.id ? { ...f, progress: 100 } : f
        //             )
        //         );

        //         const fileLink = initRes.data.fileLink || uploadUrl.split('?')[0];

        //         setFiles((prevFiles) =>
        //             prevFiles.map((f) =>
        //                 f.id === fileObj.id
        //                     ? { ...f, id: fileId, progress: 100, url: fileLink }
        //                     : f
        //             )
        //         );
        //     } catch (err) {
        //         console.error(err);
        //         setFiles((prevFiles) =>
        //             prevFiles.map((f) =>
        //                 f.id === fileObj.id ? { ...f, status: "error" } : f
        //             )
        //         );
        //     }
        // }
    };

    const handleDrop = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFiles = [...e.dataTransfer.files].map((file, index) => ({
            id: Date.now() + index,
            name: file.name,
            progress: 0,
        }));
        // setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
        // TODO: Thêm logic bắt đầu upload file tại đây
    };

    const handleUpdateMetadata = async () => {
        for (let file of files) {
            console.log(file);
            // await axios.post(contants.postFileMetadataEndpoint, {
            //     assetId: file.id,
            //     title: file.name,
            //     university: file.university,
            //     course: file.course,
            //     description: file.description,
            //     downloadUrl: file.url,
            //     resourceType: 'DOCUMENT',
            //     visibility: "PUBLIC",
            //     downloadable: true,
            // });
        }
    }

    const handleRestart = () => {
        setFiles([]);
        setActiveStep(1);
    }

    const handleDeleteFile = (fileId: string) => {
        // setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    };

    return (
        <div className="flex flex-col items-center w-full p-8 bg-white h-screen">
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
                    onDeleteFile={handleDeleteFile}
                />}
                {activeStep == 2 && <FileDescription
                    files={files}
                    onFilesChange={setFiles}
                />}
                {activeStep == 3 && <UploadSuccess />}

                {activeStep < 3 && <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                    <button
                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50"
                        onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                        disabled={activeStep === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                        // disabled={files.every((file) => file.progress === 100)}
                        onClick={() => {
                            setActiveStep(Math.min(3, activeStep + 1));
                            if (activeStep === 2) {
                                handleUpdateMetadata();
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