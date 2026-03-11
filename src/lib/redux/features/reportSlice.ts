import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as reportService from '@/lib/services/report.service'; 
import { Report, CreateReportPayload } from '@/lib/services/report.service';

interface ReportState {
    reports: Report[]; 
    fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    submitStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ReportState = {
    reports: [],
    fetchStatus: 'idle',
    submitStatus: 'idle',
    error: null,
};

export const submitReportAsync = createAsyncThunk(
    'report/submitReport',
    async (payload: CreateReportPayload, { rejectWithValue }) => {
        try {
            const newReport = await reportService.createReport(payload);
            return newReport;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'Lỗi khi gửi báo cáo'
            );
        }
    }
);

// TODO: add fetchReportsAsync

const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        clearReportSubmitStatus: (state) => {
            state.submitStatus = 'idle';
            state.error = null;
        },
        clearReportState: () => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitReportAsync.pending, (state) => {
                state.submitStatus = 'loading';
                state.error = null;
            })
            .addCase(submitReportAsync.fulfilled, (state, action: PayloadAction<Report>) => {
                state.submitStatus = 'succeeded';
                state.reports.unshift(action.payload);
            })
            .addCase(submitReportAsync.rejected, (state, action) => {
                state.submitStatus = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { clearReportSubmitStatus, clearReportState } = reportSlice.actions;

export default reportSlice.reducer;