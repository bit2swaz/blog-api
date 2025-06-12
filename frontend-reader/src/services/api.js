import axios from 'axios';

// Base API URL
const API_URL = 'http://localhost:3000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// API endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
  },
  
  // Posts endpoints
  posts: {
    getAll: () => apiClient.get('/posts'),
    getById: (id) => apiClient.get(`/posts/${id}`),
  },
  
  // Comments endpoints
  comments: {
    getByPostId: (postId) => apiClient.get(`/posts/${postId}/comments`),
  },
}; 