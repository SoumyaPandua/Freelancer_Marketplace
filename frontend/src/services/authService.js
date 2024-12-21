import axios from "axios";

// Base URL for API endpoints
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Intercept requests to dynamically add the token from sessionStorage
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token"); // Retrieve token from sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login function
export const login = async (email, password, role) => {
  try {
    const response = await api.post("/auth/login", { email, password, role });
    sessionStorage.setItem("token", response.data.token); // Store token in sessionStorage
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed. Please check your credentials.";
  }
};

// Register function
export const register = async (name, email, password, role) => {
  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed. Please try again.";
  }
};

// Logout function
export const logout = () => {
  sessionStorage.removeItem("token"); // Clear token from sessionStorage
  // Optionally redirect user to login page or perform other cleanup
};

// Fetch Profile function
export const fetchProfile = async () => {
  try {
    const response = await api.get("/auth/profile-fetch"); // Adjust endpoint if necessary
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch profile.";
  }
};

// Update Profile function
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put("/auth/profile/update", profileData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update profile.";
  }
};

// Fetch All Users function (Admin Only)
export const fetchAllUsers = async () => {
  try {
    const response = await api.get("/auth/admin/users");
    return response.data.data; // Return the list of users
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch users.";
  }
};

// Delete User function (Admin Only)
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/auth/admin/users/${userId}`);
    return response.data.message; // Return success message
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete user.";
  }
};

// Export the Axios instance for shared use
export default api;