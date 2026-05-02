import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { ClassNotification } from "@/lib/redux/features/tutorCourseSlice";

interface NotificationRowProps {
  item: ClassNotification;
}

const NotificationRow: React.FC<NotificationRowProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click ra ngoài để đóng menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Format ngày tháng từ chuỗi ISO (VD: "2026-03-10T15:41:40.3118")
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <tr className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
      <td className="py-4 align-top font-bold text-slate-800">{item.title}</td>
      <td className="py-4 align-top text-gray-600 text-sm leading-relaxed pr-4">
        {item.message}
      </td>
      <td className="py-4 align-top text-gray-600 text-sm">{item.className}</td>
      <td className="py-4 align-top text-gray-500 text-sm">
        {formatDate(item.sentAt)}
      </td>
      <td className="py-4 align-top text-right relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-all focus:outline-none"
        >
          <MoreVertical size={18} />
        </button>

        {isOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Tạm thời chỉ làm UI mock, nếu có API Edit/Delete thì nối vào sau */}
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
  );
};

export default NotificationRow;
