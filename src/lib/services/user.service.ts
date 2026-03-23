import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import httpClient from './http';
import { UserProfile, UpdateProfileRequest } from '../redux/features/profileSlice';
import axios from 'axios';

export const getUserInfo = async (): Promise<UserProfile> => {
    const response = await httpClient.get(API_ENDPOINTS.ACCOUNT.GET_USER_INFO);

    return response.data.result;
};

export const updateUserInfo = async (updateData: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await httpClient.patch(API_ENDPOINTS.ACCOUNT.UPDATE_USER_INFO, updateData);
    return response.data.result;
};

export const getPresignedUrl = async (fileName: string): Promise<{ url: string; assetId: string }> => {
    const response = await httpClient.get(API_ENDPOINTS.RESOURCE.GET_PRESIGNED_URL(fileName));
    return {
        url: response.data.result.url,
        assetId: response.data.result.assetId,
    };
};

export const uploadAvatarImage = async (file: File): Promise<string> => {
    const { url, assetId } = await getPresignedUrl(file.name);
    await axios.put(url, file, {
        headers: { 'Content-Type': file.type },
    });
    return API_ENDPOINTS.RESOURCE.LINK_IMAGE_FILEID(assetId);
};