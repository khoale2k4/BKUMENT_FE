import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  getSearchSubjects,
  searchTutors,
  setFilters,
} from "@/lib/redux/features/tutorFindingSlice";

export const useTutorSearch = () => {
  const dispatch = useAppDispatch();
  
  // 1. Lấy currentRole từ auth để phân luồng gọi API
  const { currentRole } = useAppSelector((state) => state.auth);
  
  // 2. Lấy các state cần thiết từ tutorFindingSlice
  const { tutors, loading, error, filters, subjects } = useAppSelector(
    (state) => state.tutorFinding,
  );

  // 3. Xử lý gọi API lần đầu khi component mount
  useEffect(() => {
    // Luôn gọi lấy danh sách môn học cho bộ lọc
    dispatch(getSearchSubjects());

    // CHỈ tự động tìm kiếm gia sư nếu role là USER hoặc TUTOR
    // Điều này giúp ADMIN không bị tự động gọi đè API `getTutorApplication`
    if (currentRole === "USER" || currentRole === "TUTOR") {
      dispatch(searchTutors(filters));
    }
    
    // Disable cảnh báo dependency của eslint cho biến filters 
    // vì ta chỉ muốn gọi 1 lần lúc mount, không muốn gọi liên tục mỗi khi gõ phím
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentRole]);

  // 4. Xử lý cập nhật bộ lọc
  const handleFilterChange = (field: string, value: string) => {
    dispatch(setFilters({ [field]: value }));
  };

  // 5. Xử lý khi user chủ động bấm nút Tìm kiếm
  const handleSearch = () => {
    console.log("Searching tutors with filters:", filters); // Debug log
    dispatch(searchTutors(filters));
  };

  return {
    tutors,
    loading,
    error,
    filters,
    subjects,
    handleFilterChange,
    handleSearch,
  };
};