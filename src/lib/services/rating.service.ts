import { API_ENDPOINTS } from "@/lib/apiEndPoints";
import httpClient from "./http";

export interface CreateRatingPayload {
  tutorId: string;
  comment: string;
  score: number;
}

export interface Rating {
  id: string | number;
  userId: string;
  tutorId: string;
  comment: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export const createRating = async (
  payload: CreateRatingPayload,
): Promise<Rating> => {
  const response: any = await httpClient.post(
    API_ENDPOINTS.RATINGS.RATING_TUTOR,
    payload,
  );
  return response.data || response;
};

export const getRatingsByTutorId = async (
  tutorId: string,
  page: number,
  size: number,
): Promise<{ content: Rating[]; totalPages: number }> => {
  const response: any = await httpClient.get(
    API_ENDPOINTS.RATINGS.GET_TUTOR_RATINGS(tutorId, page, size),
  );
  return response.data.result || response;
};

export const getTutorRatingSummary = async (
  tutorId: string,
): Promise<{
  totalReviews: number;
  averageScore: number;
  totalRatings: number;
}> => {
  const response: any = await httpClient.get(
    API_ENDPOINTS.RATINGS.GET_TUTOR_RATING_SUMMARY(tutorId),
  );
  console.log("diem tong:", response);
  return response.data.result || response;
};

export const getMyRatingForTutor = async (
  tutorId: string,
  userId: string,
): Promise<Rating | null> => {
  const response: any = await httpClient.get(
    API_ENDPOINTS.RATINGS.GET_MY_TUTOR_RATING(tutorId, userId),
  );
  console.log("MyRatingForTutor:", response);
  return response.data.result || null;
};

export const updateRating = async (
  ratingId: string,
  payload: CreateRatingPayload,
): Promise<Rating> => {
  const response: any = await httpClient.put(
    API_ENDPOINTS.RATINGS.UPDATE_RATING_TUTOR_BY_REVIEWID(ratingId),
    payload,
  );
  return response.data || response;
};

export const deleteRating = async (ratingId: string): Promise<void> => {
  await httpClient.delete(
    API_ENDPOINTS.RATINGS.DELETE_RATING_TUTOR_BY_REVIEWID(ratingId),
  );
};
