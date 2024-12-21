// ClientModal.jsx
import React from 'react';

const ClientModal = ({ client, onClose }) => {
  if (!client) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-2xl font-semibold mb-4">Client Details</h2>

        <div className="space-y-2">
          <div>
            <strong>Name:</strong> {client.name}
          </div>
          <div>
            <strong>Email:</strong> {client.email}
          </div>
          <div>
            <strong>Role:</strong> {client.role || 'N/A'}
          </div>
          <div>
            <strong>Location:</strong> {client.location || 'N/A'}
          </div>
          <div>
            <strong>Bio:</strong> {client.bio || 'N/A'}
          </div>
          <div>
            <strong>Profile Image:</strong>{' '}
            {client.profileImage ? (
              <img
                src={client.profileImage}
                alt="Profile"
                className="h-16 w-16 rounded-full"
              />
            ) : (
              'N/A'
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ClientModal;