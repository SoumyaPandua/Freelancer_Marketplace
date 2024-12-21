import React, { useEffect, useState } from "react";
import { fetchFreelancerReviews, fetchFreelancerAverageRating } from "../../services/reviewService";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";

function FreelancerReviews() {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ isOpen: false, type: "", message: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const averageData = await fetchFreelancerAverageRating();
        setAverageRating(averageData.data.averageRating);
        setTotalReviews(averageData.data.totalReviews);

        const reviewsData = await fetchFreelancerReviews();
        setReviews(reviewsData.data);
      } catch (err) {
        console.error("Error loading freelancer data:", err);
        setAlert({
          isOpen: true,
          type: "error",
          message: "Failed to load freelancer reviews. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCloseAlert = () => {
    setAlert({ ...alert, isOpen: false });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-6 xl:p-6">
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={handleCloseAlert}
      />
      <h1 className="text-3xl font-bold mb-8 text-blue-500">Reviews</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 transition-transform transform hover:scale-105 duration-300">
        <div className="flex items-center gap-4">
          <div
            className="text-4xl font-bold text-green-500 cursor-pointer hover:scale-110 transition-transform duration-200"
            title="Average Rating"
          >
            {averageRating || "-"}
          </div>
          <div>
            <div
              className="flex text-yellow-400 text-2xl cursor-pointer hover:scale-110 transition-transform duration-200"
              title="Stars"
            >
              {averageRating ? "★".repeat(Math.round(averageRating)) : "☆".repeat(5)}
            </div>
            <p className="text-gray-500">
              {totalReviews > 0
                ? `Average rating from ${totalReviews} reviews`
                : "No reviews yet."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-lg shadow-md p-6 transition-transform transform hover:scale-105 duration-300 hover:shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-blue-500 text-lg cursor-pointer hover:scale-110 transition-transform duration-200">
                    {review.reviewerId.name}
                  </h3>
                  <p className="text-sm text-gray-500">{review.projectId.title}</p>
                </div>
                <div className="flex text-yellow-400">
                  {"★".repeat(review.rating)}
                </div>
              </div>
              <p className="text-gray-600 mb-2">{review.feedback}</p>
              <p className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-2">No reviews found.</div>
        )}
      </div>
    </div>
  );
}

export default FreelancerReviews;