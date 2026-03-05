import React from 'react';

interface Props {
  description: string;
  onChange: (value: string) => void;
}

const DescriptionSection: React.FC<Props> = ({ description, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
      <textarea 
        className="w-full p-3 border border-gray-200 rounded-md min-h-[120px] outline-none focus:border-orange-500 resize-y"
        placeholder="Mô tả chi tiết về lớp học..."
        value={description} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  );
};

export default DescriptionSection;