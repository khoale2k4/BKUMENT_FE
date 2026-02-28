import React from "react";
import { Globe, Lock } from "lucide-react";
import { VisibilityStatus } from "@/types/FileUpload";

interface VisibilityToggleProps {
    value: VisibilityStatus;
    onChange: (value: VisibilityStatus) => void;
    disabled?: boolean;
    label?: string;
}

const VisibilityToggle: React.FC<VisibilityToggleProps> = ({
    value,
    onChange,
    disabled = false,
    label = "Visibility"
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <label className="md:col-span-3 text-base font-bold text-black">{label}:</label>
            <div className="md:col-span-9">
                <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
                    <button
                        type="button"
                        onClick={() => onChange("PUBLIC")}
                        disabled={disabled}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${value === "PUBLIC"
                                ? "bg-white text-green-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <Globe className="w-4 h-4" />
                        Public
                    </button>
                    <button
                        type="button"
                        onClick={() => onChange("PRIVATE")}
                        disabled={disabled}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${value === "PRIVATE"
                                ? "bg-white text-orange-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <Lock className="w-4 h-4" />
                        Private
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VisibilityToggle;
