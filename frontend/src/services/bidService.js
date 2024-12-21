import api from "./authService"; // Assuming authService is configured with Axios instance

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
  const message = error.response?.data?.message || 'Something went wrong. Please try again later.';
  throw new Error(message);
};

// 📍 1️⃣ **Place a Bid**
export const placeBid = async (projectId, bidData) => {
  try {
    const response = await api.post(`/bid/${projectId}/bid`, bidData, getAuthHeaders());
    return { success: true, data: response.data };
  } catch (error) {
    handleError(error);
  }
};

// 📍 2️⃣ **Manage a Bid (Accept/Reject)**
export const manageBid = async (bidId, action) => {
  try {
    const response = await api.put(
      `/bid/${bidId}/status`,
      { action }, // Pass the action ('accept' or 'reject')
      getAuthHeaders()
    );
    return { success: true, data: response.data };
  } catch (error) {
    handleError(error);
  }
};

// 📍 3️⃣ **Fetch Bids for a Specific Project**
export const getBidsForProject = async (projectId) => {
  try {
    const response = await api.get(`/bid/project/${projectId}`, getAuthHeaders());
    return { success: true, data: response.data };
  } catch (error) {
    handleError(error);
  }
};

// 📍 4️⃣ **Fetch All Bids for Logged-In Freelancer**
export const getFreelancerBids = async () => {
  try {
    const response = await api.get(`/bid/freelancer`, getAuthHeaders());
    return { success: true, data: response.data }; // Return the complete response
  } catch (error) {
    handleError(error); // Log and handle errors appropriately
    return { success: false, message: error.message || "Error fetching bids." };
  }
};

// 📍 5️⃣ **Fetch All Bids for Client's Projects**
export const getClientBids = async () => {
  try {
    const response = await api.get(`/bid/client`, getAuthHeaders());
    return { success: true, data: response.data };
  } catch (error) {
    handleError(error);
  }
};

// 📍 6️⃣ **Fetch All Bids for Admin**
export const getAllBidsForAdmin = async () => {
  try {
      const response = await api.get(`/bid/admin`, getAuthHeaders());
      return { success: true, data: response.data };
  } catch (error) {
      handleError(error);
  }
};
