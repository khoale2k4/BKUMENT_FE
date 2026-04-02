import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// Thay đổi đường dẫn import RootState cho phù hợp với dự án của bạn
import { RootState } from "@/lib/redux/store";
import { API_ENDPOINTS } from "@/lib/apiEndPoints";
import * as courseService from "@/lib/services/course.service";
import * as profileService from "@/lib/services/profile.service";

export interface SearchFilters {
  keyword?: string; // Từ khóa tìm kiếm chung (có thể dùng để tìm theo tên gia sư, tên lớp, mô tả, v.v.)
  subjectName?: string;
  topicName?: string;
  format?: string;
  page?: number; // Thêm page vào filters để hỗ trợ phân trang
  size?: number; // Thêm size vào filters để hỗ trợ phân trang
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

  experience?: string;
  cvUrl?: string;
  profileId?: string;
  subjectIds?: string[];
  rejectionReason?: string | null;
  createdAt?: string;
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
  currentPage: number;
  totalPages: number;
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
    page: 1, // Mặc định bắt đầu từ trang 1
    size: 3, // Mặc định mỗi trang có 3 kết quả
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
  currentPage: 1,
  totalPages: 1,
};

// --- Async Thunks ---

// 1. Hàm Get Danh sách Môn học & Chủ đề (API Mới)
export const getSearchSubjects = createAsyncThunk(
  "tutorFinding/getSearchSubjects",
  async (_, { getState, rejectWithValue }) => {
    try {
      // const state = getState() as RootState;
      // const token = state.auth?.token;
      // const response = await fetch(API_ENDPOINTS.LMS.GET_SUBJECTS, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     ...(token && { Authorization: `Bearer ${token}` }),
      //   },
      // });

      // const data = await response.json();
      // //   console.log("Subjects API response:", data); // Debug log để xem cấu trúc dữ liệu trả về

      // if (data.code !== 1000) {
      //   throw new Error(data.message || "Failed to fetch subjects");
      // }
      // return data.result as Subject[];
      return await courseService.getSearchSubjects(); // Gọi trực tiếp service đã được viết sẵn
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
      // const state = getState() as RootState;
      // const token = state.auth?.token;

      // // 1. Tự động xây dựng Query String động bằng URLSearchParams
      // // Nó sẽ tự động mã hóa UTF-8 tiếng Việt thành định dạng %C6%A1... chuẩn HTTP
      // const queryParams = new URLSearchParams();

      // if (filters.subjectName)
      //   queryParams.append("subjectName", filters.subjectName);
      // if (filters.topicName) queryParams.append("topicName", filters.topicName);
      // if (filters.format) queryParams.append("format", filters.format);
      // if (filters.keyword) queryParams.append("keyword", filters.keyword);
      // const queryString = queryParams.toString();
      // const url = `${API_ENDPOINTS.LMS.SEARCH_CLASSES}${queryString ? `?${queryString}` : ""}`;
      // // 2. Gửi Request
      // const response = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     // Tùy chọn: Gửi token nếu API search yêu cầu đăng nhập, nếu là public thì bỏ đoạn này đi
      //     ...(token && { Authorization: `Bearer ${token}` }),
      //   },
      // });

      // const data = await response.json();
      // console.log("Search Classs API response:", data); // Debug log để xem cấu trúc dữ liệu trả về

      // // 3. Xử lý dữ liệu trả về
      // if (data.code !== 1000)
      //   throw new Error(data.message || "Failed to search tutors");
      // return data.result as TutorData[];
      return await courseService.searchTutors(filters); // Gọi trực tiếp service đã được viết sẵn
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
      // const state = getState() as RootState;
      // const token = state.auth.token || sessionStorage.getItem("accessToken");

      // // Chèn page và size vào URL
      // const response = await fetch(
      //   `http://localhost:8888/api/v1/lms/classes/my-class?page=${page}&size=${size}`,
      //   {
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //       ...(token && { Authorization: `Bearer ${token}` }),
      //     },
      //   },
      // );

      // const data = await response.json();
      // console.log("API Response for getAllStudyingClasses:", data); // Debug log
      // if (data.code !== 1000) throw new Error(data.message);

      // // Trả về toàn bộ cục result (chứa cả data và totalPages)
      // return data.result;
      return await courseService.getAllStudyingClasses(page, size); // Gọi trực tiếp service đã được viết sẵn
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
      // const state = getState() as RootState;
      // const token = state.auth.token || sessionStorage.getItem("accessToken");

      // const response = await fetch(
      //   `http://localhost:8888/api/v1/lms/classes/${classId}`, // Sử dụng classId được truyền vào
      //   {
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //       ...(token && { Authorization: `Bearer ${token}` }),
      //     },
      //   },
      // );

      // const data = await response.json();
      // console.log("API Response for getClassDetailsById:", data);

      // if (data.code !== 1000) throw new Error(data.message || "Failed to fetch class details");

      // // Trả về object Course chi tiết
      // return data.result as Course;
      return await courseService.getClassDetailsById(classId); // Gọi trực tiếp service đã được viết sẵn
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
      // const state = getState() as RootState;
      // const token = state.auth.token || sessionStorage.getItem("accessToken");

      // if (!token) {
      //   return rejectWithValue("Vui lòng đăng nhập để đăng ký lớp học.");
      // }

      // const response = await fetch(
      //   `http://localhost:8888/api/v1/lms/classes/${classId}/enroll`,
      //   {
      //     method: "POST", // Thường Enroll là POST
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //     // body: JSON.stringify({}), // Thêm body nếu Backend yêu cầu (ví dụ gửi ghi chú cho gia sư)
      //   }
      // );

      // const data = await response.json();
      // console.log("API Response for enrollInClass:", data);

      // if (data.code !== 1000) {
      //   throw new Error(data.message || "Đăng ký tham gia lớp học thất bại.");
      // }

      // // Trả về kết quả thành công
      // return data.result;
      return await courseService.enrollInClass(classId); // Gọi trực tiếp service đã được viết sẵn
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const getTutorApplication = createAsyncThunk(
  "profile/getTutorApplication",
  async (
    { status, page, size }: { status: string; page: number; size: number },
    { getState, rejectWithValue },
  ) => {
    try {
      return await profileService.getTutorsApplication(status, page, size);

      // Gọi trực tiếp service đã được viết sẵn
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const approveTutorApplication = createAsyncThunk(
  "profile/approveTutorApplication",
  async (tutorId: string, { rejectWithValue }) => {
    try {
      return await profileService.approveTutorApplication(tutorId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const rejectTutorApplication = createAsyncThunk(
  "profile/rejectTutorApplication",
  async (
    { tutorId, reason }: { tutorId: string; reason: string },
    { rejectWithValue },
  ) => {
    try {
      return await profileService.rejectTutorApplication(tutorId, reason);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchTutors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTutors.fulfilled, (state, action) => {
        state.loading = false;
        state.tutors = action.payload.data || []; // Gán data.result trả về vào list tutors
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
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
        state.subjects =
          payloadData?.data ||
          payloadData?.content ||
          (Array.isArray(payloadData) ? payloadData : []);
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
    // Xử lý GET Tutor Application (Dành cho ADMIN)
    builder
      .addCase(getTutorApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTutorApplication.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Tutor applications fetched successfully:", action.payload);

        const adminData = action.payload.data || [];

        // TỐI ƯU HÓA: Chuẩn hóa dữ liệu Admin về chung form với dữ liệu User
        state.tutors = adminData.map((item: any) => ({
          tutor: {
            id: item.id,
            name: item.name,
            avatar: item.avatar,
            introduction: item.introduction,
            status: item.status,
            // Các trường riêng của Admin
            experience: item.experience,
            cvUrl: item.cvUrl,
            profileId: item.profileId,
            subjectIds: item.subjectIds,
            rejectionReason: item.rejectionReason,
            createdAt: item.createdAt,
            // Fallback cho các trường của User
            averageRating: 0,
            ratingCount: 0,
          },
          matchingClasses: [], // Admin không có thông tin lớp học matching
        }));
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(getTutorApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

      builder
      .addCase(approveTutorApplication.pending, (state) => {
        // Bạn có thể không cần set loading = true ở đây nếu không muốn giật UI
        // state.loading = true; 
        state.error = null;
      })
      .addCase(approveTutorApplication.fulfilled, (state, action) => {
        // state.loading = false;
        
        // Tuyệt chiêu: Lấy tutorId mà bạn đã truyền vào thunk thông qua action.meta.arg
        const tutorId = action.meta.arg; 

        // Tìm gia sư đó trong state và cập nhật trạng thái thành APPROVED
        const tutorIndex = state.tutors.findIndex((t) => t.tutor.id === tutorId);
        if (tutorIndex !== -1) {
          state.tutors[tutorIndex].tutor.status = 'APPROVED';
        }
      })
      .addCase(approveTutorApplication.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload as string;
      });

    // ==========================================
    // Xử lý Từ chối (Reject) Gia sư
    // ==========================================
    builder
      .addCase(rejectTutorApplication.pending, (state) => {
        state.error = null;
      })
      .addCase(rejectTutorApplication.fulfilled, (state, action) => {
        // Lấy thông tin tutorId và reason đã truyền vào thunk
        const { tutorId} = action.meta.arg;

        // Tìm gia sư đó trong state và cập nhật trạng thái thành REJECTED + gắn lý do
        const tutorIndex = state.tutors.findIndex((t) => t.tutor.id === tutorId);
        if (tutorIndex !== -1) {
          state.tutors[tutorIndex].tutor.status = 'REJECTED';
        }
      })
      .addCase(rejectTutorApplication.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, clearClassDetail, resetEnrollStatus } =
  tutorFindingSlice.actions;

export default tutorFindingSlice.reducer;
