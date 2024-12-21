import React, { useState, useEffect } from 'react';
import { Card, Title, Text } from '@tremor/react';
import { ClockIcon } from '@heroicons/react/24/solid';
import Loading from '../../components/Loading';
import Alert from '../../components/Alert';
import { fetchAdminOrders } from '../../services/orderService';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ isOpen: false, type: '', message: '' });

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetchAdminOrders();
        console.log("Fetched orders response:", response); // Debug response
  
        // Access the correct field in the response
        if (response.success && Array.isArray(response.data)) {
          setOrders(response.data); // Update state with `data` array
        } else {
          throw new Error('Orders data is invalid or not an array.');
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setAlert({
          isOpen: true,
          type: 'error',
          message: error.message || 'Something went wrong while fetching orders.',
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    loadOrders();
  }, []);  

  // Debugging - Log orders after fetch
  useEffect(() => {
    console.log("Orders state updated:", orders);
  }, [orders]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const StatusBadge = ({ status }) => (
    <span
      className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(status)}`}
      style={{ minWidth: '100px', textAlign: 'center' }}
    >
      {status || 'N/A'}
    </span>
  );

  const renderOrderCard = (order) => {
    if (!order) return null; // Defensive check for undefined/null orders
    return (
      <Card
        key={order.id || Math.random()} // Ensure a unique key
        className="transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl rounded-lg border border-gray-200 bg-white"
        style={{
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)',
        }}
      >
        <div className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Title className="text-2xl font-bold text-blue-600 mb-1">
                {order.projectTitle || 'N/A'}
              </Title>
              <Text className="text-gray-600">
                <span className="font-semibold text-purple-600">Client:</span>{' '}
                <span className="text-blue-500 font-medium">{order.clientName || 'Unknown'}</span>
              </Text>
              <Text className="text-gray-600">
                <span className="font-semibold text-purple-600">Freelancer:</span>{' '}
                <span className="text-green-500 font-medium">{order.freelancerName || 'Unknown'}</span>
              </Text>
            </div>
            <StatusBadge status={order.status || 'N/A'} />
          </div>

          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <Text className="text-gray-600 font-medium">Amount:</Text>
              <Text className="font-semibold text-green-600">
                {order.amount || '0'}
              </Text>
            </div>

            <div className="flex justify-between items-center">
              <Text className="text-gray-600 font-medium">Deadline:</Text>
              <div className="flex items-center gap-1">
                <ClockIcon className="h-5 w-5 text-gray-500" />
                <Text className="text-gray-700">{order.deadline || 'N/A'}</Text>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <Title className="text-3xl font-bold text-gray-800 text-center mb-4">
        Orders Management
      </Title>

      {isLoading && <Loading />}

      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />

      {!isLoading && Array.isArray(orders) && orders.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => renderOrderCard(order))}
        </div>
      ) : (
        !isLoading && (
          <Text className="text-center text-gray-500">
            {Array.isArray(orders) ? 'No orders available to display.' : 'Orders data is invalid.'}
          </Text>
        )
      )}
    </div>
  );
};

export default AdminOrders;
