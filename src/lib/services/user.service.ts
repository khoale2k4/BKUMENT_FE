import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import httpClient from './http';
import { UserProfile, UpdateProfileRequest } from '../redux/features/profileSlice';

export const getUserInfo = async (): Promise<UserProfile> => {
    const response = await httpClient.get(API_ENDPOINTS.ACCOUNT.GET_USER_INFO);
    
    return response.data.result; 
};

export const updateUserInfo = async (updateData: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await httpClient.patch('http://localhost:8081/profile/update', updateData);
    return response.data.result;
};