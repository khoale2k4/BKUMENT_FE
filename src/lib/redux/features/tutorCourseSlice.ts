import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// Adjust the import path for RootState to match your project structure
import { RootState } from '@/lib/redux/store'; 

// --- Interfaces ---

interface Schedule {
    dayOfWeek: string;
    startTime: string; // HH:MM:SS
    endTime: string;   // HH:MM:SS
}

interface CourseItem {
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

interface CreateClassRequest {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    topicId: string;
    schedules: Schedule[];
}

interface TutorCourseState {
    classes: CourseItem[];
    loading: boolean;
    submitting: boolean;
    error: string | null;
    // State for the new course form
    newCourse: CreateClassRequest;
}

const initialState: TutorCourseState = {
    classes: [],
    loading: false,
    submitting: false,
    error: null,
    newCourse: {
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        topicId: '',
        schedules: [],
    }
};

// --- Async Thunks ---

// 1. Get all classes for the tutor
export const getAllClasses = createAsyncThunk(
    'tutorCourse/getAllClasses',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            // FIX: Check if token exists before making the request
            if (!token) {
                return rejectWithValue('Unauthenticated: Missing access token');
            }

            const response = await fetch('http://localhost:8082/lms/classes/my-classes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();
            if (data.code !== 1000) throw new Error(data.message || 'Failed to fetch classes');
            return data.result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// 2. Create a new class
export const createClass = createAsyncThunk(
    'tutorCourse/createClass',
    async (courseData: CreateClassRequest, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            // FIX: Check if token exists before making the request
            if (!token) {
                return rejectWithValue('Unauthenticated: Missing access token');
            }

            const response = await fetch('http://localhost:8082/lms/classes', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(courseData),
            });

            const data = await response.json();
            if (data.code !== 1000) throw new Error(data.message);
            return data.result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// --- Slice ---

const tutorCourseSlice = createSlice({
    name: 'tutorCourse',
    initialState,
    reducers: {
        setNewCourseInfo: (state, action: PayloadAction<Partial<CreateClassRequest>>) => {
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
        }
    },
    extraReducers: (builder) => {
        // Handle getAllClasses
        builder
            .addCase(getAllClasses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllClasses.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = action.payload;
            })
            .addCase(getAllClasses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Handle createClass
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
    }
});

export const { 
    setNewCourseInfo, 
    addSchedule, 
    removeSchedule, 
    resetNewCourseForm 
} = tutorCourseSlice.actions;

export default tutorCourseSlice.reducer;