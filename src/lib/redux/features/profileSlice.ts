import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/lib/redux/store'; 

// --- 1. Interfaces ---

export interface UserProfile {
    id: string;
    accountId: string;
    fullName: string;
    firstName: string;
    lastName: string;
    university: string | null;
    universityId: number | null;
    dob: string; // YYYY-MM-DD
    bio: string;
    avatarUrl: string;
    email: string;
    points: number;
    followerCount: number | null;
    followingCount: number | null;
    // Thêm các trường có thể có trong response hoặc cần thiết cho UI
    address?: string;
    phone?: string;
}

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    dob?: string;
    bio?: string;
    avatarUrl?: string;
    address?: string;
    phone?: string;
    universityId?: number;
}

interface ProfileState {
    user: UserProfile | null;
    isLoading: boolean;   // Trạng thái khi đang fetch profile
    isUpdating: boolean;  // Trạng thái khi đang update (để hiện loading ở nút Save)
    error: string | null;
}

const initialState: ProfileState = {
    user: null,
    isLoading: false,
    isUpdating: false,
    error: null,
};

// --- 2. Async Thunks ---

// Feature 1: Get My Profile
export const getMyProfile = createAsyncThunk(
    'profile/getMyProfile',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                return rejectWithValue('Unauthenticated: Missing access token');
            }

            const response = await fetch('http://localhost:8081/profile/my-profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

        

            const data = await response.json();

            console.log("Fetched profile data:", data);
            
            if (data.code !== 1000) {
                throw new Error(data.message || 'Failed to fetch profile');
            }
            
            return data.result as UserProfile;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Feature 2: Edit My Profile (PATCH)
export const updateMyProfile = createAsyncThunk(
    'profile/updateMyProfile',
    async (updateData: UpdateProfileRequest, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                return rejectWithValue('Unauthenticated: Missing access token');
            }

            console.log("Updating profile with data:", updateData);

            const response = await fetch('http://localhost:8081/profile/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();



            if (data.code !== 1000) {
                throw new Error(data.message || 'Failed to update profile');
            }

            // Trả về chính dữ liệu đã gửi để cập nhật UI ngay lập tức (Optimistic Update)
            // Hoặc trả về data.result nếu API backend trả về User Object mới sau khi update
            return data.result ? data.result : updateData;
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
        // Action để reset profile khi logout
        clearProfile: (state) => {
            state.user = null;
            state.error = null;
            state.isLoading = false;
        },
        // Action cập nhật cục bộ nếu cần (ví dụ update avatar xong muốn set ngay)
        setLocalProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        }
    },
    extraReducers: (builder) => {
        // --- Xử lý getMyProfile ---
        builder
            .addCase(getMyProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getMyProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(getMyProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // --- Xử lý updateMyProfile ---
        builder
            .addCase(updateMyProfile.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(updateMyProfile.fulfilled, (state, action) => {
                state.isUpdating = false;
                // Cập nhật lại state.user với dữ liệu mới
                if (state.user) {
                    // Merge dữ liệu cũ với dữ liệu mới cập nhật
                    state.user = { ...state.user, ...action.payload };
                }
            })
            .addCase(updateMyProfile.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearProfile, setLocalProfile } = profileSlice.actions;
export default profileSlice.reducer;