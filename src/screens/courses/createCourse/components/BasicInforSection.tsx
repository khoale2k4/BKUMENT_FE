import React from 'react';

interface Props {
  name: string;
  startDate: string;
  endDate: string;
  onChange: (field: string, value: string) => void;
}

const BasicInfoSection: React.FC<Props> = ({ name, startDate, endDate, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Course Name */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Course Name</label>
        <input 
          type="text" 
          placeholder="Ví dụ: Lớp thực hành ERD căn bản"
          className="w-full p-3 border border-gray-200 rounded-md outline-none focus:border-orange-500 transition-colors"
          value={name}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
          <input 
            type="date" 
            className="w-full p-3 border border-gray-200 rounded-md outline-none focus:border-orange-500"
            value={startDate} 
            onChange={(e) => onChange('startDate', e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
          <input 
            type="date" 
            className="w-full p-3 border border-gray-200 rounded-md outline-none focus:border-orange-500"
            value={endDate} 
            onChange={(e) => onChange('endDate', e.target.value)} 
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;