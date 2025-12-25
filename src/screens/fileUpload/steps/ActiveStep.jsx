const ActiveStep = ({isActice, title, description, step}) => {
    return <div className="flex flex-row items-center">
        <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold
        ${isActice ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
        >
            {step}
        </div>
        <div className="mt-2 pl-2 text-left">
            <div className={`font-semibold ${isActice ? 'text-blue-600' : 'text-gray-500'}`}>{title}</div>
            <div className="text-sm text-gray-500">{description}</div>
        </div>
    </div>;
}

export default ActiveStep;