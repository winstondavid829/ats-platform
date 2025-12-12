import apiClient from './api';
import { Job, JobFormData, JobFilters, PaginatedResponse } from '../types';

export const jobService = {
  /**
   * Get all jobs with optional filters
   */
  async getJobs(filters?: JobFilters, page: number = 1): Promise<PaginatedResponse<Job>> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.ordering) params.append('ordering', filters.ordering);
    params.append('page', page.toString());

    const response = await apiClient.get<PaginatedResponse<Job>>('/api/jobs/', { params });
    return response.data;
  },

  /**
   * Get single job by ID
   */
  async getJob(id: number): Promise<Job> {
    const response = await apiClient.get<Job>(`/api/jobs/${id}/`);
    return response.data;
  },

  /**
   * Create new job
   */
  async createJob(data: JobFormData): Promise<Job> {
    const response = await apiClient.post<Job>('/api/jobs/', data);
    return response.data;
  },

  /**
   * Update existing job
   */
  async updateJob(id: number, data: JobFormData): Promise<Job> {
    const response = await apiClient.put<Job>(`/api/jobs/${id}/`, data);
    return response.data;
  },

  /**
   * Delete job
   */
  async deleteJob(id: number): Promise<void> {
    await apiClient.delete(`/api/jobs/${id}/`);
  },

  /**
   * Close job posting
   */
  async closeJob(id: number): Promise<Job> {
    const response = await apiClient.post<Job>(`/api/jobs/${id}/close/`);
    return response.data;
  },

  /**
   * Reopen job posting
   */
  async reopenJob(id: number): Promise<Job> {
    const response = await apiClient.post<Job>(`/api/jobs/${id}/reopen/`);
    return response.data;
  },

  /**
   * Get applications for a specific job
   */
  async getJobApplications(id: number): Promise<any[]> {
    const response = await apiClient.get(`/api/jobs/${id}/applications/`);
    return response.data;
  },
};
