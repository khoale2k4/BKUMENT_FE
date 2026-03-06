import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  getSearchSubjects,
  searchTutors,
  setFilters,
} from "@/lib/redux/features/tutorFindingSlice";

export const useTutorSearch = () => {
  const dispatch = useAppDispatch();
  const { tutors, loading, error, filters, subjects } = useAppSelector(
    (state) => state.tutorFinding,
  );

  // Gọi API lần đầu khi component mount
  useEffect(() => {
    dispatch(getSearchSubjects());
    dispatch(searchTutors(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleFilterChange = (field: string, value: string) => {
    dispatch(setFilters({ [field]: value }));
  };

  const handleSearch = () => {
    console.log("Searching tutors with filters:", filters); // Debug log để xem bộ lọc khi search
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
