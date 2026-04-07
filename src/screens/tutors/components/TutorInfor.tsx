import React from "react";
import {
  Calendar,
  Briefcase,
  FileText,
  BookOpen,
  Star,
  Users,
  PlayCircle,
  MessageSquare,
} from "lucide-react"; // Đảm bảo import thêm Star, Users, PlayCircle
import { TutorData } from "@/lib/redux/features/tutorFindingSlice";

const renderStatusBadge = (status?: string) => {
  switch (status) {
    case "PENDING":
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
          Đang chờ duyệt
        </span>
      );
    case "APPROVED":
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
          Đã duyệt
        </span>
      );
    case "REJECTED":
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
          Từ chối
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
          {status}
        </span>
      );
  }
};

export const AdminTutorInfo: React.FC<{ tutor: TutorData["tutor"] }> = ({
  tutor,
}) => (
  // ... (Phần này giữ nguyên không thay đổi)
  <>
    <div className="flex items-center gap-3 mb-2">
      <h3 className="text-xl font-bold text-gray-900">{tutor.name}</h3>
      {tutor.status && renderStatusBadge(tutor.status)}
    </div>

    <div className="space-y-2 mt-4 text-sm text-gray-600">
      {tutor.createdAt && (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <span>
            <strong>Ngày đăng ký:</strong>{" "}
            {new Date(tutor.createdAt).toLocaleDateString("vi-VN")}
          </span>
        </div>
      )}
      <div className="flex items-start gap-2">
        <Briefcase size={16} className="text-gray-400 mt-0.5" />
        <span>
          <strong>Kinh nghiệm:</strong> {tutor.experience || "Chưa cập nhật"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <FileText size={16} className="text-gray-400" />
        <span>
          <strong>CV:</strong>{" "}
        </span>
        {tutor.cvUrl && tutor.cvUrl.startsWith("http") ? (
          <a
            href={tutor.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            Xem file CV đính kèm
          </a>
        ) : (
          <span className="text-gray-400 italic">Không có CV</span>
        )}
      </div>
    </div>

    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="text-sm text-gray-700 leading-relaxed">
        <strong>Giới thiệu:</strong>{" "}
        {tutor.introduction || "Không có giới thiệu."}
      </p>
    </div>

    {tutor.status === "REJECTED" && tutor.rejectionReason && (
      <div className="mt-3 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
        <strong>Lý do từ chối:</strong> {tutor.rejectionReason}
      </div>
    )}
  </>
);

export const UserTutorInfo: React.FC<{
  tutor: TutorData["tutor"];
  matchingClasses: TutorData["matchingClasses"];
  totalMatchingClasses: number;
}> = ({ tutor, matchingClasses, totalMatchingClasses }) => {
  const subject =
    matchingClasses && matchingClasses.length > 0
      ? matchingClasses[0].subjectName
      : "Đa môn học";

  return (
    <>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{tutor.name}</h3>

        {/* Placeholder text giống thiết kế (Followers, Trường học) */}
        <p className="text-sm text-gray-500 mb-2">
          88K followers • 1 following <br />
          {/* <span className="text-gray-400">A final year of HCMUT</span> */}
        </p>

        {/* Môn học */}
        <div className="flex items-center gap-2 font-bold text-sm text-gray-900 mt-3">
          <BookOpen size={18} className="text-gray-800" />
          {subject}
        </div>
      </div>

      {/* Hàng chỉ số (Rating, Students, Courses) giống trong ảnh */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          {/* Fill màu vàng cho icon sao */}
          <Star size={16} className="text-amber-500 fill-amber-500" />
          <span>
            <strong>{tutor.averageRating?.toFixed(1) || "0.0"} </strong> Rating
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-600">
          <MessageSquare size={16} className="text-green-500" />
          <span>
            <strong>{tutor.ratingCount || "0"} </strong> Reviews
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Users size={16} className="text-blue-600" />
          <span>
            <strong>{"0"}</strong> Students
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <PlayCircle size={16} className="text-rose-500 fill-rose-100" />
          <span>
            <strong>{totalMatchingClasses}</strong> Courses
          </span>
        </div>
      </div>

      {/* Lời giới thiệu */}
      <p className="text-sm text-gray-600 leading-relaxed pr-4 line-clamp-3">
        {tutor.introduction ||
          "Gia sư này chưa cập nhật bài giới thiệu bản thân."}
      </p>
    </>
  );
};
