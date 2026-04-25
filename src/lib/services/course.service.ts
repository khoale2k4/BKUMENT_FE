import { API_ENDPOINTS } from "@/lib/apiEndPoints";
import httpClient from "./http";
import {
  CreateClassRequest,
  ClassNotification,
  CreateNotificationRequest,
} from "../redux/features/tutorCourseSlice";
import { Topic, Subject, Schedule, Course } from "../../types/course";
import { SearchFilters } from "../redux/features/tutorFindingSlice";

export const getAllTeachingClasses = async (page: number, size: number) => {
  const response = await httpClient.get(
    API_ENDPOINTS.LMS.GET_TEACHING_CLASSES(page, size),
  );
  return response.data;
};

export const getMySubjects = async (): Promise<Subject[]> => {
  const response = await httpClient.get(API_ENDPOINTS.LMS.GET_TUTOR_SUBJECTS);
  return response.data.result;
};

export const createClass = async (courseData: CreateClassRequest) => {
  console.log("DEBUG CHECK COURSE DATA at createClass SERVICE:", courseData);
  const response = await httpClient.post(
    API_ENDPOINTS.LMS.ADD_NEW_CLASS,
    courseData,
  );
  return response.data.result;
};

export const updateClass = async (
  classId: string,
  courseData: CreateClassRequest,
) => {
  console.log("DEBUG CHECK COURSE DATA at updateClass SERVICE:", courseData);
  const response = await httpClient.patch(
    API_ENDPOINTS.LMS.UPDATE_CLASS(classId),
    courseData,
  );
  return response.data.result;
};

export const cancelClass = async (classId: string) => {
  const response = await httpClient.delete(
    API_ENDPOINTS.LMS.CANCEL_CLASS(classId),
  );
  return response.data;
};

export const getMemberInCourse = async (courseId: string) => {
  const response = await httpClient.get(
    API_ENDPOINTS.LMS.GET_CLASS_MEMBERS(courseId),
  );
  return response.data.result;
};

export const getMemberPendingInCourse = async (courseId: string) => {
  const response = await httpClient.get(
    API_ENDPOINTS.LMS.GET_MEMBER_PENDING(courseId),
  );
  return response.data.result;
};

export const getClassesByTutorId = async (
  tutorId: string,
  page: number,
  size: number,
): Promise<Course[]> => {
  const response = await httpClient.get(
    API_ENDPOINTS.LMS.GET_CLASSES_BY_TUTORID(tutorId, page, size),
  );
  return response.data.result;
};

export const approveMember = async (
  enrollmentId: string,
  isApproved: boolean,
) => {
  const response = await httpClient.patch(
    API_ENDPOINTS.LMS.APPROVE_ENROLLMENT(enrollmentId, isApproved),
  );
  return response.data.result;
};

export const getClassNotifications = async (
  classId: string,
  page: number,
  size: number,
) => {
  const response = await httpClient.get(
    API_ENDPOINTS.LMS.GET_CLASS_NOTIFICATIONS(classId, page, size),
  );
  return response.data.result;
};

export const createClassNotification = async (
  classId: string,
  payload: CreateNotificationRequest,
): Promise<ClassNotification> => {
  const response = await httpClient.post(
    API_ENDPOINTS.LMS.CREATE_CLASS_NOTIFICATION(classId),
    payload,
  );
  return response.data.result;
};

export const getClassDocuments = async (
  courseId: string,
  page: number,
  size: number,
) => {
  const response = await httpClient.get(
    API_ENDPOINTS.LMS.GET_CLASS_DOCUMENTS(courseId, page, size),
  );
  // Provide a fallback logic just like the original code did
  response.data.result.coverImage =
    response.data.result.coverImage || response.data.result.previewImageUrl;
  return response.data.result;
};

// 1. Lấy danh sách Môn học & Chủ đề (Public)
export const getSearchSubjects = async () => {
  const response = await httpClient.get(API_ENDPOINTS.LMS.GET_SUBJECTS);
  return response.data.result;
};

// 2. Tìm kiếm Lớp học / Gia sư (Dùng params của httpClient tự động sinh query string)
export const searchTutors = async (filters: SearchFilters) => {
  const response = await httpClient.get(API_ENDPOINTS.LMS.SEARCH_CLASSES, {
    params: filters, // httpClient tự động loại bỏ các field undefined và nối thành ?keyword=...&subjectName=...
  });
  console.log("API Response for search tutors:", response.data.result); // Debug log

  return response.data.result;
};

// 3. Lấy danh sách Lớp học Học viên ĐANG HỌC
export const getAllStudyingClasses = async (page: number, size: number) => {
  // Tùy theo cách bạn định nghĩa trong apiEndPoints.ts, có thể là function hoặc string + params
  // Ví dụ nếu là string:
  const response = await httpClient.get(
    API_ENDPOINTS.LMS.GET_STUDYING_CLASSES(page, size),
  );
  return response.data.result;
};

// 4. Lấy chi tiết một Lớp học bằng ID
export const getClassDetailsById = async (classId: string) => {
  // Giả sử GET_CLASS_DETAILS là một function nhận classId
  const response = await httpClient.get(
    API_ENDPOINTS.LMS.GET_CLASS_DETAILS(classId),
  );
  console.log("API Response for class details:", response.data.result); // Debug log
  return response.data.result;
};

// 5. Học viên Đăng ký tham gia Lớp học
export const enrollInClass = async (classId: string) => {
  // Giả sử ENROLL_CLASS là function nhận classId
  const response = await httpClient.post(
    API_ENDPOINTS.LMS.ENROLL_CLASS(classId),
  );
  return response.data.result;
};

export const getTrendingClasses = async (page: number, size: number) => {
  const response = await httpClient.get(
    API_ENDPOINTS.LMS.GET_TRENDING_CLASSES(page, size),
  );
  console.log("API Response for trending classes:", response.data.result); // Debug log
  return response.data.result;
};

export const getRecommendedClasses = async (page: number, size: number) => {
  const response = await httpClient.get(
    API_ENDPOINTS.LMS.GET_RECOMMENDED_CLASSES(page, size),
  );
  console.log("API Response for recommended classes:", response.data.result); // Debug log
  return response.data.result;
};
