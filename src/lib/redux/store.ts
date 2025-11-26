import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import articleReducer from './features/articleSlice';
import layoutReducer from './features/layoutSlide';
import notificationReducer from './features/modalSlice';
import toastReducer from './features/toastSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            articles: articleReducer,
            ui: layoutReducer,
            notification: notificationReducer,
            toastNotification: toastReducer,
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];