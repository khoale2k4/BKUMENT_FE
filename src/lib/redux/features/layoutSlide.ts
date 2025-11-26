import { createSlice } from '@reduxjs/toolkit';

interface LayoutState {
    isSidebarOpen: boolean;
}

const initialState: LayoutState = {
    isSidebarOpen: false,
};

export const layoutReducer = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        closeSidebar: (state) => {
            state.isSidebarOpen = false;
        },
        openSidebar: (state) => {
            state.isSidebarOpen = true;
        }
    },
});

export const { toggleSidebar, closeSidebar, openSidebar } = layoutReducer.actions;
export default layoutReducer.reducer;