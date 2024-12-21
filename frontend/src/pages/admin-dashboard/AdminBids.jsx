import React, { useEffect, useState } from 'react';
import { Title, Text } from '@tremor/react';
import { getAllBidsForAdmin } from '../../services/bidService';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'accepted':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const AdminBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState({ isOpen: false, type: '', message: '' });

  // Fetch bids on component mount
  useEffect(() => {
    const fetchBids = async () => {
      setLoading(true);
      try {
        const response = await getAllBidsForAdmin(); // Fetch all bids for admin
        setBids(response.data.bids);
      } catch (err) {
        setAlert({
          isOpen: true,
          type: 'error',
          message: err.response?.data?.message || 'Failed to fetch bids',
        });
        setError(err.message || 'Failed to fetch bids');
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  const closeAlert = () => {
    setAlert({ ...alert, isOpen: false });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <>
        <Alert type="error" message={error} isOpen={alert.isOpen} onClose={closeAlert} />
        <div className="p-12">
          <Text className="text-red-700">Error: {error}</Text>
        </div>
      </>
    );
  }

  return (
    <div className="p-12 space-y-12">
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={closeAlert}
      />

      <Title className="text-3xl font-bold text-gray-800">Bids Management</Title>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full bg-white border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">Project</th>
              <th className="px-6 py-4 text-left">Freelancer</th>
              <th className="px-6 py-4 text-left">Client</th>
              <th className="px-6 py-4 text-left">Amount</th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bids.map((bid) => (
              <tr key={bid.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <Text className="font-medium text-gray-900">{bid.projectTitle}</Text>
                  <Text className="text-sm text-gray-500">Submitted: {bid.submitted}</Text>
                </td>
                <td className="px-6 py-4">
                  <Text className="text-gray-700">{bid.freelancer}</Text>
                </td>
                <td className="px-6 py-4">
                  <Text className="text-gray-700">{bid.client}</Text>
                </td>
                <td className="px-6 py-4">
                  <Text className="font-semibold text-green-600">₹{bid.bidAmount}</Text>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(
                      bid.status
                    )}`}
                  >
                    {bid.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBids;