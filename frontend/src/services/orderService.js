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
  const message = error.response?.data?.message || "Something went wrong. Please try again later.";
  throw new Error(message);
};

// 📍 1️⃣ **Create Order**
export const createOrder = async ({ projectId, startDate, deadline }) => {
  try {
    console.log("Request Data:", { projectId, startDate, deadline }); // Debug
    const response = await api.post(
      `/orders/create/${projectId}`,
      { startDate, deadline },
      getAuthHeaders()
    );
    return { success: true, data: response.data.order }; // Return the order data
  } catch (error) {
    console.error("Error Response:", error.response?.data); // Debug
    handleError(error);
  }
};

// 📍 2️⃣ **Process Order**
export const processOrder = async (orderId, action) => {
  try {
    const response = await api.put(
      `/orders/${orderId}`, // More descriptive endpoint to indicate action processing
      { action }, // Send the action in the request body
      getAuthHeaders()
    );
    return { success: true, data: response.data.order }; // Return the updated order
  } catch (error) {
    handleError(error);
  }
};

// 📍 3️⃣ **Fetch All Orders for Logged-In User**
export const fetchOrders = async () => {
  try {
    const response = await api.get(`/orders/fetch`, getAuthHeaders()); // Updated to a general `/orders` endpoint
    return { success: true, data: response.data.orders }; // Return the fetched orders
  } catch (error) {
    handleError(error);
  }
};

// 📍 4️⃣ **Fetch Freelancer Orders**
export const fetchFreelancerOrders = async () => {
  try {
    const response = await api.get(`/orders/freelancer`, getAuthHeaders()); // Specific endpoint for freelancer orders
    return { success: true, data: response.data.orders }; // Return the fetched freelancer orders
  } catch (error) {
    handleError(error);
  }
};

// 📍 5️⃣ **Fetch Client Orders**
export const fetchClientOrders = async () => {
  try {
    const response = await api.get(`/orders/client`, getAuthHeaders()); // Specific endpoint for client orders
    return { success: true, data: response.data.orders }; // Return the fetched client orders
  } catch (error) {
    handleError(error);
  }
};

// 📍 6️⃣ **Fetch All Orders for Admin**
export const fetchAdminOrders = async () => {
  try {
    const response = await api.get(`/orders/admin`, getAuthHeaders()); // Specific endpoint for admin orders
    return { 
      success: true, 
      data: response.data.orders // Return the formatted orders from the response 
    };
  } catch (error) {
    handleError(error); // Handle API errors gracefully
  }
};