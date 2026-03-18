import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// Thay đổi đường dẫn import RootState cho phù hợp với dự án của bạn
import { RootState } from "@/lib/redux/store";
import { API_ENDPOINTS } from "@/lib/apiEndPoints";
// Interface cho các tham số tìm kiếm đầu vào
export interface SearchFilters {
  keyword?: string; // Từ khóa tìm kiếm chung (có thể dùng để tìm theo tên gia sư, tên lớp, mô tả, v.v.)
  subjectName?: string;
  topicName?: string;
  format?: string;
}

// Thêm Interface cho Topic và Subject (từ API mới)
export interface Topic {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  topics: Topic[];
}

interface Schedule {
  dayOfWeek: string;
  startTime: string; // HH:MM:SS
  endTime: string; // HH:MM:SS
}

interface Course {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  schedules: Schedule[];
  status: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  topicName: string;
  subjectName: string;
  userStatus: string;
}

interface TutorInfo {
  id: string;
  introduction: string;
  averageRating: number;
  ratingCount: number;
  status: string;
  name: string;
  avatar: string;
}

// Interface định nghĩa kết quả trả về từ API (dựa theo response JSON trước đó của bạn)
export interface TutorData {
  tutor: TutorInfo;
  matchingClasses: Course[];
}

// Interface cho State của Slice này
interface TutorFindingState {
  tutors: TutorData[]; // Danh sách gia sư tìm được
  loading: boolean; // Trạng thái chờ gọi API
  error: string | null; // Lưu lỗi nếu có
  filters: SearchFilters; // Lưu trữ bộ lọc hiện tại trên UI

  subjects: Subject[]; // Danh sách môn học và chủ đề
  loadingSubjects: boolean; // Trạng thái chờ load danh sách môn
  errorSubjects: string | null;

  studyingClasses: Course[];
  studyingCurrentPage: number;
  studyingTotalPages: number;
  loadingStudying: boolean;
  errorStudying: string | null;
  // THÊM STATE CHO CLASS DETAILS
  currentClassDetail: Course | null;
  loadingClassDetail: boolean;
  errorClassDetail: string | null;

  isEnrolling: boolean;
  enrollError: string | null;
  enrollSuccess: boolean;
}

const initialState: TutorFindingState = {
  tutors: [],
  loading: false,
  error: null,
  filters: {
    keyword: "",
    subjectName: "",
    topicName: "",
    format: "",
  },

  subjects: [],
  loadingSubjects: false,
  errorSubjects: null,
  studyingClasses: [],
  studyingCurrentPage: 1,
  studyingTotalPages: 1,
  loadingStudying: false,
  errorStudying: null,
  currentClassDetail: null,
  loadingClassDetail: false,
  errorClassDetail: null,

  isEnrolling: false,
  enrollError: null,
  enrollSuccess: false,
};

// --- Async Thunks ---

