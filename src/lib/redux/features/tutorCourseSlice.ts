import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// Adjust the import path for RootState to match your project structure
import { RootState } from "@/lib/redux/store";
import { API_ENDPOINTS } from "@/lib/apiEndPoints";
import * as courseService from '@/lib/services/course.service';
import httpClient from "@/lib/services/http";
// --- Interfaces ---

export interface Schedule {
  dayOfWeek: string;
  startTime: string; // HH:MM:SS
  endTime: string; // HH:MM:SS
}

export interface CourseItem {
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
}

// Interface cho Môn học và Chủ đề (New)
export interface Topic {
  id: string;
  name: string;
}

export interface Subject {
  id: string; // VD: INT1005
  name: string; // VD: Cơ sở dữ liệu
  topics: Topic[];
}

export interface CreateClassRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  topicId: string;
  schedules: Schedule[];
}

interface TutorCourseState {
  classes: CourseItem[];
  subjects: Subject[]; // (New) Danh sách môn học tutor được dạy
  loading: boolean;
  submitting: boolean;
  error: string | null;
  // State for the new course form
  currentPage: number;
  totalPages: number;
  newCourse: CreateClassRequest;
  members: any[]; // Có thể định nghĩa interface riêng cho member nếu cần
  pendingMembers: any[]; // Danh sách thành viên chờ duyệt
  loadingMembers: boolean;
  viewedTutorClasses: CourseItem[];
  loadingViewedClasses: boolean;
  notifications: ClassNotification[];
  notificationsCurrentPage: number;
  notificationsTotalPages: number;
  loadingNotifications: boolean;
  creatingNotification: boolean; // Dùng riêng cho nút "Gửi thông báo" để hiện loading xoay xoay
  notificationError: string | null;

  classDocuments: any[];
  documentsCurrentPage: number;
  documentsTotalPages: number;
  loadingDocuments: boolean;
  documentsError: string | null;
}

const initialState: TutorCourseState = {
  classes: [],
  subjects: [], // (New)
  loading: false,
  submitting: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  newCourse: {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    topicId: "",
    schedules: [],
  },
  members: [],
  pendingMembers: [],
  loadingMembers: false,
  viewedTutorClasses: [],
  loadingViewedClasses: false,
  notifications: [],
  notificationsCurrentPage: 1,
  notificationsTotalPages: 1,
  loadingNotifications: false,
  creatingNotification: false,
  notificationError: null,
  classDocuments: [],
  documentsCurrentPage: 1,
  documentsTotalPages: 1,
  loadingDocuments: false,
  documentsError: null,
};

// --- Interfaces --- (Thêm vào phần đầu file)

export interface ClassNotification {
  id: string;
  title: string;
  message: string;
  sentAt: string;
  classId: string;
  className: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
}

