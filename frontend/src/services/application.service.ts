import apiClient from './api';
import {
  Application,
  ApplicationList,
  ApplicationFormData,
  ApplicationFilters,
  ApplicationStatus,
  PaginatedResponse,
  ApplicationStatusHistory,
} from '../types';

export const applicationService = {
  /**
   * Submit job application (public endpoint)
   */
  async submitApplication(data: ApplicationFormData): Promise<Application> {
    const formData = new FormData();
    formData.append('job_id', data.job_id.toString());
    formData.append('candidate_name', data.candidate_name);
    formData.append('candidate_email', data.candidate_email);
    formData.append('candidate_phone', data.candidate_phone);
    formData.append('linkedin_url', data.linkedin_url);
    formData.append('cover_letter', data.cover_letter);
    
    if (data.resume_file) {
      formData.append('resume_file', data.resume_file);
    }

    const response = await apiClient.post<Application>('/api/applications/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get all applications with optional filters (requires auth)
   */
  async getApplications(
    filters?: ApplicationFilters,
    page: number = 1
  ): Promise<PaginatedResponse<ApplicationList>> {
    const params = new URLSearchParams();
    
    if (filters?.job) params.append('job', filters.job.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.ordering) params.append('ordering', filters.ordering);
    params.append('page', page.toString());

    const response = await apiClient.get<PaginatedResponse<ApplicationList>>(
      '/api/applications/',
      { params }
    );
    return response.data;
  },

  /**
   * Get single application by ID (requires auth)
   */
  async getApplication(id: number): Promise<Application> {
    const response = await apiClient.get<Application>(`/api/applications/${id}/`);
    return response.data;
  },

  /**
   * Update application status (requires auth)
   */
  async updateApplicationStatus(id: number, status: ApplicationStatus): Promise<Application> {
    const response = await apiClient.patch<Application>(`/api/applications/${id}/`, {
      status,
      
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
    return response.data;
  },

  /**
   * Bulk update application statuses (requires auth)
   */
  async bulkUpdateStatus(
    applicationIds: number[],
    status: ApplicationStatus
  ): Promise<{ success: boolean; updated_count: number; message: string }> {
    const response = await apiClient.post('/api/applications/bulk_update/', {
      application_ids: applicationIds,
      status,
    });
    return response.data;
  },

  /**
   * Get application status history (requires auth)
   */
  async getApplicationHistory(id: number): Promise<ApplicationStatusHistory[]> {
    const response = await apiClient.get<ApplicationStatusHistory[]>(
      `/api/applications/${id}/history/`
    );
    return response.data;
  },

  /**
   * Re-trigger resume parsing (requires auth)
   */
  async reparseResume(id: number): Promise<{ success: boolean; message: string; data: Application }> {
    const response = await apiClient.post(`/api/applications/${id}/reparse/`);
    return response.data;
  },
};
