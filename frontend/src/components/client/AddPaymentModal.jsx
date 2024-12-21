import React, { useState, useEffect } from "react";
import { createPayment } from "../../services/paymentService";
import { fetchOrders } from "../../services/orderService";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";

function AddPaymentModal({ onClose }) {
  const [formData, setFormData] = useState({
    orderId: "",
    amount: "",
    paymentMethod: "credit_card",
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch in-progress orders on component mount
  useEffect(() => {
    const fetchInProgressOrders = async () => {
      try {
        setLoading(true);
        const response = await fetchOrders(); // Fetch all orders
        const inProgressOrders = response.data.filter((order) => order.status === "in-progress");
        setOrders(inProgressOrders);
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInProgressOrders();
  }, []);

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      if (name === "orderId") {
        const selectedOrder = orders.find((order) => order._id === value);
        return { ...prevFormData, [name]: value, amount: selectedOrder?.price || "" };
      }
      return { ...prevFormData, [name]: value };
    });
  };

  // Handle create payment
  const handleCreatePayment = async () => {
    try {
      setLoading(true);
      await createPayment({
        orderId: formData.orderId,
        amount: formData.amount,
        paymentMethod: formData.paymentMethod,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose(); // Close modal
        window.location.reload(); // Refresh Payments page
      }, 1000);
    } catch (err) {
      setError("Failed to create payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {error && <Alert type="error" message={error} isOpen={!!error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message="Payment created successfully!" isOpen={!!success} onClose={() => setSuccess(false)} />}
      <div className="bg-white w-1/3 rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add Payment</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project</label>
            <select
              name="orderId"
              value={formData.orderId}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a project</option>
              {orders.map((order) => (
                <option key={order._id} value={order._id}>
                  {order.projectId.title || "Unnamed Project"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleCreatePayment}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700"
          >
            {loading ? "Processing..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPaymentModal;