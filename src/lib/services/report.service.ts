import { API_ENDPOINTS } from '@/lib/apiEndPoints';
import httpClient from './http';

export interface Report {
    id: string;
    resolverId: string | null;
    reporterId: string;
    targetId: string;
    status: string;
    type: string;
    reason: string;
    detail: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReportPayload {
    targetId: string;    
    type: string;
    reason: string;         
    detail: string; 
}

export const createReport = async (
    payload: CreateReportPayload
): Promise<Report> => { 
    const response: any = await httpClient.post(API_ENDPOINTS.REPORT.CREATE, payload);
    
    const responseData = response.data || response; 
    const result = responseData.result;

    const newReport: Report = {
        id: result.id,
        resolverId: result.resolverId,
        reporterId: result.reporterId,
        targetId: result.targetId,
        status: result.status,
        type: result.type,
        reason: result.reason,
        detail: result.detail,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
    };

    return newReport;
};