// 1. Get all classes for the tutor
export const getAllTeachingClasses = createAsyncThunk(
  "tutorCourse/getAllTeachingClasses",
  async ({ page, size }: { page: number; size: number }, { rejectWithValue }) => {
    try {
      const data = await courseService.getAllTeachingClasses(page, size);
      if (data.code !== 1000) throw new Error(data.message);
      return data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// 2. Get tutor's subjects and topics (New)
export const getMySubjects = createAsyncThunk(
  "tutorCourse/getMySubjects",
  async (_, { rejectWithValue }) => {
    try {
      return await courseService.getMySubjects();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// 3. Create a new class
export const createClass = createAsyncThunk(
  "tutorCourse/createClass",
  async (courseData: CreateClassRequest, { rejectWithValue }) => {
    try {
      return await courseService.createClass(courseData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// 3. Update an existing class
export const updateClass = createAsyncThunk(
  "tutorCourse/updateClass",
  async (
    { classId, courseData }: { classId: string; courseData: CreateClassRequest },
    { rejectWithValue },
  ) => {
    try {
      return await courseService.updateClass(classId, courseData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// 4. Cancel/Delete a class
export const cancelClass = createAsyncThunk(
  "tutorCourse/cancelClass",
  async (classId: string, { rejectWithValue }) => {
    try {
      const data = await courseService.cancelClass(classId);
      if (data.code !== 1000) throw new Error(data.message || "Failed to cancel class");
      return classId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// 5. Get members in a course
export const getMemberInCourse = createAsyncThunk(
  "tutorCourse/getMemberInCourse",
  async (courseId: string, { rejectWithValue }) => {
    try {
      return await courseService.getMemberInCourse(courseId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// 6. Get pending members in a course (chờ gia sư duyệt)
export const getMemberPendingInCourse = createAsyncThunk(
  "tutorCourse/getMemberPendingInCourse",
  async (courseId: string, { rejectWithValue }) => {
    try {
      return await courseService.getMemberPendingInCourse(courseId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// 7. Get classes by tutorId
export const getClassesByTutorId = createAsyncThunk(
  "tutorClasses/getClassesByTutorId",
  async (tutorId: string, { rejectWithValue }) => {
    try {
      return await courseService.getClassesByTutorId(tutorId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// 8. Approve or Reject member enrollment
export const approveMember = createAsyncThunk(
  "tutorCourse/approveMember",
  async (
    { enrollmentId, isApproved }: { enrollmentId: string; isApproved: boolean },
    { rejectWithValue },
  ) => {
    try {
      const result = await courseService.approveMember(enrollmentId, isApproved);
      return { enrollmentId, isApproved, result };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// 9. Lấy danh sách thông báo của một lớp học (Có phân trang)
export const getClassNotifications = createAsyncThunk(
  "tutorCourse/getClassNotifications",
  async (
    { classId, page, size }: { classId: string; page: number; size: number },
    { rejectWithValue },
  ) => {
    try {
      return await courseService.getClassNotifications(classId, page, size);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// 10. Tạo thông báo mới cho lớp học
export const createClassNotification = createAsyncThunk(
  "tutorCourse/createClassNotification",
  async (
    { classId, payload }: { classId: string; payload: CreateNotificationRequest },
    { rejectWithValue },
  ) => {
    try {
      return await courseService.createClassNotification(classId, payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// 11. Lấy danh sách tài liệu của lớp học (Có phân trang)
export const getClassDocuments = createAsyncThunk(
  "tutorCourse/getClassDocuments",
  async (
    { courseId, page, size }: { courseId: string; page: number; size: number },
    { rejectWithValue },
  ) => {
    try {
      return await courseService.getClassDocuments(courseId, page, size);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);



const tutorCourseSlice = createSlice({
  name: "tutorCourse",
  initialState,
  reducers: {
    setNewCourseInfo: (
      state,
      action: PayloadAction<Partial<CreateClassRequest>>,
    ) => {
      state.newCourse = { ...state.newCourse, ...action.payload };
    },
    addSchedule: (state, action: PayloadAction<Schedule>) => {
      state.newCourse.schedules.push(action.payload);
    },
    removeSchedule: (state, action: PayloadAction<number>) => {
      state.newCourse.schedules.splice(action.payload, 1);
    },
    resetNewCourseForm: (state) => {
      state.newCourse = initialState.newCourse;
    },
  },
  extraReducers: (builder) => {
    // --- Handle getAllClasses ---
    builder
      .addCase(getAllTeachingClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTeachingClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload.data || []; // Đảm bảo luôn có mảng
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(getAllTeachingClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // --- Handle getMySubjects (New) ---
    builder
      .addCase(getMySubjects.pending, (state) => {
        state.loading = true; // Có thể tách ra loadingSubjects nếu cần
        state.error = null;
      })
      .addCase(getMySubjects.fulfilled, (state, action) => {
        state.loading = false;
        // Xử lý cả trường hợp trả về trực tiếp mảng hoặc object chứa thuộc tính data/content từ phân trang
        state.subjects = (action.payload as any)?.data || (action.payload as any)?.content || (Array.isArray(action.payload) ? action.payload : []);
      })
      .addCase(getMySubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // --- Handle createClass ---
    builder
      .addCase(createClass.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state) => {
        state.submitting = false;
        state.newCourse = initialState.newCourse; // Reset form on success
      })
      .addCase(createClass.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });

    // --- Handle updateClass ---
    builder
      .addCase(updateClass.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state) => {
        state.submitting = false;
        state.newCourse = initialState.newCourse; // Reset form on success
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });
    // Trong extraReducers của tutorCourseSlice:
    builder
      .addCase(getMemberInCourse.pending, (state) => {
        state.loadingMembers = true;
        state.error = null;
      })
      .addCase(getMemberInCourse.fulfilled, (state, action) => {
        state.loadingMembers = false;
        state.members = action.payload?.data || action.payload || []; // action.payload chính là data.result từ API
      })
      .addCase(getMemberInCourse.rejected, (state, action) => {
        state.loadingMembers = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(getMemberPendingInCourse.pending, (state) => {
        state.loadingMembers = true;
        state.error = null;
      })
      .addCase(getMemberPendingInCourse.fulfilled, (state, action) => {
        state.loadingMembers = false;
        state.pendingMembers = action.payload?.data || action.payload || [];
      })
      .addCase(getMemberPendingInCourse.rejected, (state, action) => {
        state.loadingMembers = false;
        state.error = action.payload as string;
      });

    // --- Handle getClassDocuments ---
    builder
      .addCase(getClassDocuments.pending, (state) => {
        state.loadingDocuments = true;
        state.documentsError = null;
      })
      .addCase(getClassDocuments.fulfilled, (state, action) => {
        state.loadingDocuments = false;
        state.classDocuments = action.payload?.data || action.payload?.content || (Array.isArray(action.payload) ? action.payload : []);
        state.documentsCurrentPage = action.payload?.currentPage || 1;
        state.documentsTotalPages = action.payload?.totalPages || 1;
      })
      .addCase(getClassDocuments.rejected, (state, action) => {
        state.loadingDocuments = false;
        state.documentsError = action.payload as string;
      });

    builder
      .addCase(approveMember.fulfilled, (state, action) => {
        const { enrollmentId, isApproved } = action.payload;

        // 1. Tìm và lấy data của member đang chờ duyệt
        const pendingIndex = state.pendingMembers.findIndex(
          (m) => m.id === enrollmentId,
        );

        if (pendingIndex !== -1) {
          const memberToMove = state.pendingMembers[pendingIndex];

          // 2. Xóa khỏi danh sách chờ duyệt
          state.pendingMembers.splice(pendingIndex, 1);

          // 3. Nếu là Accept (isApproved = true), đổi status và push sang danh sách chính thức
          if (isApproved) {
            memberToMove.status = "APPROVED";
            state.members.push(memberToMove);
          }
        }
      })
      .addCase(approveMember.rejected, (state, action) => {
        // Có thể xử lý thông báo lỗi toàn cục ở đây nếu cần
        console.error("Lỗi duyệt:", action.payload);
      });

    builder
      .addCase(getClassesByTutorId.pending, (state) => {
        state.loadingViewedClasses = true;
        state.error = null;
      })
      .addCase(getClassesByTutorId.fulfilled, (state, action) => {
        state.loadingViewedClasses = false;
        state.viewedTutorClasses = action.payload.data || action.payload || []; // Gán vào biến này để không đè lên 'classes'
      })
      .addCase(getClassesByTutorId.rejected, (state, action) => {
        state.loadingViewedClasses = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(getClassNotifications.pending, (state) => {
        state.loadingNotifications = true;
        state.notificationError = null;
      })
      .addCase(getClassNotifications.fulfilled, (state, action) => {
        state.loadingNotifications = false;
        state.notifications = action.payload?.data || [];
        state.notificationsCurrentPage = action.payload?.currentPage || 1;
        state.notificationsTotalPages = action.payload?.totalPages || 1;
      })
      .addCase(getClassNotifications.rejected, (state, action) => {
        state.loadingNotifications = false;
        state.notificationError = action.payload as string;
      });

    // --- Handle createClassNotification ---
    builder
      .addCase(createClassNotification.pending, (state) => {
        state.creatingNotification = true;
        state.notificationError = null;
      })
      .addCase(createClassNotification.fulfilled, (state, action) => {
        state.creatingNotification = false;

        // UX Cực tốt: Thay vì phải gọi lại API lấy list, 
        // ta đẩy luôn thông báo mới vừa tạo lên ĐẦU danh sách hiện tại.
        // Giúp UI cập nhật ngay lập tức mà không bị giật lag.
        state.notifications.unshift(action.payload);
      })
      .addCase(createClassNotification.rejected, (state, action) => {
        state.creatingNotification = false;
        state.notificationError = action.payload as string;
      });
  },
});

export const {
  setNewCourseInfo,
  addSchedule,
  removeSchedule,
  resetNewCourseForm,
} = tutorCourseSlice.actions;

export default tutorCourseSlice.reducer;
