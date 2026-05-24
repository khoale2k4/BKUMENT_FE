import { API_ENDPOINTS } from "@/lib/apiEndPoints";
import httpClient from "./http";

export interface CreateRatingPayload {
  classId: string;
  comment: string;
  score: number;
}

export interface Rating {
  id: string | number;
  userId: string;
  classId: string;
  comment: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export const createRating = async (
  payload: CreateRatingPayload,
): Promise<Rating> => {
  const response: any = await httpClient.post(
    API_ENDPOINTS.RATINGS.RATING_CLASSES,
    payload,
  );
  return response.data || response;
};

export const getRatingsByClassId = async (
  classId: string,
  page: number,
  size: number,
): Promise<{ content: Rating[]; totalPages: number }> => {
  const response: any = await httpClient.get(
    API_ENDPOINTS.RATINGS.GET_CLASSES_RATINGS(classId, page, size),
  );
  return response.data.result || response;
};

export const getClassesRatingSummary = async (
  classId: string,
): Promise<{
  totalReviews: number;
  averageScore: number;
  totalRatings: number;
}> => {
  const response: any = await httpClient.get(
    API_ENDPOINTS.RATINGS.GET_CLASSES_RATING_SUMMARY(classId),
  );
  console.log("diem tong:", response);
  return response.data.result || response;
};

export const getMyRatingForClass = async (
  classId: string,
  userId: string,
): Promise<Rating | null> => {
  const response: any = await httpClient.get(
    API_ENDPOINTS.RATINGS.GET_MY_CLASSES_RATING(classId, userId),
  );
  console.log("MyRatingForClass:", response);
  return response.data.result || null;
};

export const updateRating = async (
  ratingId: string,
  payload: CreateRatingPayload,
): Promise<Rating> => {
  const response: any = await httpClient.put(
    API_ENDPOINTS.RATINGS.UPDATE_RATING_CLASSES_BY_REVIEWID(ratingId),
    payload,
  );
  return response.data || response;
};

export const deleteRating = async (ratingId: string): Promise<void> => {
  await httpClient.delete(
    API_ENDPOINTS.RATINGS.DELETE_RATING_CLASSES_BY_REVIEWID(ratingId),
  );
};
