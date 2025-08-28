import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access denied');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('API Error:', data?.message || 'Unknown error');
      }
      
      return Promise.reject(data || error.response);
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      return Promise.reject({ message: 'Lỗi kết nối mạng' });
    } else {
      // Other error
      console.error('Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

// API methods
export const apiService = {
  // Generic methods
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
  
  // File upload
  upload: (url, formData, onProgress = null) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress ? (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      } : undefined,
    });
  },
  
  // Download file
  download: (url, filename) => {
    return api.get(url, {
      responseType: 'blob',
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    });
  }
};

// Auth helpers
export const authService = {
  setToken: (token) => {
    localStorage.setItem('authToken', token);
  },
  
  getToken: () => {
    return localStorage.getItem('authToken');
  },
  
  removeToken: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
  
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// Error handling helper
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data?.message || 'Có lỗi xảy ra';
  } else if (error.request) {
    return 'Lỗi kết nối mạng';
  } else {
    return error.message || 'Có lỗi xảy ra';
  }
};

export default api;
