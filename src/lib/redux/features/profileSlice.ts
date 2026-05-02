import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/redux/store"; // Điều chỉnh path nếu cần
import {
  getUserInfo,
  updateUserInfo,
  uploadAvatarImage,
  updateInterests as updateInterestsApi,
} from "@/lib/services/user.service";
import { API_ENDPOINTS } from "@/lib/apiEndPoints";
import * as profileService from "@/lib/services/profile.service";
import { fetchProfileById } from "@/lib/services/profile.service";
import httpClient from "../../services/http";
// --- 1. Interfaces ---

// USER PROFILES
export interface UserProfile {
  id: string;
  accountId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  university: string | null;
  universityId: number | null;
  dob: string;
  bio: string;
  avatarUrl?: string | null;
  email: string;
  points: number;
  followerCount: number | null;
  followingCount: number | null;
  address?: string;
  phone?: string;
  isFollowing?: boolean;
  isFollower?: boolean;
  interestedTopics?: string[];
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  dob?: string;
  bio?: string;
  avatarUrl?: string | null;
  address?: string;
  phone?: string;
  universityId?: number;
}

// TUTOR PROFILES (Dựa theo cấu trúc API bạn cung cấp)
export interface TutorProfile {
  id: string;
  introduction: string;
  averageRating: number;
  ratingCount: number;
  status: string;
  name: string;
  avatar: string;
}

export interface RegisterTutorRequest {
  introduction: string;
  experience: string;
  cvUrl: string;
  name: string;
  avatar: string;
  subjectIds: string[];
}

export interface UpdateTutorRequest {
  introduction: string;
  name: string;
  avatar: string;
  subjectIds: string[];
}

export interface PaginatedUsers {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  data: UserProfile[];
}

// PROFILE STATE CHUNG
interface ProfileState {
  // State cho User
  user: UserProfile | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;

  // State cho Tutor
  tutor: TutorProfile | null;
  isTutorLoading: boolean;
  isTutorUpdating: boolean;
  isTutorRegistering: boolean;
  tutorError: string | null;

  followersData: PaginatedUsers | null;
  isFollowersLoading: boolean;
  followersError: string | null;

  followingData: PaginatedUsers | null;
  isFollowingLoading: boolean;
  followingError: string | null;

  viewedProfile: UserProfile | null;
  isViewedProfileLoading: boolean;
  viewedProfileError: string | null;

  viewedListProfile: PaginatedUsers | null;
  isViewedListProfileLoading: boolean;
  viewedListProfileError: string | null;

  // Upload state
  isAvatarUploading: boolean;
  isResourceUploading: boolean;
}

const initialState: ProfileState = {
  user: null,
  isLoading: false,
  isUpdating: false,
  error: null,

  tutor: null,
  isTutorLoading: false,
  isTutorUpdating: false,
  isTutorRegistering: false,
  tutorError: null,

  followersData: null,
  isFollowersLoading: false,
  followersError: null,

  followingData: null,
  isFollowingLoading: false,
  followingError: null,

  viewedProfile: null,
  isViewedProfileLoading: false,
  viewedProfileError: null,

  isAvatarUploading: false,
  isResourceUploading: false,

  viewedListProfile: null,
  isViewedListProfileLoading: false,
  viewedListProfileError: null,
};

export const getMyProfile = createAsyncThunk(
  "profile/getMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserInfo();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "errors.notFound",
      );
    }
  },
);

export const updateMyProfile = createAsyncThunk(
  "profile/updateMyProfile",
  async (updateData: UpdateProfileRequest, { rejectWithValue }) => {
    try {
      const data = await updateUserInfo(updateData);
      return data ? data : updateData;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "errors.profileUpdateFailed",
      );
    }
  },
);

export const updateMyInterests = createAsyncThunk(
  "profile/updateInterests",
  async (topicIds: string[], { dispatch, rejectWithValue }) => {
    try {
      await updateInterestsApi(topicIds);
      // Immediately refresh profile to sync state
      await dispatch(getMyProfile());
      return topicIds;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "errors.interestsUpdateFailed",
      );
    }
  },
);

