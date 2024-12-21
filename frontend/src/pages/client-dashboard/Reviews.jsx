import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { fetchClientProjects, createReview } from "../../services/reviewService";
import Loading from "../../components/Loading";
import Alert from "../../components/Alert";

function Review() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    projectId: "",
    freelancerName: "",
    comment: "",
    rating: 0,
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, type: "", message: "" });

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await fetchClientProjects();
        console.log(response);
        
        setProjects(response.data);
      } catch (error) {
        showAlert("error", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Show alert
  const showAlert = (type, message) => {
    setAlert({ isOpen: true, type, message });
    setTimeout(() => setAlert({ isOpen: false, type: "", message: "" }), 3000);
  };

  // Handle project selection
  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    const selectedProject = projects.find((project) => project.projectId._id === projectId);

    setFormData((prev) => ({
      ...prev,
      projectId,
      freelancerName: selectedProject?.freelancerId?.name || "",
    }));
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.projectId || !formData.rating) {
      showAlert("error", "Please select a project and provide a rating.");
      return;
    }

    setIsLoading(true);
    try {
      await createReview({
        projectId: formData.projectId,
        rating: formData.rating,
        feedback: formData.comment,
      });
      showAlert("success", "Review submitted successfully!");
      setFormData({ projectId: "", freelancerName: "", comment: "", rating: 0 });
    } catch (error) {
      showAlert("error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      {isLoading && <Loading />}
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => setAlert({ isOpen: false, type: "", message: "" })}
      />

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Rate Your Experience</h2>
            <p className="text-lg text-gray-600">
              Your feedback helps us improve our service
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Project Selection */}
            <div>
              <label htmlFor="projectId" className="block text-lg font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <select
                id="projectId"
                name="projectId"
                value={formData.projectId}
                onChange={handleProjectChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-3 px-4 transition-all duration-200 hover:border-indigo-400"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.projectId._id} value={project.projectId._id}>
                    {project.projectId.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Freelancer Name */}
            <div>
              <label htmlFor="freelancerName" className="block text-lg font-medium text-gray-700 mb-2">
                Freelancer Name
              </label>
              <input
                type="text"
                id="freelancerName"
                name="freelancerName"
                value={formData.freelancerName}
                onChange={handleInputChange}
                readOnly
                className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-3 px-4 transition-all duration-200"
                placeholder="Freelancer name will appear here"
              />
            </div>

            {/* Comment Section */}
            <div>
              <label htmlFor="comment" className="block text-lg font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                id="comment"
                name="comment"
                rows="5"
                value={formData.comment}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-3 px-4 transition-all duration-200 hover:border-indigo-400 resize-none"
                placeholder="Share your experience..."
              />
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">Rating</label>
              <div className="flex gap-3 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`cursor-pointer text-4xl transition-all duration-200 transform hover:scale-110 ${
                      star <= (hoveredRating || formData.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-md text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] mt-8"
            >
              Rate Freelancer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Review;
