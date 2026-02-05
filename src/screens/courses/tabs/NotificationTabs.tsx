'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Plus, Edit, Trash2 } from 'lucide-react';

const NotificationsTab = () => {
  // State quản lý việc mở menu Action của từng dòng
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Xử lý click ra ngoài để đóng menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dữ liệu giả lập (Mock Data) giống trong ảnh
  const notifications = [
    {
      id: '1234',
      title: 'Thông báo nghỉ',
      message: 'Chào cả lớp. Nay mình ốm nên 2 lớp Mobile nghỉ nhé',
      destination: 'Mobile Development',
      date: 'October 03, 2022',
    },
    {
      id: '1235',
      title: 'Thông báo kết quả học tập',
      message: 'Điểm tổng kết môn DBS đã được cập nhật',
      destination: 'All',
      date: 'October 03, 2022',
    },
    {
      id: '1236',
      title: 'Thông báo kiểm tra bù',
      message: 'Chào Khoa, thầy đã sắp xếp lịch kiểm tra bù cho em. Đó sẽ là tiết thứ ...',
      destination: 'Lê Võ Đăng Khoa',
      date: 'October 03, 2022',
    },
    {
      id: '1237',
      title: 'Thông báo nghỉ',
      message: 'Chào cả lớp. Nay mình ốm nên 2 lớp Mobile nghỉ nhé',
      destination: 'Mobile Development',
      date: 'October 03, 2022',
    },
    {
      id: '1238',
      title: 'Thông báo nghỉ',
      message: 'Chào cả lớp. Nay mình ốm nên 2 lớp Mobile nghỉ nhé',
      destination: 'Mobile Development',
      date: 'October 03, 2022',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Push notification</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-green-500 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors">
          <Plus size={18} />
          Add Push notification
        </button>
      </div>

      {/* Table Section */}
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
              <tr key={item.id} className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                
                {/* ID Column */}
                <td className="py-4 align-top">
                  <span className="inline-block px-3 py-1 bg-[#e6f7ef] text-[#00c875] font-semibold text-sm rounded-md">
                    #{item.id}
                  </span>
                </td>

                {/* Title Column */}
                <td className="py-4 align-top font-bold text-slate-800">
                  {item.title}
                </td>

                {/* Message Column */}
                <td className="py-4 align-top text-gray-600 text-sm leading-relaxed pr-4">
                  {item.message}
                </td>

                {/* Destination Column */}
                <td className="py-4 align-top text-gray-600 text-sm">
                  {item.destination}
                </td>

                {/* Date Column */}
                <td className="py-4 align-top text-gray-500 text-sm">
                  {item.date}
                </td>

                {/* Actions Column */}
                <td className="py-4 align-top text-right relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === item.id ? null : item.id);
                    }}
                    className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-all"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === item.id && (
                    <div 
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                    >
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Edit size={14} /> Edit
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationsTab;