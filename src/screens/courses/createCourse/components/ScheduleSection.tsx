import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Schedule {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface Props {
  schedules: Schedule[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: string) => void;
}

const ScheduleSection: React.FC<Props> = ({ schedules, onAdd, onRemove, onUpdate }) => {
  const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-bold text-gray-700">Class Schedules</label>
        <button onClick={onAdd} className="flex items-center gap-1 text-sm text-blue-600 font-bold hover:underline transition-colors">
          <Plus size={16} /> Add Schedule
        </button>
      </div>
      
      {schedules.map((sched, index) => (
        <div key={index} className="flex flex-col md:flex-row items-end gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-gray-500 uppercase">Day</label>
            <select 
              className="w-full p-2 bg-white border border-gray-200 rounded-md mt-1 outline-none focus:border-blue-500"
              value={sched.dayOfWeek}
              onChange={(e) => onUpdate(index, 'dayOfWeek', e.target.value)}
            >
              {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-gray-500 uppercase">Start Time</label>
            <input 
              type="time" 
              className="w-full p-2 bg-white border border-gray-200 rounded-md mt-1 outline-none focus:border-blue-500"
              onChange={(e) => onUpdate(index, 'startTime', e.target.value)} 
            />
          </div>
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-gray-500 uppercase">End Time</label>
            <input 
              type="time" 
              className="w-full p-2 bg-white border border-gray-200 rounded-md mt-1 outline-none focus:border-blue-500"
              onChange={(e) => onUpdate(index, 'endTime', e.target.value)} 
            />
          </div>
          <button 
            onClick={() => onRemove(index)} 
            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors self-end md:self-auto"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ScheduleSection;