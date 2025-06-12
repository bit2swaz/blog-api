// Store the auth token in localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Get the auth token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Remove the auth token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Check if the user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Store user data in localStorage
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Get user data from localStorage
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Remove user data from localStorage
export const removeUser = () => {
  localStorage.removeItem('user');
};

// Logout user
export const logout = () => {
  removeToken();
  removeUser();
}; 