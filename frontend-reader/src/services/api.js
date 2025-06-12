// Base API URL
const API_URL = 'http://localhost:3000/api';

// Helper function for making API requests
async function fetchApi(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// API endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  },
  
  // Posts endpoints
  posts: {
    getAll: () => fetchApi('/posts'),
    getById: (id) => fetchApi(`/posts/${id}`),
  },
  
  // Comments endpoints
  comments: {
    getByPostId: (postId) => fetchApi(`/posts/${postId}/comments`),
  },
}; 