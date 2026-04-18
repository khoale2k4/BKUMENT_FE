import React, { useMemo } from "react";
import { Search, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SearchFilters } from "@/lib/redux/features/tutorFindingSlice";
import { Subject, Topic } from "@/types/course";

interface TutorSearchFiltersProps {
  filters: SearchFilters;
  subjects: Subject[];
  loading: boolean;
  onFilterChange: (field: string, value: string) => void;
  onSearch: () => void;
}

const TutorSearchFilters: React.FC<TutorSearchFiltersProps> = ({
  filters,
  subjects,
  loading,
  onFilterChange,
  onSearch,
}) => {
  const { t } = useTranslation();
  // Tự động lọc ra danh sách Topics dựa trên Subject
  const availableTopics = useMemo(() => {
    if (!filters.subjectName) return [];
    const foundSubject = subjects.find(
      (s) => s.name.toLowerCase() === filters.subjectName?.toLowerCase(),
    );
    return foundSubject ? foundSubject.topics : [];
  }, [filters.subjectName, subjects]);

  // Xử lý khi đổi môn học: Tự động xóa Topic cũ đi
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange("subjectName", e.target.value);
    onFilterChange("topicName", "");
  };

  // Hỗ trợ bấm Enter để tìm kiếm
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex flex-col gap-5 mb-12">
      {/* --- ROW 1: Thanh Tìm Kiếm Chính --- */}
      <div className="relative w-full shadow-sm rounded-full">
        <input
          type="text"
          placeholder={t('tutors.filters.searchPlaceholder')}
          value={filters.keyword || ""}
          onChange={(e) => onFilterChange("keyword", e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-6 pr-14 py-3.5 bg-white border border-gray-200 rounded-full text-base focus:ring-1 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all placeholder:text-gray-500"
        />
        <button
          onClick={onSearch}
          disabled={loading}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-black transition-colors"
        >
          {loading ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <Search size={22} />
          )}
        </button>
      </div>

      {/* --- ROW 2: Các Tag Bộ Lọc (Datalist & Select) --- */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Tag 1: Subject */}
        <div className="relative">
          <input
            list="subject-list"
            type="text"
            placeholder={t('tutors.filters.subjectPlaceholder')}
            value={filters.subjectName || ""}
            onChange={handleSubjectChange}
            className="w-48 md:w-56 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all placeholder:text-gray-500"
          />
          <datalist id="subject-list">
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.name} />
            ))}
          </datalist>
        </div>

        {/* Tag 2: Topic */}
        <div className="relative">
          <input
            list="topic-list"
            type="text"
            placeholder={
              filters.subjectName
                ? t('tutors.filters.topicPlaceholder')
                : t('tutors.filters.selectSubjectFirst')
            }
            value={filters.topicName || ""}
            onChange={(e) => onFilterChange("topicName", e.target.value)}
            disabled={!filters.subjectName}
            className="w-56 md:w-64 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed placeholder:text-gray-500"
          />
          <datalist id="topic-list">
            {availableTopics.map((topic) => (
              <option key={topic.id} value={topic.name} />
            ))}
          </datalist>
        </div>

        {/* Tag 3: Format */}
        <select
          value={filters.format || ""}
          onChange={(e) => onFilterChange("format", e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all cursor-pointer appearance-none"
          // Tùy chỉnh icon mũi tên nhỏ bên phải giống trong ảnh
          style={{
            paddingRight: "2rem",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D1D5DB'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1rem",
          }}
        >
          <option value="">{t('tutors.filters.allFormats')}</option>
          <option value="ONLINE">{t('tutors.filters.online')}</option>
          <option value="OFFLINE">{t('tutors.filters.offline')}</option>
        </select>

        {/* Nút Tìm kiếm (Tùy chọn hiển thị ở hàng này cho rõ ràng) */}
        <button
          onClick={onSearch}
          disabled={loading}
          className="px-6 py-2 bg-slate-900 hover:bg-black text-white text-sm font-medium rounded-full transition-colors active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {t('tutors.filters.searchBtn')}
        </button>
      </div>
    </div>
  );
};

export default TutorSearchFilters;
