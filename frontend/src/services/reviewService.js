import api from "./authService"; // Axios instance configured with base URL and interceptors

// Utility to get Authorization headers
const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Utility to handle API errors gracefully
const handleError = (error) => {
  console.error("API Error:", error.response || error.message);
  const message =
    error.response?.data?.message || "Something went wrong. Please try again later.";
  throw new Error(message);
};

// 📍 1️⃣ **Fetch Client Projects**
export const fetchClientProjects = async () => {
  try {
    const response = await api.get(`/reviews/projects`, getAuthHeaders());
    return { success: true, data: response.data.projects };
  } catch (error) {
    handleError(error);
  }
};

// 📍 2️⃣ **Create Review**
export const createReview = async ({ projectId, rating, feedback }) => {
  try {
    const response = await api.post(
      `/reviews/add`,
      { projectId, rating, feedback },
      getAuthHeaders()
    );
    return { success: true, data: response.data.review };
  } catch (error) {
    // Extract a meaningful error message from the response
    const errorMessage =
      error.response?.data?.message || 'Failed to submit the review. Please try again later.';
    throw new Error(errorMessage);
  }
};

// 📍 3️⃣ **Fetch Freelancer Reviews**
export const fetchFreelancerReviews = async () => {
  try {
    const response = await api.get(`/reviews/freelancer/reviews`, getAuthHeaders());
    return { success: true, data: response.data.reviews };
  } catch (error) {
    handleError(error);
  }
};

// 📍 4️⃣ **Fetch Freelancer Average Rating**
export const fetchFreelancerAverageRating = async () => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user")); // Get logged-in user details
    const freelancerId = user?._id; // Extract freelancerId

    if (!freelancerId) {
      throw new Error("Freelancer ID not found. Please log in again.");
    }

    const response = await api.get(
      `/reviews/freelancer/${freelancerId}/average-rating`
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching freelancer average rating:", error);
    throw error;
  }
};

// 📍 Fetch all reviews (admin only)
export const fetchAllReviews = async () => {
  try {
    const response = await api.get(`/reviews/admin/all`, getAuthHeaders());
    return { success: true, data: response.data.reviews };
  } catch (error) {
    handleError(error);
  }
};