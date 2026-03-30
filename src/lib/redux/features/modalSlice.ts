import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// Nhớ import file service mà bạn đã tạo ở bước trước
import * as notificationService from "@/lib/services/notification.service";
import { AppNotification } from "@/lib/services/notification.service";

export type NotificationType = "success" | "error" | "warning" | "info";

interface ModalState {
  // 1. Dành cho Popup/Toast Alert
  notification: {
    isOpen: boolean;
    type: NotificationType;
    title: string;
    message: string;
  };

  // 2. Dành cho Popup Report
  reportModal: {
    isOpen: boolean;
    targetId: string | null;
    type: "DOCUMENT" | "BLOG" | "ACCOUNT";
  };

  // 3. THÊM MỚI: Dành cho Danh sách thông báo của toàn App (Trang Notification)
  appNotifications: {
    data: AppNotification[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    unreadCount: number; // Có thể thêm trường này nếu bạn muốn hiển thị số lượng thông báo chưa đọc ở đâu đó trong UI
  };
}

const initialState: ModalState = {
  notification: {
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  },
  reportModal: {
    isOpen: false,
    targetId: null,
    type: "DOCUMENT",
  },
  // Khởi tạo state cho danh sách thông báo
  appNotifications: {
    data: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    unreadCount: 0,
  },
};

interface ReportModalType {
  targetId: string;
  type: "DOCUMENT" | "BLOG" | "ACCOUNT";
}

// --- Async Thunk để gọi API lấy danh sách thông báo ---
export const getAppNotifications = createAsyncThunk(
  "modal/getAppNotifications",
  async (
    { page, size }: { page: number; size: number },
    { rejectWithValue },
  ) => {
    try {
      console.log("Dispatching getAppNotifications with params:", {
        page,
        size,
      }); // Debug log
      console.log("page and size in getAppNotifications:", page, size); // Debug log
      return await notificationService.fetchNotifications(page, size);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getUnreadNotificationCount = createAsyncThunk(
  "modal/getUnreadNotificationCount",
  async (_, { rejectWithValue }) => {
    try {
      return await notificationService.fetchUnreadCount();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const markAsRead = createAsyncThunk(
  "modal/markAsRead",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await notificationService.markNotificationRead(notificationId);
      return notificationId; // Trả về ID để tự động update UI cục bộ
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const markAllAsRead = createAsyncThunk(
  "modal/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllNotificationsRead();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    // ... Các reducer cũ của bạn ...
    showNotification: (
      state,
      action: PayloadAction<{
        type: NotificationType;
        title: string;
        message: string;
      }>,
    ) => {
      state.notification.isOpen = true;
      state.notification.type = action.payload.type;
      state.notification.title = action.payload.title;
      state.notification.message = action.payload.message;
    },
    hideNotification: (state) => {
      state.notification.isOpen = false;
    },

    openReportModal: (state, action: PayloadAction<ReportModalType>) => {
      state.reportModal.isOpen = true;
      state.reportModal.targetId = action.payload.targetId;
      state.reportModal.type = action.payload.type;
    },
    closeReportModal: (state) => {
      state.reportModal.isOpen = false;
      state.reportModal.targetId = null;
    },

    // Thêm reducer để reset danh sách thông báo nếu cần
    clearAppNotifications: (state) => {
      state.appNotifications.data = [];
      state.appNotifications.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. Load danh sách (SỬA LẠI THÀNH LUÔN GHI ĐÈ)
      .addCase(getAppNotifications.pending, (state) => {
        state.appNotifications.loading = true;
      })
      .addCase(getAppNotifications.fulfilled, (state, action) => {
        state.appNotifications.loading = false;

        const newData = action.payload.data || action.payload.content || [];

        // LUÔN LUÔN GHI ĐÈ DATA MỚI (Dùng cho Pagination rời)
        state.appNotifications.data = newData;

        state.appNotifications.currentPage = action.payload.currentPage;
        state.appNotifications.totalPages = action.payload.totalPages;
      })
      .addCase(getAppNotifications.rejected, (state, action) => {
        state.appNotifications.loading = false;
      })

      // 2. Lấy số lượng chưa đọc
      .addCase(getUnreadNotificationCount.fulfilled, (state, action) => {
        state.appNotifications.unreadCount = action.payload;
      })

      // 3. Đánh dấu đã đọc 1 cái (Cập nhật UI mượt mà)
      .addCase(markAsRead.fulfilled, (state, action) => {
        const noti = state.appNotifications.data.find(
          (n) => n.id === action.payload,
        );
        if (noti && !noti.read) {
          noti.read = true; // Tắt highlight xanh
          state.appNotifications.unreadCount = Math.max(
            0,
            state.appNotifications.unreadCount - 1,
          ); // Trừ đi 1
        }
      })

      // 4. Đánh dấu tất cả đã đọc
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.appNotifications.data.forEach((noti) => {
          noti.read = true;
        });
        state.appNotifications.unreadCount = 0;
      });
  },
});

export const {
  showNotification,
  hideNotification,
  openReportModal,
  closeReportModal,
  clearAppNotifications, // Export thêm action này
} = modalSlice.actions;

export default modalSlice.reducer;
