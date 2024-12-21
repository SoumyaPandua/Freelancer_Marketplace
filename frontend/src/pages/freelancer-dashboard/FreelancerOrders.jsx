import React, { useEffect, useState } from "react";
import { fetchFreelancerOrders } from "../../services/orderService"; // Service to fetch freelancer orders
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";

function FreelancerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "", isOpen: false });

  // Function to fetch freelancer orders
  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetchFreelancerOrders();
      setOrders(response.data); // Assuming the response contains the orders in `data`
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setAlert({ type: "error", message: error.message, isOpen: true });
    }
  };

  // Close alert
  const closeAlert = () => setAlert({ ...alert, isOpen: false });

  // Fetch orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      {/* Loading Indicator */}
      {loading && <Loading />}

      {/* Alert Component */}
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={closeAlert}
      />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {orders.length === 0 && !loading ? (
          <p className="text-gray-500 text-center py-8">No orders found.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.projectId?.title || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.clientId?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.deadline).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{order.price || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default FreelancerOrders;