import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// Thay đổi đường dẫn import RootState cho phù hợp với dự án của bạn
import { RootState } from "@/lib/redux/store";
import { API_ENDPOINTS } from "@/lib/apiEndPoints";
import * as courseService from "@/lib/services/course.service";
import * as profileService from "@/lib/services/profile.service";
import { Topic, Subject, Schedule, Course } from "../../../types/course";
import * as ratingService from "@/lib/services/rating.service"; // <-- THÊM IMPORT RATING SERVICE
import { showToast } from "./toastSlice";
import { Rating, CreateRatingPayload } from "@/lib/services/rating.service";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
export interface SearchFilters {
  keyword?: string; // Từ khóa tìm kiếm chung (có thể dùng để tìm theo tên gia sư, tên lớp, mô tả, v.v.)
  subjectName?: string;
  topicName?: string;
  format?: string;
  page?: number; // Thêm page vào filters để hỗ trợ phân trang
  size?: number; // Thêm size vào filters để hỗ trợ phân trang
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
  totalMatchingClasses?: number;
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
  totalCourses: number; // Thêm tổng số khóa học vào state để hiển thị trên UI

  tutorRatings: Rating[];
  tutorRatingSummary: { averageScore: number; totalReviews: number } | null;
  myTutorRating: Rating | null;
  loadingRatings: boolean;
  ratingsCurrentPage: number;
  ratingsTotalPages: number;
  isRatingSubmitting: boolean;
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
  totalCourses: 0,

  tutorRatings: [],
  tutorRatingSummary: { averageScore: 0, totalReviews: 0 },
  myTutorRating: null,
  loadingRatings: false,
  ratingsCurrentPage: 1,
  ratingsTotalPages: 1,
  isRatingSubmitting: false,
};

