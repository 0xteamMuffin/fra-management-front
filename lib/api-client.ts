import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding token to request:', token.substring(0, 20) + '...');
    } else {
      console.log('No token found in localStorage');
    }
    
    // Add timestamp for cache busting
    config.params = {
      ...config.params,
      _t: new Date().getTime(),
    };
    
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  (error: AxiosError) => {
    console.error('Response error:', error.response?.status, error.response?.data, error.config?.url);
    
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      console.log('Unauthorized, clearing auth data');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login/govt';
    }

    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied:', error.response.data);
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error - please check your connection');
    }

    return Promise.reject(error);
  }
);

// API Helper Functions
export const api = {
  // Generic HTTP methods
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    apiClient.get(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    apiClient.post(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    apiClient.put(url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    apiClient.delete(url, config),

  // File upload with progress
  upload: <T = any>(
    url: string, 
    formData: FormData, 
    onProgress?: (progressEvent: any) => void
  ): Promise<AxiosResponse<T>> => {
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    });
  },
};

// Specific API endpoints matching backend routes
export const endpoints = {
  // Authentication
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    me: '/auth/me',
  },
  
  // Geographic data
  states: '/states',
  districts: '/districts', 
  villages: '/villages',
  
  // FRA Claims
  claims: '/claims',
  
  // FRA Operations
  fra: {
    verify: (id: string) => `/fra/verify/${id}`,
    approve: (id: string) => `/fra/approve/${id}`,
    reject: (id: string) => `/fra/reject/${id}`,
  },
  
  // File handling
  s3: {
    presignedUrl: '/s3/presigned-url',
    viewUrl: '/s3/view-url',
  },
  
  // Document processing
  documents: {
    process: '/documents/process',
    status: (id: string) => `/documents/status/${id}`,
    callback: (id: string) => `/documents/callback/${id}`,
  },
  
  // Analysis
  analysis: {
    segment: '/analysis/segment',
  },

  // Admin endpoints
  admin: {
    stats: '/admin/stats',
    seed: '/admin/seed',
    bulk: {
      states: '/admin/bulk/states',
      districts: '/admin/bulk/districts',
      villages: '/admin/bulk/villages',
    },
    users: '/admin/users',
    export: '/admin/export',
  },

  // Setup endpoints (public, no auth required)
  setup: {
    status: '/setup/status',
    admin: '/setup/admin',
  },
} as const;

export default apiClient;
