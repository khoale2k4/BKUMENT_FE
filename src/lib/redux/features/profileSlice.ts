import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserInfo, updateUserInfo } from '@/lib/services/user.service';

// --- 1. Interfaces ---
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
    avatarUrl: string | null; 
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
    avatarUrl?: string;
    address?: string;
    phone?: string;
    universityId?: number;
}

interface ProfileState {
    user: UserProfile | null;
    isLoading: boolean;
    isUpdating: boolean;
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
    async (_, { rejectWithValue }) => {
        try {
            const data = await getUserInfo();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch profile');
        }
    }
);

// Feature 2: Edit My Profile
export const updateMyProfile = createAsyncThunk(
    'profile/updateMyProfile',
    async (updateData: UpdateProfileRequest, { rejectWithValue }) => {
        try {
            const data = await updateUserInfo(updateData);
            return data ? data : updateData;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update profile');
        }
    }
);

// --- 3. Slice ---
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.user = null;
            state.error = null;
            state.isLoading = false;
        },
        setLocalProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        }
    },
    extraReducers: (builder) => {
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
    }
});

export const { clearProfile, setLocalProfile } = profileSlice.actions;
export default profileSlice.reducer;