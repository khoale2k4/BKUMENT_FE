import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import httpClient from './http';
import { CreateClassRequest, CourseItem, Subject, ClassNotification, CreateNotificationRequest } from '../redux/features/tutorCourseSlice';

export const getAllTeachingClasses = async (page: number, size: number) => {
    const response = await httpClient.get(API_ENDPOINTS.LMS.GET_TEACHING_CLASSES(page, size));
    return response.data;
};

export const getMySubjects = async (): Promise<Subject[]> => {
    const response = await httpClient.get(API_ENDPOINTS.LMS.GET_TUTOR_SUBJECTS);
    return response.data.result;
};

export const createClass = async (courseData: CreateClassRequest) => {
    const response = await httpClient.post(API_ENDPOINTS.LMS.ADD_NEW_CLASS, courseData);
    return response.data.result;
};

export const updateClass = async (classId: string, courseData: CreateClassRequest) => {
    const response = await httpClient.patch(API_ENDPOINTS.LMS.UPDATE_CLASS(classId), courseData);
    return response.data.result;
};

export const cancelClass = async (classId: string) => {
    const response = await httpClient.delete(API_ENDPOINTS.LMS.CANCEL_CLASS(classId));
    return response.data;
};

export const getMemberInCourse = async (courseId: string) => {
    const response = await httpClient.get(API_ENDPOINTS.LMS.GET_CLASS_MEMBERS(courseId));
    return response.data.result;
};

export const getMemberPendingInCourse = async (courseId: string) => {
    const response = await httpClient.get(API_ENDPOINTS.LMS.GET_MEMBER_PENDING(courseId));
    return response.data.result;
};

export const getClassesByTutorId = async (tutorId: string): Promise<CourseItem[]> => {
    const response = await httpClient.get(API_ENDPOINTS.LMS.GET_CLASSES_BY_TUTORID(tutorId));
    return response.data.result;
};

export const approveMember = async (enrollmentId: string, isApproved: boolean) => {
    const response = await httpClient.patch(API_ENDPOINTS.LMS.APPROVE_ENROLLMENT(enrollmentId, isApproved));
    return response.data.result;
};

export const getClassNotifications = async (classId: string, page: number, size: number) => {
    const response = await httpClient.get(API_ENDPOINTS.LMS.GET_CLASS_NOTIFICATIONS(classId, page, size));
    return response.data.result;
};

export const createClassNotification = async (classId: string, payload: CreateNotificationRequest): Promise<ClassNotification> => {
    const response = await httpClient.post(API_ENDPOINTS.LMS.CREATE_CLASS_NOTIFICATION(classId), payload);
    return response.data.result;
};

export const getClassDocuments = async (courseId: string, page: number, size: number) => {
    const response = await httpClient.get(API_ENDPOINTS.LMS.GET_CLASS_DOCUMENTS(courseId, page, size));
    // Provide a fallback logic just like the original code did
    response.data.result.coverImage = response.data.result.coverImage || response.data.result.previewImageUrl;
    return response.data.result;
};
