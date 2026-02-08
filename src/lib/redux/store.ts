import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import articleReducer from './features/articleSlice';
import layoutReducer from './features/layoutSlide';
import blogReducer from './features/blogSlice';
import notificationReducer from './features/modalSlice';
import documentReducer from './features/documentSlice';
import toastReducer from './features/toastSlice';
import tutorCourseReducer from './features/tutorCourseSlice';
import profileReducer from './features/profileSlice';
export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            articles: articleReducer,
            blogs: blogReducer,
            documents: documentReducer,
            ui: layoutReducer,
            notification: notificationReducer,
            toastNotification: toastReducer,
            tutorCourse: tutorCourseReducer, 
            profile: profileReducer,

        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];