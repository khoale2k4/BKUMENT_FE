import React, { RefObject } from "react";
import { Loader2 } from "lucide-react";

interface AutocompleteFieldProps<T> {
    label: string;
    value: string;
    onChange: (value: string) => void;
    onFocus: () => void;
    onSelect: (item: T) => void;
    items: T[];
    isLoading?: boolean;
    showDropdown: boolean;
    disabled?: boolean;
    placeholder?: string;
    renderItem: (item: T) => React.ReactNode;
    dropdownRef: RefObject<HTMLDivElement>;
    className?: string;
}

function AutocompleteField<T>({
    label,
    value,
    onChange,
    onFocus,
    onSelect,
    items,
    isLoading = false,
    showDropdown,
    disabled = false,
    placeholder = "Type to search...",
    renderItem,
    dropdownRef,
    className = ""
}: AutocompleteFieldProps<T>) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center ${className}`}>
            <label className="md:col-span-3 text-base font-bold text-black">{label}:</label>
            <div className="md:col-span-9 relative" ref={dropdownRef}>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-black/20 text-sm transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
                />
                {isLoading && (
                    <div className="absolute right-4 top-3">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    </div>
                )}
                {showDropdown && items.length > 0 && !disabled && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => onSelect(item)}
                                className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 text-left"
                            >
                                {renderItem(item)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AutocompleteField;