// --- Async Thunks ---
// const currentUser = useAppSelector((state) => state.profile.user);
// const currentUserId = currentUser?.id;
// 1. Hàm Get Danh sách Môn học & Chủ đề (API Mới)
export const getSearchSubjects = createAsyncThunk(
  "tutorFinding/getSearchSubjects",
  async (_, { getState, rejectWithValue }) => {
    try {
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

export const getTutorRatingsAsync = createAsyncThunk(
  "tutorFinding/getTutorRatings",
  async (
    { tutorId, page, size }: { tutorId: string; page: number; size: number },
    { rejectWithValue },
  ) => {
    try {
      // HÀM NÀY: Phải trả về nguyên cục phân trang (có chứa content và totalPages)
      return await ratingService.getRatingsByTutorId(tutorId, page, size);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getTutorRatingSummaryAsync = createAsyncThunk(
  "tutorFinding/getTutorRatingSummary",
  async (tutorId: string, { rejectWithValue }) => {
    try {
      return await ratingService.getTutorRatingSummary(tutorId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getMyTutorRatingAsync = createAsyncThunk(
  "tutorFinding/getMyTutorRating",
  async (
    { tutorId, userId }: { tutorId: string; userId: string },
    { rejectWithValue },
  ) => {
    try {
      return await ratingService.getMyRatingForTutor(tutorId, userId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const createRatingAsync = createAsyncThunk(
  "tutorFinding/createRating",
  async (
    payload: CreateRatingPayload,
    { dispatch, getState, rejectWithValue },
  ) => {
    try {
      const result = await ratingService.createRating(payload);
      dispatch(
        showToast({
          type: "success",
          title: "Thành công",
          message: "Cảm ơn bạn đã đánh giá!",
        }),
      );

      // 1. Dùng getState() để lấy toàn bộ dữ liệu Redux
      const state = getState() as RootState;
      // 2. Chọt vào đúng kho profile để lấy user ID
      const currentUserId = state.profile.user?.id;

      dispatch(getTutorRatingSummaryAsync(payload.tutorId));

      // 3. Nếu có ID thì mới gọi hàm getMyTutor...
      if (currentUserId) {
        dispatch(
          getMyTutorRatingAsync({
            tutorId: payload.tutorId,
            userId: String(currentUserId),
          }),
        );
      }
      return result;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Đánh giá thất bại";
      dispatch(showToast({ type: "error", title: "Lỗi", message: errorMsg }));
      return rejectWithValue(errorMsg);
    }
  },
);

export const updateRatingAsync = createAsyncThunk(
  "tutorFinding/updateRating",
  async (
    { ratingId, payload }: { ratingId: string; payload: CreateRatingPayload },
    { dispatch, getState, rejectWithValue },
  ) => {
    try {
      const result = await ratingService.updateRating(ratingId, payload);
      dispatch(
        showToast({
          type: "success",
          title: "Thành công",
          message: "Đã cập nhật đánh giá!",
        }),
      );

      // 1. Dùng getState() để lấy toàn bộ dữ liệu Redux
      const state = getState() as RootState;
      // 2. Chọt vào đúng kho profile để lấy user ID
      const currentUserId = state.profile.user?.id;

      dispatch(getTutorRatingSummaryAsync(payload.tutorId));

      // 3. Nếu có ID thì mới gọi hàm getMyTutor...
      if (currentUserId) {
        dispatch(
          getMyTutorRatingAsync({
            tutorId: payload.tutorId,
            userId: String(currentUserId),
          }),
        );
      }
      return result;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Cập nhật thất bại";
      dispatch(showToast({ type: "error", title: "Lỗi", message: errorMsg }));
      return rejectWithValue(errorMsg);
    }
  },
);

export const deleteRatingAsync = createAsyncThunk(
  "tutorFinding/deleteRating",
  async (
    { ratingId, tutorId }: { ratingId: string; tutorId: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      await ratingService.deleteRating(ratingId);
      dispatch(
        showToast({
          type: "success",
          title: "Thành công",
          message: "Đã xóa đánh giá!",
        }),
      );

      dispatch(getTutorRatingSummaryAsync(tutorId));
      // dispatch(getMyTutorRatingAsync({ tutorId, userId: "me" }));

      return ratingId;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Xóa thất bại";
      dispatch(showToast({ type: "error", title: "Lỗi", message: errorMsg }));
      return rejectWithValue(errorMsg);
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
        // Lấy mảng data trả về từ API
        const rawData = action.payload.data || [];

        // Map qua từng gia sư và đếm số lượng matchingClasses
        state.tutors = rawData.map((item: any) => {
          const matchCount = item.matchingClasses?.length || 0;
          return {
            ...item,
            totalMatchingClasses: matchCount, // Lưu lại con số vừa đếm được
          };
        });
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
        const tutorIndex = state.tutors.findIndex(
          (t) => t.tutor.id === tutorId,
        );
        if (tutorIndex !== -1) {
          state.tutors[tutorIndex].tutor.status = "APPROVED";
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
        const { tutorId } = action.meta.arg;

        // Tìm gia sư đó trong state và cập nhật trạng thái thành REJECTED + gắn lý do
        const tutorIndex = state.tutors.findIndex(
          (t) => t.tutor.id === tutorId,
        );
        if (tutorIndex !== -1) {
          state.tutors[tutorIndex].tutor.status = "REJECTED";
        }
      })
      .addCase(rejectTutorApplication.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    builder
      .addCase(getTutorRatingsAsync.pending, (state) => {
        state.loadingRatings = true;
      })
      .addCase(getTutorRatingsAsync.fulfilled, (state, action) => {
        state.loadingRatings = false;
        state.tutorRatings = action.payload?.content || [];
        state.ratingsTotalPages = action.payload?.totalPages || 1;
      })
      .addCase(getTutorRatingsAsync.rejected, (state) => {
        state.loadingRatings = false;
      });

    builder.addCase(getMyTutorRatingAsync.fulfilled, (state, action) => {
      state.myTutorRating = action.payload;
    });

    // 2. Lấy Tổng quan Đánh giá (Điểm trung bình & Tổng lượt đánh giá)
    builder.addCase(getTutorRatingSummaryAsync.fulfilled, (state, action) => {
      state.tutorRatingSummary = {
        averageScore: action.payload.averageScore,
        totalReviews: action.payload.totalReviews,
      };
    });

    // 4. Các trạng thái khi Đăng / Sửa / Xóa đánh giá
    builder
      .addCase(createRatingAsync.pending, (state) => {
        state.isRatingSubmitting = true;
      })
      .addCase(createRatingAsync.fulfilled, (state) => {
        state.isRatingSubmitting = false;
      })
      .addCase(createRatingAsync.rejected, (state) => {
        state.isRatingSubmitting = false;
      });

    builder
      .addCase(updateRatingAsync.pending, (state) => {
        state.isRatingSubmitting = true;
      })
      .addCase(updateRatingAsync.fulfilled, (state) => {
        state.isRatingSubmitting = false;
      })
      .addCase(updateRatingAsync.rejected, (state) => {
        state.isRatingSubmitting = false;
      });

    builder
      .addCase(deleteRatingAsync.pending, (state) => {
        state.isRatingSubmitting = true;
      })
      .addCase(deleteRatingAsync.fulfilled, (state, action) => {
        state.isRatingSubmitting = false;
        state.myTutorRating = null; // Cập nhật lại UI bản thân không còn đánh giá
        state.tutorRatings = state.tutorRatings.filter(
          (rating) => rating.id !== action.payload,
        ); // Xóa khỏi list hiện tại
      })
      .addCase(deleteRatingAsync.rejected, (state) => {
        state.isRatingSubmitting = false;
      });
  },
});

export const { setFilters, clearFilters, clearClassDetail, resetEnrollStatus } =
  tutorFindingSlice.actions;

export default tutorFindingSlice.reducer;
