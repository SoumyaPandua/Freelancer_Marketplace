// FreelancerModal.jsx
import React from 'react';

const FreelancerModal = ({ freelancer, onClose }) => {
  if (!freelancer) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-2xl font-semibold mb-4">Freelancer Details</h2>

        <div className="space-y-2">
          <div>
            <strong>Name:</strong> {freelancer.name}
          </div>
          <div>
            <strong>Email:</strong> {freelancer.email}
          </div>
          <div>
            <strong>Role:</strong> {freelancer.role || 'N/A'}
          </div>
          <div>
            <strong>Location:</strong> {freelancer.location || 'N/A'}
          </div>
          <div>
            <strong>Bio:</strong> {freelancer.bio || 'N/A'}
          </div>
          <div>
            <strong>Hourly Rate:</strong> ₹{freelancer.hourlyRate || 0}/hr
          </div>
          <div>
            <strong>Company Name:</strong> {freelancer.companyName || 'N/A'}
          </div>
          <div>
            <strong>Skills:</strong> {freelancer.skills?.join(', ') || 'N/A'}
          </div>
          <div>
            <strong>Portfolio:</strong>{' '}
            {freelancer.portfolio?.length > 0
              ? freelancer.portfolio.join(', ')
              : 'N/A'}
          </div>
          <div>
            <strong>Profile Image:</strong>{' '}
            {freelancer.profileImage ? (
              <img
                src={freelancer.profileImage}
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

export default FreelancerModal;