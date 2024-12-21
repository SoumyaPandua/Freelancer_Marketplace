import React, { useState, useEffect } from 'react';
import { Title } from '@tremor/react';
import { TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import ClientModal from '../../components/aadmin/ClientModal';
import { fetchAllUsers, deleteUser } from '../../services/authService';
import Loading from '../../components/Loading';
import Alert from '../../components/Alert';
import ConfirmationAlert from '../../components/ConfirmationAlert';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, type: '', message: '' });
  const [confirmation, setConfirmation] = useState({ isOpen: false, id: null });

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const data = await fetchAllUsers();
        setClients(data.filter((user) => user.role === 'client'));
      } catch (err) {
        setAlert({
          isOpen: true,
          type: 'error',
          message: 'Failed to load clients. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleView = (client) => {
    setSelectedClient(client);
  };

  const handleDelete = async () => {
    const { id } = confirmation;
    if (!id) {
      setAlert({ isOpen: true, type: 'error', message: 'Invalid Client ID!' });
      return;
    }

    try {
      setLoading(true);
      await deleteUser(id); // Delete client API call
      setClients((prev) => prev.filter((client) => client._id !== id)); // Update UI
      setAlert({ isOpen: true, type: 'success', message: 'Client deleted successfully!' });
      setTimeout(() => setAlert({ isOpen: false, type: "", message: "" }), 1000);
    } catch (err) {
      setAlert({
        isOpen: true,
        type: 'error',
        message: 'Failed to delete client. Please try again.',
      });
    } finally {
      setLoading(false);
      setConfirmation({ isOpen: false, id: null });
    }
  };

  const closeModal = () => {
    setSelectedClient(null);
  };

  return (
    <div className="p-10 space-y-6">
      {loading && <Loading />}
      <Alert
        isOpen={alert.isOpen}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ isOpen: false, type: '', message: '' })}
      />

      <div className="flex justify-between items-center">
        <Title className="text-2xl font-semibold">Clients</Title>
      </div>

      {!loading && clients.length === 0 && (
        <p className="text-gray-500">No clients found.</p>
      )}

      {!loading && clients.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">No.</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Client Name</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <tr key={client._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-600">{index + 1}</td>
                  <td className="py-3 px-4 text-sm text-blue-600">{client.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{client.email}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(client)}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors flex items-center"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => setConfirmation({ isOpen: true, id: client._id })}
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

      {selectedClient && (
        <ClientModal client={selectedClient} onClose={closeModal} />
      )}

      <ConfirmationAlert
        isOpen={confirmation.isOpen}
        onClose={() => setConfirmation({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this client?"
      />
    </div>
  );
};

export default AdminClients;