import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/lib/redux/store'; // Điều chỉnh path nếu cần
import { getUserInfo, updateUserInfo } from '@/lib/services/user.service';
import { API_ENDPOINTS } from '@/lib/apiEndPoints';

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
    name: string;
    avatar: string;
    subjectIds: string[];
}

export interface UpdateTutorRequest {
  introduction: string,
  name: string,
  avatar: string,
  subjectIds: string[]
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
};


// --- 2. Async Thunks ---

// ==================== USER THUNKS ====================

// Feature 1: Get My Profile (User)
export const getMyProfile = createAsyncThunk(
    'profile/getMyProfile',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getUserInfo();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch user profile');
        }
    }
);

// Feature 2: Edit My Profile (User)
export const updateMyProfile = createAsyncThunk(
    'profile/updateMyProfile',
    async (updateData: UpdateProfileRequest, { rejectWithValue }) => {
        try {
            const data = await updateUserInfo(updateData);
            return data ? data : updateData;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update user profile');
        }
    }
);

// ==================== TUTOR THUNKS ====================

// Feature 3: Get My Tutor Profile (Tutor)
export const getMyTutorProfile = createAsyncThunk(
    'profile/getMyTutorProfile',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token || sessionStorage.getItem('accessToken');

            const response = await fetch('http://localhost:8888/api/v1/lms/tutors/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            const data = await response.json();
            if (data.code !== 1000) throw new Error(data.message || 'Failed to fetch tutor profile');
            
            return data.result as TutorProfile;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Feature 4: Register / Create Tutor Profile (Tutor)
export const registerTutorProfile = createAsyncThunk(
    'profile/registerTutorProfile',
    async (payload: RegisterTutorRequest, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token || sessionStorage.getItem('accessToken');

            const response = await fetch('http://localhost:8888/api/v1/lms/tutors/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.code !== 1000) throw new Error(data.message || 'Failed to register tutor');
            else{
                alert('Tutor registration successful:');
                console.log('Tutor registration successful:', data.result);
            }
            
            return data.result as TutorProfile;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Update tutor profile 
export const updateTutorProfile = createAsyncThunk(
    'profile/updateTutorProfile',
    async (updateData: UpdateTutorRequest, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token || sessionStorage.getItem('accessToken');

            const response = await fetch(API_ENDPOINTS.ACCOUNT.UPDATE_TUTOR_INFO, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();
            return data.result as TutorProfile;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// --- 3. Slice ---

const profileSlice = createSlice({
    name: 'profile',
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
        }
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
                    state.user = { ...state.user, ...(action.payload as Partial<UserProfile>) };
                }
            })
            .addCase(updateMyProfile.rejected, (state, action) => {
                state.isUpdating = false;
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
                    state.tutor = { ...state.tutor, ...(action.payload as Partial<TutorProfile>) };
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
    }
});

export const { clearProfile, setLocalProfile } = profileSlice.actions;
export default profileSlice.reducer;