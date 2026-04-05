// src/lib/services/profile.service.ts
import {
  PaginatedUsers,
  TutorProfile,
  RegisterTutorRequest,
  UpdateTutorRequest,
  UserProfile,
} from "../redux/features/profileSlice";
import { API_ENDPOINTS } from "../apiEndPoints";
import httpClient from "./http";
import { showToast } from "../redux/features/toastSlice";
const BASE_URL = "http://localhost:8888/api/v1";

// Hàm helper để lấy token
const getAuthHeaders = () => {
  const token = sessionStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ==================== USER API ====================

export const fetchFollowingByProfileId = async (
  profileId: string,
  page: number,
  size: number,
): Promise<PaginatedUsers> => {
  const response = await httpClient.get(
    API_ENDPOINTS.ACCOUNT.GET_FOLLOWING(profileId, page, size),
  );
  console.log("API Response for following list:", response.data); // Debug log
  return response.data.result as PaginatedUsers;
};

export const fetchFollowersByProfileId = async (
  profileId: string,
  page: number,
  size: number,
): Promise<PaginatedUsers> => {
  const response = await httpClient.get(
    API_ENDPOINTS.ACCOUNT.GET_FOLLOWERS(profileId, page, size),
  );
  console.log("API Response for followers list:", response.data); // Debug log
  return response.data.result as PaginatedUsers;
};

export const fetchProfileById = async (
  profileId: string,
): Promise<UserProfile> => {
  const response = await httpClient.get(
    API_ENDPOINTS.ACCOUNT.GET_PROFILE_BY_ID(profileId),
  );

  if (response.data.code !== 1000) {
    throw new Error(response.data.message || "Failed to fetch profile by ID");
  }

  console.log("API Response for profile by ID:", response.data);

  // CHÚ Ý: Sửa lại thành response.data.result thay vì response.data
  return response.data.result as UserProfile;
};

// ==================== TUTOR API ====================

export const fetchMyTutorProfile = async (): Promise<TutorProfile> => {
  // const response = await fetch(`${BASE_URL}/lms/tutors/me`, {
  //     method: "GET",
  //     headers: getAuthHeaders(),
  // });
  // const data = await response.json();
  // if (data.code !== 1000) throw new Error(data.message || "Failed to fetch tutor profile");
  const response = await httpClient.get(
    API_ENDPOINTS.ACCOUNT.UPDATE_TUTOR_INFO,
  );
  if (response.data.code !== 1000)
    throw new Error(response.data.message || "Failed to fetch tutor profile");
  console.log("API Response for my tutor profile:", response.data);
  return response.data.result as TutorProfile;
};

export const registerTutor = async (
  payload: RegisterTutorRequest,
): Promise<TutorProfile> => {
  const response = await httpClient.post(
    API_ENDPOINTS.LMS.TUTOR_REGISTRATION,
    payload,
  );
  if (response.data.code !== 1000)
    throw new Error(response.data.message || "Failed to register tutor");

  // if(response.data.code === 3008) {
  //     dispatch(showToast({ type: "info", title: "Success!", message: response.data.message || "Tutor registration successful, pending approval." }));
  // }
  console.log("API Response for register tutor:", response.data);
  return response.data.result as TutorProfile;
};

export const updateTutor = async (
  payload: UpdateTutorRequest,
): Promise<TutorProfile> => {
  const response = await httpClient.patch(
    API_ENDPOINTS.ACCOUNT.UPDATE_TUTOR_INFO,
    payload,
  );
  if (response.data.code !== 1000)
    throw new Error(response.data.message || "Failed to update tutor info");
  console.log("API Response for update tutor:", response.data);
  return response.data.result as TutorProfile;
};

export const getTutorsApplication = async (
  status: string,
  page: number,
  size: number,
) => {
  const response = await httpClient.get(
    API_ENDPOINTS.LMS.GET_TUTORS_APPLICATION(status, page, size),
  );
  console.log("API Response for tutor applications:", response.data.result); // Debug log
  return response.data.result;
};

export const approveTutorApplication = async (id: string) => {
  const response = await httpClient.post(
    API_ENDPOINTS.LMS.APPROVE_APPLICATION(id),
  );
  console.log("API Response for approve tutor application:", response.data);
  return response.data.result;
};

export const rejectTutorApplication = async (id: string, reason: string) => {
  console.log(
    "Rejecting tutor application with ID at service:",
    id,
    "and reason:",
    reason, // Chỉ log reason gốc cho dễ nhìn
  ); 
  
  const response = await httpClient.post(
    API_ENDPOINTS.LMS.REJECT_APPLICATION(id),
    JSON.stringify(reason), // Tham số thứ 2: Dữ liệu (Body)
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  
  console.log("API Response for reject tutor application:", response.data);
  return response.data.result;
};
