// src/lib/services/profile.service.ts
import { PaginatedUsers, TutorProfile, RegisterTutorRequest, UpdateTutorRequest, UserProfile } from '../redux/features/profileSlice';
import { API_ENDPOINTS } from '../apiEndPoints';

const BASE_URL = 'http://localhost:8888/api/v1';

// Hàm helper để lấy token
const getAuthHeaders = () => {
    const token = sessionStorage.getItem("accessToken");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// ==================== USER API ====================

export const fetchFollowingByProfileId = async (profileId: string, page: number, size: number): Promise<PaginatedUsers> => {
    const response = await fetch(`${BASE_URL}/profile/${profileId}/following?page=${page}&size=${size}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (data.code !== 1000) throw new Error(data.message || "Failed to fetch following list");
    return data.result as PaginatedUsers;
};

export const fetchFollowersByProfileId = async (profileId: string, page: number, size: number): Promise<PaginatedUsers> => {
    const response = await fetch(`${BASE_URL}/profile/${profileId}/followers?page=${page}&size=${size}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (data.code !== 1000) throw new Error(data.message || "Failed to fetch followers list");
    return data.result as PaginatedUsers;
};

export const fetchProfileById = async (profileId: string): Promise<UserProfile> => {
    const response = await fetch(`${BASE_URL}/profile/${profileId}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (data.code !== 1000) throw new Error(data.message || "Failed to fetch profile by ID");
    return data.result as UserProfile;
};

// ==================== TUTOR API ====================

export const fetchMyTutorProfile = async (): Promise<TutorProfile> => {
    const response = await fetch(`${BASE_URL}/lms/tutors/me`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (data.code !== 1000) throw new Error(data.message || "Failed to fetch tutor profile");
    return data.result as TutorProfile;
};

export const registerTutor = async (payload: RegisterTutorRequest): Promise<TutorProfile> => {
    const response = await fetch(`${BASE_URL}/lms/tutors/registration`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (data.code !== 1000) throw new Error(data.message || "Failed to register tutor");
    return data.result as TutorProfile;
};

export const updateTutor = async (payload: UpdateTutorRequest): Promise<TutorProfile> => {
    const response = await fetch(API_ENDPOINTS.ACCOUNT.UPDATE_TUTOR_INFO, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (data.code !== 1000) throw new Error(data.message || "Failed to update tutor info");
    return data.result as TutorProfile;
};