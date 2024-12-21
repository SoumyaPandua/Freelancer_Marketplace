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

// 📍 1️⃣ **Create Payment**
export const createPayment = async ({ orderId, amount, paymentMethod }) => {
  try {
    const response = await api.post(
      `/payments/create`,
      { orderId, amount, paymentMethod },
      getAuthHeaders()
    );
    return { success: true, data: response.data.payment }; // Return the created payment data
  } catch (error) {
    handleError(error);
  }
};

// 📍 2️⃣ **Update Payment Status**
export const updatePaymentStatus = async ({ paymentId, status, transactionId }) => {
  try {
    const response = await api.patch(
      `/payments/${paymentId}/status`,
      { status, transactionId },
      getAuthHeaders()
    );
    return { success: true, data: response.data.payment }; // Return the updated payment data
  } catch (error) {
    handleError(error);
  }
};

// 📍 3️⃣ **Fetch Payments for the Logged-In Client**
export const fetchPaymentsByClient = async () => {
  try {
    const response = await api.get('/payments/client', getAuthHeaders());
    return { success: true, data: response.data.payments };
  } catch (error) {
    console.error('Error fetching payments:', error);
    return { success: false, message: 'Failed to fetch payments.' };
  }
};

// 📍 4️⃣ **Fetch Payments for the Logged-In Freelancer**
export const fetchPaymentsByFreelancer = async () => {
  try {
    const response = await api.get(`/payments/freelancer`, getAuthHeaders());
    return { success: true, data: response.data.payments }; // Return the fetched payments
  } catch (error) {
    handleError(error);
  }
};

// // 📍 5️⃣ **Fetch All Payments (Admin Only)**
// export const fetchAllPayments = async () => {
//   try {
//     const response = await api.get(`/payments/admin/all`, getAuthHeaders());
//     return { success: true, data: response.data.payments }; // Return all payments
//   } catch (error) {
//     handleError(error);
//   }
// };

// 📍 6️⃣ **Fetch Detailed Payments for Admin**
export const fetchDetailedPaymentsForAdmin = async () => {
  try {
    const response = await api.get(`/payments/admin/all`, getAuthHeaders());
    return { success: true, data: response.data.payments }; // Return detailed payment data
  } catch (error) {
    handleError(error);
  }
};