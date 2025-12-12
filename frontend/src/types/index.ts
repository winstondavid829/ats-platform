// User types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// Job types
export interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary_min: string | null;
  salary_max: string | null;
  status: 'active' | 'closed';
  created_by: User;
  created_at: string;
  updated_at: string;
  application_count: number;
}

export interface JobFormData {
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary_min?: number | string;
  salary_max?: number | string;
  status: 'active' | 'closed';
}

// Application types
export type ApplicationStatus = 
  | 'new'
  | 'screening'
  | 'phone_screen'
  | 'interview'
  | 'offer'
  | 'rejected';

export interface Application {
  id: number;
  job: Job;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  linkedin_url: string;
  cover_letter: string;
  resume_file: string;
  resume_url: string;
  status: ApplicationStatus;
  parsed_skills: string[];
  parsed_experience: string;
  parsed_education: string;
  parsed_email: string;
  parsed_phone: string;
  score: number;
  applied_at: string;
  updated_at: string;
  status_history: ApplicationStatusHistory[];
}

export interface ApplicationList {
  id: number;
  job_id: number;
  job_title: string;
  candidate_name: string;
  candidate_email: string;
  status: ApplicationStatus;
  score: number;
  applied_at: string;
}

export interface ApplicationFormData {
  job_id: number;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  linkedin_url: string;
  cover_letter: string;
  resume_file: File | null;
}

export interface ApplicationStatusHistory {
  id: number;
  from_status: string;
  to_status: string;
  changed_by: number;
  changed_by_name: string;
  changed_at: string;
  notes: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Filter types
export interface ApplicationFilters {
  job?: number;
  status?: ApplicationStatus;
  search?: string;
  ordering?: string;
}

export interface JobFilters {
  status?: 'active' | 'closed';
  location?: string;
  search?: string;
  ordering?: string;
}

// API Error types
export interface APIError {
  detail?: string;
  [key: string]: any;
}

// Status badge colors
export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  screening: 'bg-yellow-100 text-yellow-800',
  phone_screen: 'bg-purple-100 text-purple-800',
  interview: 'bg-indigo-100 text-indigo-800',
  offer: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

// Status labels
export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: 'New',
  screening: 'Screening',
  phone_screen: 'Phone Screen',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
};
