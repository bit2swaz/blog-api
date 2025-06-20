import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { toast } from 'react-toastify';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // Check if there's a token in localStorage on initial load
  useEffect(() => {
    const checkAuth = () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            // Token is expired
            toast.info('Your session has expired. Please login again.');
            logout();
            return;
          }
          
          setUser(decoded);
        } catch (error) {
          console.error('Invalid token:', error);
          toast.error('Authentication error. Please login again.');
          logout();
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [token]);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.post('/auth/login', credentials);
      const { token: newToken } = response.data.data;
      
      // Store token in localStorage
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Decode and set user data
      const decoded = jwtDecode(newToken);
      setUser(decoded);
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 