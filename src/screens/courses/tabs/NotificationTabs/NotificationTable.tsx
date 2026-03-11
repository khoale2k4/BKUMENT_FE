import React from 'react';
import { Loader2, BellOff } from 'lucide-react';
import { ClassNotification } from '@/lib/redux/features/tutorCourseSlice';
import NotificationRow from './NotificationRow';

interface NotificationTableProps {
  notifications: ClassNotification[];
  isLoading: boolean;
}

const NotificationTable: React.FC<NotificationTableProps> = ({ notifications, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 size={40} className="animate-spin mb-4 text-green-500" />
        <p>Đang tải thông báo...</p>
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <BellOff size={48} className="mb-4 text-gray-300" />
        <p className="font-medium text-gray-500">Chưa có thông báo nào cho lớp này.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-100">
            <th className="py-4 font-medium w-24">#ID</th>
            <th className="py-4 font-medium w-48">Title</th>
            <th className="py-4 font-medium w-96">Message</th>
            <th className="py-4 font-medium w-48">Destination</th>
            <th className="py-4 font-medium w-40">Date</th>
            <th className="py-4 font-medium text-right w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((item) => (
            <NotificationRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationTable;