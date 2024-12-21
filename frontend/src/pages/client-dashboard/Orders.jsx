import React, { useEffect, useState } from 'react';
import { fetchClientOrders, processOrder } from '../../services/orderService'; // API calls
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';

function ClientOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '', isOpen: false });

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const response = await fetchClientOrders();
        setOrders(response.data);
      } catch (error) {
        showAlert('error', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message, isOpen: true });
    setTimeout(() => setAlert({ ...alert, isOpen: false }), 2000);
  };

  const updateOrderStatus = async (orderId, action) => {
    setLoading(true);
    try {
      const response = await processOrder(orderId, action);
      const updatedOrder = response.data;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
      showAlert('success', `Order ${action.replace('_', ' ')} successfully!`);
    } catch (error) {
      showAlert('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
      {loading && <Loading />}
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8">
          Manage Your Orders
        </h1>

        {orders.length === 0 && !loading ? (
          <p className="text-center text-gray-500">No orders available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="bg-white p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      {order.projectId?.title || 'Untitled Project'}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="font-medium">{order.freelancerId?.name || 'Unknown Freelancer'}</span>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-medium">₹{order.price || 'N/A'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Start Date</p>
                        <p className="font-medium text-gray-800">{new Date(order.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Deadline</p>
                        <p className="font-medium text-gray-800">{new Date(order.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'client_approve')}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'client_reject')}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {order.status === 'in-progress' && (
                      <button
                        onClick={() => updateOrderStatus(order._id, 'client_complete')}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Mark as Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientOrders;