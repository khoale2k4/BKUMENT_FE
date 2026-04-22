import { GET } from "@/app/api/documents/courses/route";
import { UNDERSCORE_GLOBAL_ERROR_ROUTE } from "next/dist/shared/lib/entry-constants";
import { RegisterTutorRequest } from "./redux/features/profileSlice";
// https://api.bkument.io.vn/
// http://143.198.80.199:8888/api/v1
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.bkument.io.vn/api/v1";
// http://143.198.80.199:8099
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://143.198.80.199:8099";

//http://143.198.80.199:8888/api/v1
const IDENTITY = "/identity";
const PROFILE = "/profile";
const LMS = "/lms";
// const PROFILE_URL = "http://143.198.80.199:8888/api/v1";
// const CHAT_URL = "http://143.198.80.199:8888/api/v1";
const CHAT = "/communication";
// const LMS_URL = "http://143.198.80.199:8888/api/v1/lms";
const SOCIAL = "/social";
const DOCUMENT = "/document";
const BLOG = "/blog";
// const SOCKET_URL = "http://localhost:8099";
const RESOURCE = "/resource";
const AI = "/ai";

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: buildUrl(`${IDENTITY}/auth/login`),
    SIGNUP: buildUrl(`${IDENTITY}/accounts/registration`),
    LOGOUT: buildUrl(`${IDENTITY}/auth/logout`),
    PROFILE: buildUrl(`${IDENTITY}/api/auth/me`),
    REFRESH_TOKEN: buildUrl(`${IDENTITY}/auth/refresh`),
    FORGOT_PASSWORD_WITH_EMAIL: (email: string) =>
      buildUrl(`${IDENTITY}/auth/forgot-password?email=${email}`),

    RESET_PASSWORD: buildUrl(`${IDENTITY}/auth/reset-password`),
    //http://143.198.80.199:8888/api/v1/identity/auth/forgot-password?email=lythanhnhatquangthongnhat2004%40gmail.com
    VERIFY_RESET_TOKEN: (token: string) =>
      buildUrl(`${IDENTITY}/auth/verify-email?token=${token}`),
  },

  ACCOUNT: {
    PROFILE: buildUrl(`${IDENTITY}/api/auth/me`),
    GET_USER_INFO: buildUrl(`${PROFILE}/my-profile`),
    PEOPLE_MAY_KNOW: (page: number, size: number) =>
      buildUrl(`${PROFILE}/mayKnow?page=${page}&size=${size}`),
    TUTOR_GETS: buildUrl(`/api/user/tutors`),
    UPDATE_USER_INFO: buildUrl(`${PROFILE}/my-profile`),
    GET_UNIVERSITIES: (page: number, size: number) =>
      buildUrl(`${PROFILE}/universities/search?page=${page}&size=${size}`),
    // http://143.198.80.199:8888/api/v1/profile/universities/search?page=1&size=10
    UPDATE_TUTOR_INFO: buildUrl(`${LMS}/tutors/me`),
    FOLLOW: (id: string) => buildUrl(`${PROFILE}/${id}/follow`),
    GET_FOLLOWERS: (id: string, page: number, size: number) =>
      buildUrl(`${PROFILE}/${id}/followers?page=${page}&size=${size}`),
    GET_FOLLOWING: (id: string, page: number, size: number) =>
      buildUrl(`${PROFILE}/${id}/following?page=${page}&size=${size}`),
    GET_PROFILE_BY_ID: (id: string) => buildUrl(`${PROFILE}/${id}`),
  },

  DOCUMENTS: {
    SEARCH: (page: number, size: number) =>
      buildUrl(`${DOCUMENT}/search?page=${page}&size=${size}`),

    UPDATE_METADATA: buildUrl(`${DOCUMENT}/updateMetadata`),

    ANALYSE_DOCUMENT: (assetId: string, fileName?: string) =>
      buildUrl(
        `${DOCUMENT}/analyze/${assetId}${
          fileName ? `?fileName=${fileName}` : ""
        }`,
      ),

    GET_DETAIL: (id: string | number) => buildUrl(`${DOCUMENT}/search?q=${id}`),

    RELATED_DOCUMENTS: (id: string, page: number, size: number) =>
      buildUrl(`${DOCUMENT}/related/${id}?page=${page}&size=${size}`),

    RECOMMENDED_DOCUMENTS: (page: number, size: number) =>
      buildUrl(`${DOCUMENT}/recommendations?page=${page}&size=${size}`),

    GET_UNIVERSITIES: buildUrl(`${PROFILE}/universities`),

    COURSES: (query: string) => buildUrl(`${LMS}/subjects?q=${query}`),

    // http://143.198.80.199:8888/api/v1/profile/universities/search?query=HC&page=1&size=10

    SEARCH_UNIVERSITIES: (query: string, page: number, size: number) =>
      buildUrl(`${PROFILE}/search?q=${query}&page=${page}&size=${size}`),
    MY_DOCUMENTS: (page: number, size: number) =>
      buildUrl(`${DOCUMENT}/my-documents?page=${page}&size=${size}`),
    USER_DOCUMENTS: (userId: string, page: number, size: number) =>
      buildUrl(`${DOCUMENT}/user/${userId}?page=${page}&size=${size}`),
    TOP_DOCUMENTS: (page: number, size: number) =>
      buildUrl(`${DOCUMENT}/top-documents?page=${page}&size=${size}`),
    DELETE: (id: string) => buildUrl(`${DOCUMENT}/${id}`),
  },

  BLOGS: {
    SEARCH: (page: number, size: number) =>
      buildUrl(`${BLOG}/search?page=${page}&size=${size}`),

    GET_DETAIL: (id: string | number) => buildUrl(`${BLOG}/search?q=${id}`),

    UPLOAD_NEW_BLOG: buildUrl(`${BLOG}`),
    MY_BLOGS: (page: number, size: number) =>
      buildUrl(`${BLOG}/my-blogs?page=${page}&size=${size}`),
    USER_BLOGS: (userId: string, page: number, size: number) =>
      buildUrl(`${BLOG}/user/${userId}?page=${page}&size=${size}`),
    TOP_BLOGS: (page: number, size: number) =>
      buildUrl(`${BLOG}/top-blog?page=${page}&size=${size}`),
    DELETE: (id: string) => buildUrl(`${BLOG}/${id}`),
    // // http://143.198.80.199:8888/api/v1/blog/user/6b2348e2-4629-4a1a-a66c-275444f5061f?page=0&size=10
    // GET_USER_BLOGS: (userId: string, page: number, size: number) =>
    //   buildUrl(`${BLOG}/user/${userId}?page=${page}&size=${size}`),
  },

  RESOURCE: {
    GET_PRESIGNED_URL: (fileName: string) =>
      buildUrl(`${RESOURCE}/presign?fileName=${fileName}`),

    UPDATE_METADATA: buildUrl(`${RESOURCE}/metadata`),

    LINK_IMAGE_FILEID: (fileId: string) =>
      buildUrl(`${RESOURCE}/download/asset/${fileId}`),
  },

  CHAT: {
    GET_CONVERSATIONS: (page: number, size: number) =>
      buildUrl(
        `${CHAT}/conversations/my-conversations?page=${page}&size=${size}`,
      ),

    START_CONVERSATIONS: buildUrl(`${CHAT}/conversations/create`),

    UPDATE_CONVERSATION: (id: string) =>
      buildUrl(`${CHAT}/conversations/${id}/metadata`),

    GET_MESSAGES: (conversationId: string, page: number, size: number) =>
      buildUrl(
        `${CHAT}/messages?conversationId=${conversationId}&page=${page}&size=${size}`,
      ),

    SEND_MESSAGE: buildUrl(`${CHAT}/messages/create`),

    GET_APP_NOTIFICATION: (page: number, size: number) =>
      buildUrl(`${CHAT}/notifications?page=${page}&size=${size}`),
    COUNT_UNREAD_NOTIFICATIONS: buildUrl(`${CHAT}/notifications/unread-count`),
    MARK_ALL_NOTIFICATIONS_READ: buildUrl(`${CHAT}/notifications/read-all`),
    MARK_NOTIFICATION_READ: (id: string) =>
      buildUrl(`${CHAT}/notifications/${id}/read`),
  },

  COMMENTS: {
    GET_BY_DOC: (id: string, page: number, size: number) =>
      buildUrl(`${SOCIAL}/comments/resource/${id}?page=${page}&size=${size}`),

    GET_BY_PARENT_COMMENT: (id: string, page: number, size: number) =>
      buildUrl(`${SOCIAL}/comments/reply/${id}?page=${page}&size=${size}`),

    CREATE: buildUrl(`${SOCIAL}/comments`),
  },

  RATINGS: {
    // http://143.198.80.199:8888/api/v1/social/ratings/tutor
    RATING_TUTOR: buildUrl(`${SOCIAL}/ratings/tutor`),
    // http://143.198.80.199:8888/api/v1/social/ratings/tutor/9810c099-4de0-4c4c-89d1-0bbb6fc4b291?page=0&size=10
    GET_TUTOR_RATINGS: (tutorId: string, page: number, size: number) =>
      buildUrl(`${SOCIAL}/ratings/tutor/${tutorId}?page=${page}&size=${size}`),
    // http://143.198.80.199:8888/api/v1/social/ratings/tutor/0c099-4de0-4c4c-89d1-0bbb6fc4b291/summary
    GET_TUTOR_RATING_SUMMARY: (tutorId: string) =>
      buildUrl(`${SOCIAL}/ratings/tutor/${tutorId}/summary`),
    // http://143.198.80.199:8888/api/v1/social/ratings/tutor/0c099-4de0-4c4c-89d1-0bbb6fc4b291/user/477d787d-2c55-4383-b79b-8f3347ede4e8
    GET_MY_TUTOR_RATING: (tutorId: string, userId: string) =>
      buildUrl(`${SOCIAL}/ratings/tutor/${tutorId}/user/${userId}`),
    // http://143.198.80.199:8888/api/v1/social/ratings/tutor/23232
    UPDATE_RATING_TUTOR_BY_REVIEWID: (reviewId: string) =>
      buildUrl(`${SOCIAL}/ratings/tutor/${reviewId}`),
    DELETE_RATING_TUTOR_BY_REVIEWID: (reviewId: string) =>
      buildUrl(`${SOCIAL}/ratings/tutor/${reviewId}`),
  },

  HOME: {
    SEARCH: (query: string, page: number, size: number) =>
      buildUrl(`${AI}/search?query=${query}&page=${page + 1}&size=${size}`),
  },

  LMS: {
    GET_TEACHING_CLASSES: (page: number, size: number) =>
      buildUrl(`${LMS}/classes/teaching?page=${page}&size=${size}`),
    GET_STUDYING_CLASSES: (page: number, size: number) =>
      buildUrl(`${LMS}/classes/my-class?page=${page}&size=${size}`),
    GET_CLASS_DETAILS: (id: string) => buildUrl(`${LMS}/classes/${id}`),

    ENROLL_CLASS: (id: string) => buildUrl(`${LMS}/classes/${id}/enroll`),

    GET_TUTOR_SUBJECTS: buildUrl(`${LMS}/tutors/me/subjects?page=1&size=300`),

    ADD_NEW_CLASS: buildUrl(`${LMS}/classes`),

    UPDATE_CLASS: (id: string) => buildUrl(`${LMS}/classes/${id}`),

    CANCEL_CLASS: (id: string) => buildUrl(`${LMS}/classes/${id}`),

    GET_CLASS_MEMBERS: (id: string) => buildUrl(`${LMS}/classes/${id}/members`),
    GET_SUBJECTS: buildUrl(`${LMS}/subjects?page=1&size=300`),
    SEARCH_CLASSES: buildUrl(`${LMS}/classes/search`),
    GET_CLASS_NOTIFICATIONS: (classId: string, page: number, size: number) =>
      buildUrl(
        `${LMS}/notifications/class/${classId}?page=${page}&size=${size}`,
      ),
    GET_CLASS_DOCUMENTS: (courseId: string, page: number, size: number) =>
      buildUrl(
        `${API_BASE_URL}/document/course/${courseId}?page=${page}&size=${size}`,
      ),
    CREATE_CLASS_NOTIFICATION: (classId: string) =>
      buildUrl(`${LMS}/notifications/class/${classId}`),
    // http://localhost:8888/api/v1/lms/classes/my-class?page=1&size=10
    GET_MEMBER_PENDING: (id: string) =>
      buildUrl(`${LMS}/classes/${id}/enrollments/pending`),

    GET_CLASSES_BY_TUTORID: (id: string, page: number, size: number) =>
      buildUrl(`${LMS}/classes/tutors/${id}?page=${page}&size=${size}`),

    APPROVE_ENROLLMENT: (id: string, approved: boolean) =>
      buildUrl(`${LMS}/enrollments/${id}/approval?approved=${approved}`),

    TUTOR_REGISTRATION: buildUrl(`${LMS}/tutors/registration`),

    GET_TUTORS_APPLICATION: (status: string, page: number, size: number) =>
      buildUrl(
        `${LMS}/tutors/admin/applications?status=${status}&page=${page}&size=${size}`,
      ),

    APPROVE_APPLICATION: (id: string) =>
      buildUrl(`${LMS}/tutors/admin/applications/${id}/approve`),

    REJECT_APPLICATION: (id: string) =>
      buildUrl(`${LMS}/tutors/admin/applications/${id}/reject`),
  },

  REPORT: {
    CREATE: buildUrl(`${SOCIAL}/reports`),
    GET_AVERAGE_RATING: (resourceId: string) =>
      buildUrl(`${SOCIAL}/ratings/resource/${resourceId}/average`),
    SUBMIT_RATING: buildUrl(`${SOCIAL}/ratings/resource`),
    GET_MY_RATING: (resourceId: string) =>
      buildUrl(`${SOCIAL}/ratings/resource/${resourceId}/my-rating`),
  },

  SOCKET: {
    CONNECT_URL: SOCKET_URL,
  },
};