export const getFollowingByProfileId = createAsyncThunk(
  "profile/getFollowingByProfileId",
  async (
    {
      profileId,
      page = 1,
      size = 10,
    }: { profileId: string; page?: number; size?: number },
    { rejectWithValue },
  ) => {
    try {
      return await profileService.fetchFollowingByProfileId(
        profileId,
        page,
        size,
      );
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const getFollowersByProfileId = createAsyncThunk(
  "profile/getFollowersByProfileId",
  async (
    {
      profileId,
      page = 1,
      size = 10,
    }: { profileId: string; page?: number; size?: number },
    { getState, rejectWithValue },
  ) => {
    try {
      return await profileService.fetchFollowersByProfileId(
        profileId,
        page,
        size,
      );
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const getProfileById = createAsyncThunk(
  "profile/getProfileById",
  async (profileId: string, { getState, rejectWithValue }) => {
    try {
      // 1. Lấy token an toàn cho cả Client lẫn Server (SSR)
      const state = getState() as RootState;
      let token = state.auth?.token;
      if (!token && typeof window !== "undefined") {
        token = localStorage.getItem("accessToken");
      }

      console.log(`Fetching profile for ID: ${profileId} with token: ${token}`);

      // 2. Dùng httpClient và API_ENDPOINTS để không bị hardcode IP
      // Đồng thời "bơm" trực tiếp token vào Header để vá lỗi của Interceptor khi chạy SSR
      const response = await httpClient.get(
        API_ENDPOINTS.ACCOUNT.GET_PROFILE_BY_ID(profileId),
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );

      // 3. Xử lý kết quả trả về từ Axios
      if (response.data.code !== 1000) {
        throw new Error(
          response.data.message || "Failed to fetch profile by ID",
        );
      }

      return response.data.result as UserProfile;
    } catch (error: any) {
      // Nếu lỗi từ Axios thì message thường nằm ở error.response.data.message
      const errorMessage =
        error.response?.data?.message || error.message || "errors.network";
      return rejectWithValue(errorMessage);
    }
  },
);

export const uploadAvatar = createAsyncThunk(
  "profile/uploadAvatar",
  async (file: File, { rejectWithValue }) => {
    try {
      const avatarUrl = await uploadAvatarImage(file);
      return avatarUrl;
    } catch (error: any) {
      return rejectWithValue(error.message || "errors.avatarUploadFailed");
    }
  },
);

export const uploadFile = createAsyncThunk(
  "profile/uploadFile",
  async (file: File, { rejectWithValue }) => {
    try {
      const fileUrl = await uploadAvatarImage(file);
      return fileUrl;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to upload file");
    }
  },
);

// ==================== TUTOR THUNKS ====================

export const getMyTutorProfile = createAsyncThunk(
  "profile/getMyTutorProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      return await profileService.fetchMyTutorProfile();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const registerTutorProfile = createAsyncThunk(
  "profile/registerTutorProfile",
  async (payload: RegisterTutorRequest, { getState, rejectWithValue }) => {
    try {
      return await profileService.registerTutor(payload);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateTutorProfile = createAsyncThunk(
  "profile/updateTutorProfile",
  async (updateData: UpdateTutorRequest, { getState, rejectWithValue }) => {
    try {
      return await profileService.updateTutor(updateData);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const searchProfiles = createAsyncThunk(
  "profile/searchProfiles",
  async (
    {
      keyword,
      page = 1,
      size = 10,
    }: { keyword: string; page?: number; size?: number },
    { rejectWithValue },
  ) => {
    try {
      return await profileService.searchProfiles(keyword, page, size);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// --- 3. Slice ---

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      // Xóa sạch mọi thứ khi đăng xuất
      state.user = null;
      state.error = null;
      state.isLoading = false;

      state.tutor = null;
      state.tutorError = null;
      state.isTutorLoading = false;
    },
    setLocalProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // --- Get User Profile ---
    builder
      .addCase(getMyProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload as UserProfile;
      })
      .addCase(getMyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // --- Update User Profile ---
    builder
      .addCase(updateMyProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (state.user) {
          state.user = {
            ...state.user,
            ...(action.payload as Partial<UserProfile>),
          };
        }
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(getFollowingByProfileId.pending, (state) => {
        state.isFollowingLoading = true;
        state.followingError = null;
      })
      .addCase(getFollowingByProfileId.fulfilled, (state, action) => {
        state.isFollowingLoading = false;
        state.followingData = action.payload;
      })
      .addCase(getFollowingByProfileId.rejected, (state, action) => {
        state.isFollowingLoading = false;
        state.followingError = action.payload as string;
      });

    // === THÊM MỚI: Handle Get Followers ===
    builder
      .addCase(getFollowersByProfileId.pending, (state) => {
        state.isFollowersLoading = true;
        state.followersError = null;
      })
      .addCase(getFollowersByProfileId.fulfilled, (state, action) => {
        state.isFollowersLoading = false;
        state.followersData = action.payload;
      })
      .addCase(getFollowersByProfileId.rejected, (state, action) => {
        state.isFollowersLoading = false;
        state.followersError = action.payload as string;
      });

    builder
      .addCase(getProfileById.pending, (state) => {
        state.isViewedProfileLoading = true;
        state.viewedProfileError = null;
      })
      .addCase(getProfileById.fulfilled, (state, action) => {
        state.isViewedProfileLoading = false;
        state.viewedProfile = action.payload;
      })
      .addCase(getProfileById.rejected, (state, action) => {
        state.isViewedProfileLoading = false;
        state.viewedProfileError = action.payload as string;
      });

    // --- Upload Avatar --
    builder
      .addCase(uploadAvatar.pending, (state) => {
        state.isAvatarUploading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.isAvatarUploading = false;
        if (state.user) {
          state.user.avatarUrl = action.payload as string;
        }
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isAvatarUploading = false;
        state.error = action.payload as string;
      });

    // --- Upload File ---
    builder
      .addCase(uploadFile.pending, (state) => {
        state.isResourceUploading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state) => {
        state.isResourceUploading = false;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isResourceUploading = false;
        state.error = action.payload as string;
      });

    // --- Get Tutor Profile ---
    builder
      .addCase(getMyTutorProfile.pending, (state) => {
        state.isTutorLoading = true;
        state.tutorError = null;
      })
      .addCase(getMyTutorProfile.fulfilled, (state, action) => {
        state.isTutorLoading = false;
        state.tutor = action.payload; // Gán dữ liệu tutor lấy được
      })
      .addCase(getMyTutorProfile.rejected, (state, action) => {
        state.isTutorLoading = false;
        state.tutorError = action.payload as string;
      });

    // --- Update Tutor Profile ---
    builder
      .addCase(updateTutorProfile.pending, (state) => {
        state.isTutorLoading = true;
        state.tutorError = null;
      })
      .addCase(updateTutorProfile.fulfilled, (state, action) => {
        state.isTutorUpdating = false;
        if (state.tutor) {
          state.tutor = {
            ...state.tutor,
            ...(action.payload as Partial<TutorProfile>),
          };
        }
      })
      .addCase(updateTutorProfile.rejected, (state, action) => {
        state.isTutorUpdating = false;
        state.tutorError = action.payload as string;
      });

    // --- Register Tutor Profile ---
    builder
      .addCase(registerTutorProfile.pending, (state) => {
        state.isTutorRegistering = true;
        state.tutorError = null;
      })
      .addCase(registerTutorProfile.fulfilled, (state, action) => {
        state.isTutorRegistering = false;
        state.tutor = action.payload; // Gán data sau khi đăng ký thành công
      })
      .addCase(registerTutorProfile.rejected, (state, action) => {
        state.isTutorRegistering = false;
        state.tutorError = action.payload as string;
      });

    // --- Search Profiles ---
    builder
      .addCase(searchProfiles.pending, (state) => {
        state.isViewedListProfileLoading = true;
        state.viewedListProfileError = null;
      })
      .addCase(searchProfiles.fulfilled, (state, action) => {
        state.isViewedListProfileLoading = false;
        state.viewedListProfile = action.payload as PaginatedUsers;
      })
      .addCase(searchProfiles.rejected, (state, action) => {
        state.isViewedListProfileLoading = false;
        state.viewedListProfileError = action.payload as string;
      });
  },
});

export const { clearProfile, setLocalProfile } = profileSlice.actions;
export default profileSlice.reducer;
