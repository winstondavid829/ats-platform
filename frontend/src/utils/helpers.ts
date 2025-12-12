import { format, parseISO } from 'date-fns';

/**
 * Format date string to readable format
 */
export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (error) {
    return dateString;
  }
};

/**
 * Format datetime string to readable format
 */
export const formatDateTime = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
  } catch (error) {
    return dateString;
  }
};

/**
 * Format salary range
 */
export const formatSalary = (min?: string | null, max?: string | null): string => {
  if (!min && !max) return 'Not specified';
  
  const formatNumber = (num: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(parseFloat(num));
  };

  if (min && max) {
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  } else if (min) {
    return `From ${formatNumber(min)}`;
  } else if (max) {
    return `Up to ${formatNumber(max)}`;
  }
  
  return 'Not specified';
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Download file from URL
 */
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Handle API errors and return user-friendly message
 */
export const getErrorMessage = (error: any): string => {
  if (error.response?.data) {
    const data = error.response.data;
    
    // If it's a field error object
    if (typeof data === 'object' && !data.detail) {
      const firstError = Object.values(data)[0];
      if (Array.isArray(firstError)) {
        return firstError[0];
      }
      return String(firstError);
    }
    
    // If it's a detail message
    if (data.detail) {
      return data.detail;
    }
    
    // If it's a string
    if (typeof data === 'string') {
      return data;
    }
  }
  
  return error.message || 'An unexpected error occurred';
};
