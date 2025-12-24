

const UploadSuccess = () => {
    const imgUrl = '/src/assets/upload-success.png';
    return <div className="flex flex-col items-center text-center py-12 px-6">
        <h1 className="text-4xl font-serif text-gray-800 mb-4">
            Thanks! We're reviewing your documents
        </h1>

        <p className="max-w-md text-gray-600 mb-10">
            This usually takes just a few minutes. Check your uploads page to see when your
            documents are published for Premium access.
        </p>

        <div className="my-8">
            <img
                src={imgUrl}
                alt="Upload Complete"
                className="max-w-sm"
            />
        </div>
    </div>;
}

export default UploadSuccess;