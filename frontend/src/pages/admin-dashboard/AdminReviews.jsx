import React, { useEffect, useState } from 'react';
import { Title, Text } from '@tremor/react';
import { StarIcon } from '@heroicons/react/24/solid';
import Loading from '../../components/Loading'; // Loading spinner component
import Alert from '../../components/Alert'; // Alert component
import { fetchAllReviews } from '../../services/reviewService'; // Review service function

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ isOpen: false, type: '', message: '' });

  // Fetch reviews from the backend
  useEffect(() => {
    const getReviews = async () => {
      setLoading(true);
      try {
        const response = await fetchAllReviews();
        if (response.success) {
          setReviews(response.data);
        } else {
          setAlert({
            isOpen: true,
            type: 'error',
            message: 'Failed to fetch reviews. Please try again later.',
          });
        }
      } catch (error) {
        setAlert({
          isOpen: true,
          type: 'error',
          message: 'An error occurred while fetching reviews.',
        });
      } finally {
        setLoading(false);
      }
    };

    getReviews();
  }, []);

  // Function to render star ratings
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        className={`h-5 w-5 ${
          index < Math.floor(rating)
            ? 'text-yellow-400'
            : index < rating
            ? 'text-yellow-200'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="p-10 space-y-6">
      <div className="flex justify-between items-center">
        <Title className="text-xl font-semibold">Reviews Management</Title>
      </div>

      {/* Loading spinner */}
      {loading && <Loading />}

      {/* Alert for success or error */}
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />

      {/* Reviews table */}
      {!loading && reviews.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">No.</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Project Name</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Reviewer Name</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Reviewee Name</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Rating</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Message</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-600">{index + 1}</td>
                  <td className="py-3 px-4 text-sm text-blue-600">{review.projectName}</td>
                  <td className="py-3 px-4 text-sm text-indigo-600">{review.reviewerName}</td>
                  <td className="py-3 px-4 text-sm text-green-600">{review.revieweeName}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{review.date}</td>
                  <td className="py-3 px-4 text-sm text-yellow-600 flex items-center">
                    {renderStars(review.rating)} <Text className="ml-2">({review.rating})</Text>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <span className="text-gray-600">{`"${review.feedback}"`}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No reviews found */}
      {!loading && reviews.length === 0 && (
        <div className="text-gray-500 bg-gray-100 p-4 rounded-md">
          <Text>No reviews found.</Text>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;