// 1. Hàm Get Danh sách Môn học & Chủ đề (API Mới)
export const getSearchSubjects = createAsyncThunk(
  "tutorFinding/getSearchSubjects",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth?.token;
      const response = await fetch(API_ENDPOINTS.LMS.GET_SUBJECTS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();
      //   console.log("Subjects API response:", data); // Debug log để xem cấu trúc dữ liệu trả về

      if (data.code !== 1000) {
        throw new Error(data.message || "Failed to fetch subjects");
      }
      return data.result as Subject[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Hàm tìm kiếm Gia sư / Lớp học
export const searchTutors = createAsyncThunk(
  "tutorFinding/searchTutors",
  async (filters: SearchFilters, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth?.token;

      // 1. Tự động xây dựng Query String động bằng URLSearchParams
      // Nó sẽ tự động mã hóa UTF-8 tiếng Việt thành định dạng %C6%A1... chuẩn HTTP
      const queryParams = new URLSearchParams();

      if (filters.subjectName)
        queryParams.append("subjectName", filters.subjectName);
      if (filters.topicName) queryParams.append("topicName", filters.topicName);
      if (filters.format) queryParams.append("format", filters.format);
      if (filters.keyword) queryParams.append("keyword", filters.keyword);
      const queryString = queryParams.toString();
      const url = `${API_ENDPOINTS.LMS.SEARCH_CLASSES}${queryString ? `?${queryString}` : ""}`;
      // 2. Gửi Request
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Tùy chọn: Gửi token nếu API search yêu cầu đăng nhập, nếu là public thì bỏ đoạn này đi
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();

      // 3. Xử lý dữ liệu trả về
      if (data.code !== 1000)
        throw new Error(data.message || "Failed to search tutors");
      return data.result as TutorData[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Lấy các lớp học của mình
export const getAllStudyingClasses = createAsyncThunk(
  "tutorCourse/getAllStudyingClasses",
  async (
    { page, size }: { page: number; size: number },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem("accessToken");

      // Chèn page và size vào URL
      const response = await fetch(
        `http://localhost:8888/api/v1/lms/classes/my-class?page=${page}&size=${size}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );

      const data = await response.json();
      console.log("API Response for getAllStudyingClasses:", data); // Debug log
      if (data.code !== 1000) throw new Error(data.message);

      // Trả về toàn bộ cục result (chứa cả data và totalPages)
      return data.result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Lấy chi tiết lớp học bằng classID
export const getClassDetailsById = createAsyncThunk(
  "tutorFinding/getClassDetailsById",
  async (classId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:8888/api/v1/lms/classes/${classId}`, // Sử dụng classId được truyền vào
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );

      const data = await response.json();
      console.log("API Response for getClassDetailsById:", data);

      if (data.code !== 1000) throw new Error(data.message || "Failed to fetch class details");

      // Trả về object Course chi tiết
      return data.result as Course;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// tham gia vào lớp học mới
// Học viên đăng ký tham gia lớp học
export const enrollInClass = createAsyncThunk(
  "tutorFinding/enrollInClass",
  async (classId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem("accessToken");

      if (!token) {
        return rejectWithValue("Vui lòng đăng nhập để đăng ký lớp học.");
      }

      const response = await fetch(
        `http://localhost:8888/api/v1/lms/classes/${classId}/enroll`,
        {
          method: "POST", // Thường Enroll là POST
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // body: JSON.stringify({}), // Thêm body nếu Backend yêu cầu (ví dụ gửi ghi chú cho gia sư)
        }
      );

      const data = await response.json();
      console.log("API Response for enrollInClass:", data);

      if (data.code !== 1000) {
        throw new Error(data.message || "Đăng ký tham gia lớp học thất bại.");
      }

      // Trả về kết quả thành công
      return data.result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);



// --- Slice ---

const tutorFindingSlice = createSlice({
  name: "tutorFinding",
  initialState,
  reducers: {
    // Lưu lại bộ lọc mà người dùng đang chọn trên giao diện
    setFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Reset bộ lọc về rỗng
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearClassDetail: (state) => {
      state.currentClassDetail = null;
      state.errorClassDetail = null;
    },
    // THÊM: Reset trạng thái enroll (Dùng khi user đóng popup thành công hoặc chuyển trang)
    resetEnrollStatus: (state) => {
      state.isEnrolling = false;
      state.enrollError = null;
      state.enrollSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchTutors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTutors.fulfilled, (state, action) => {
        state.loading = false;
        state.tutors = action.payload || action.payload || []; // Gán data.result trả về vào list tutors
      })
      .addCase(searchTutors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Xử lý getSearchSubjects (Mới)
    builder
      .addCase(getSearchSubjects.pending, (state) => {
        state.loadingSubjects = true;
        state.errorSubjects = null;
      })
      .addCase(getSearchSubjects.fulfilled, (state, action) => {
        state.loadingSubjects = false;
        const payloadData = action.payload as any;
        state.subjects = payloadData?.data || payloadData?.content || (Array.isArray(payloadData) ? payloadData : []);
      })
      .addCase(getSearchSubjects.rejected, (state, action) => {
        state.loadingSubjects = false;
        state.errorSubjects = action.payload as string;
      });
    // Xử lý getAllStudyingClasses
    builder
      .addCase(getAllStudyingClasses.pending, (state) => {
        state.loadingStudying = true;
        state.errorStudying = null;
      })
      .addCase(getAllStudyingClasses.fulfilled, (state, action) => {
        state.loadingStudying = false;
        // Bóc tách đúng mảng data và các thông số phân trang
        state.studyingClasses = action.payload.data || [];
        state.studyingCurrentPage = action.payload.currentPage || 1;
        state.studyingTotalPages = action.payload.totalPages || 1;
      })
      .addCase(getAllStudyingClasses.rejected, (state, action) => {
        state.loadingStudying = false;
        state.errorStudying = action.payload as string;
      });

    builder
      .addCase(getClassDetailsById.pending, (state) => {
        state.loadingClassDetail = true;
        state.errorClassDetail = null;
      })
      .addCase(getClassDetailsById.fulfilled, (state, action) => {
        state.loadingClassDetail = false;
        state.currentClassDetail = action.payload; // Lưu chi tiết lớp học vào state
      })
      .addCase(getClassDetailsById.rejected, (state, action) => {
        state.loadingClassDetail = false;
        state.errorClassDetail = action.payload as string;
      });

    // Xử lý enrollInClass
    builder
      .addCase(enrollInClass.pending, (state) => {
        state.isEnrolling = true;
        state.enrollError = null;
        state.enrollSuccess = false;
      })
      .addCase(enrollInClass.fulfilled, (state) => {
        state.isEnrolling = false;
        state.enrollSuccess = true;
        // Tùy chọn: Nếu muốn cập nhật trực tiếp UI số lượng học viên, bạn có thể chỉnh sửa `state.currentClassDetail` ở đây
      })
      .addCase(enrollInClass.rejected, (state, action) => {
        state.isEnrolling = false;
        state.enrollError = action.payload as string;
        state.enrollSuccess = false;
      });
  },
});

export const { setFilters, clearFilters, clearClassDetail, resetEnrollStatus } = tutorFindingSlice.actions;

export default tutorFindingSlice.reducer;
