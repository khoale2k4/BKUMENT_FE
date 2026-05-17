// src/lib/services/profile.service.ts
import {
  PaginatedUsers,
  TutorProfile,
  RegisterTutorRequest,
  UpdateTutorRequest,
  UserProfile,
  PaginatedSuggestions,
} from "../redux/features/profileSlice";
import { API_ENDPOINTS } from "../apiEndPoints";
import httpClient from "./http";
import { showToast } from "../redux/features/toastSlice";

// Hàm helper để lấy token
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
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

export const getMyTutorApplication = async () => {
  const response = await httpClient.get(
    API_ENDPOINTS.LMS.GET_MY_REGISTRATION_APPLICATION(),
  );
  console.log("API Response for my tutor application:", response.data.result); // Debug log
  return response.data.result;
}

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
        "Content-Type": "application/json",
      },
    },
  );

  console.log("API Response for reject tutor application:", response.data);
  return response.data.result;
};

export const searchProfiles = async (
  keyword: string,
  page: number,
  size: number,
): Promise<PaginatedUsers> => {
  const response = await httpClient.get(
    API_ENDPOINTS.ACCOUNT.SEARCH_PROFILES(keyword, page, size),
  );
  console.log("API Response for search profiles:", response.data); // Debug log
  return response.data.result as PaginatedUsers;
};

export const getMySubjectsSuggestion = async (page: number, size: number): Promise<PaginatedSuggestions> => {
  const response = await httpClient.get(
    API_ENDPOINTS.LMS.GET_MY_SUBJECTS_SUGGESTION(page, size),
  );
  console.log("API Response for my subjects suggestion:", response.data.result); // Debug log
  return response.data.result as PaginatedSuggestions;
};

export interface SubjectSuggestionPayload {
  type: "TOPIC" | "SUBJECT";
  proposedName: string;
  parentSubjectId?: string; // Chỉ cần khi type là TOPIC
  reason: string;
};

export interface ReviewSuggestionPayload {
  finalId?: string;
  finalName?: string;
  parentSubjectId?: string;
  rejectionReason?: string;
  note?: string;
}


// Hàm phê duyệt (Approve)
export const ApproveSubjectSuggestion = async (
  id: string, 
  payload: ReviewSuggestionPayload
): Promise<void> => {
  const response = await httpClient.post(
    API_ENDPOINTS.LMS.APPROVE_SUBJECT_SUGGESTION(id),
    JSON.stringify(payload),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log(`API Response for approve suggestion ${id}:`, response.data);

  if (response.data.code !== 1000) {
    throw new Error(response.data.message || "Failed to approve subject suggestion");
  }
};

// Hàm từ chối (Reject)
export const RejectSubjectSuggestion = async (
  id: string, 
  payload: ReviewSuggestionPayload
): Promise<void> => {
  const response = await httpClient.post(
    API_ENDPOINTS.LMS.REJECT_SUBJECT_SUGGESTION(id),
    JSON.stringify(payload),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log(`API Response for reject suggestion ${id}:`, response.data);

  if (response.data.code !== 1000) {
    throw new Error(response.data.message || "Failed to reject subject suggestion");
  }
};

export const SubmitSubjectSuggestion = async (payload: SubjectSuggestionPayload): Promise<void> => {
  const response = await httpClient.post(
    API_ENDPOINTS.LMS.SUBMIT_SUBJECT_SUGGESTION,
    JSON.stringify(payload), // Tham số thứ 2: Dữ liệu (Body)
    {
      headers: {
        "Content-Type": "application/json",
      },
    },  
  );
  console.log("API Response for submit subject suggestion:", response.data); // Debug log
  if (response.data.code !== 1000) {
    throw new Error(response.data.message || "Failed to submit subject suggestion");
  }
}

export const fetchSubjectSuggestion = async (page: number, size: number) => {
  const response = await httpClient.get(
    API_ENDPOINTS.LMS.GET_SUBJECTS_SUGGESTION(page, size),
  );
  console.log("API Response for fetch subject suggestion:", response.data);
  return response.data.result;
};
