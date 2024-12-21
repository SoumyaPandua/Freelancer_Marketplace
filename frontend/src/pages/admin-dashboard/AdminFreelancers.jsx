import React, { useState, useEffect } from 'react';
import { Title } from '@tremor/react';
import { TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import FreelancerModal from '../../components/aadmin/FreelancerModal';
import { fetchAllUsers, deleteUser } from '../../services/authService';
import Loading from '../../components/Loading';
import Alert from '../../components/Alert';
import ConfirmationAlert from '../../components/ConfirmationAlert';

const AdminFreelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ isOpen: false, type: '', message: '' });
  const [confirmation, setConfirmation] = useState({ isOpen: false, id: null });

  // Fetch freelancers on component mount
  useEffect(() => {
    const fetchFreelancers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAllUsers(); // Call to fetch freelancers from backend
        setFreelancers(data.filter((user) => user.role === 'freelancer')); // Adjust filter as needed
      } catch (err) {
        setError('Failed to fetch freelancers.');
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  const handleView = (freelancer) => {
    setSelectedFreelancer(freelancer);
  };

  const handleDelete = async () => {
    const { id } = confirmation;
    if (!id) {
      setAlert({ isOpen: true, type: 'error', message: 'Invalid Freelancer ID!' });
      return;
    }

    try {
      setLoading(true);
      await deleteUser(id); // Call delete API
      setFreelancers((prev) => prev.filter((freelancer) => freelancer._id !== id)); // Update UI
      setAlert({ isOpen: true, type: 'success', message: 'Freelancer deleted successfully!' });
      setTimeout(() => setAlert({ isOpen: false, type: "", message: "" }), 1000);
    } catch (err) {
      setAlert({ isOpen: true, type: 'error', message: 'Failed to delete freelancer.' });
    } finally {
      setLoading(false);
      setConfirmation({ isOpen: false, id: null });
    }
  };

  const closeModal = () => {
    setSelectedFreelancer(null);
  };

  return (
    <div className="p-10 space-y-6">
      <div className="flex justify-between items-center">
        <Title className="text-2xl font-semibold">Freelancers</Title>
      </div>

      {loading && <Loading />}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">No.</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                  Freelancer Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {freelancers.map((freelancer, index) => (
                <tr
                  key={freelancer._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-gray-600">{index + 1}</td>
                  <td className="py-3 px-4 text-sm text-blue-600">{freelancer.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{freelancer.email}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(freelancer)}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors flex items-center"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => setConfirmation({ isOpen: true, id: freelancer._id })}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition-colors flex items-center"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Popup */}
      {selectedFreelancer && (
        <FreelancerModal
          freelancer={selectedFreelancer}
          onClose={closeModal}
        />
      )}

      {/* Alert Component */}
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => setAlert({ isOpen: false, type: '', message: '' })}
      />

      {/* Confirmation Alert Component */}
      <ConfirmationAlert
        isOpen={confirmation.isOpen}
        onClose={() => setConfirmation({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this freelancer?"
      />
    </div>
  );
};

export default AdminFreelancers;