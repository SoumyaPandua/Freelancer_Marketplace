import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProjects } from "../services/projectService";
import { createOrder } from "../services/orderService";
import useAuth from "../hooks/useAuth";
import Alert from "../components/Alert";
import Loading from "../components/Loading";

function Projects() {
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, message: '', type: '' });
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [orderDates, setOrderDates] = useState({
    startDate: '',
    deadline: '',
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const closeAlert = () => setAlert({ isOpen: false, message: '', type: '' });

  const handleViewDetails = (id) => {
    navigate(`/projects/${id}`);
  };

  const handleBidClick = (project) => {
    navigate('/freelancer/createbid', { state: { project } });
  };

  const handleOrderClick = (project) => {
    setSelectedProject(project);
    setShowOrderModal(true);
  };

  const handleSubmitOrder = async () => {
    const { startDate, deadline } = orderDates;

    if (!startDate || !deadline) {
      setAlert({
        isOpen: true,
        message: 'Please select both start and end dates',
        type: 'error',
      });
      return;
    }

    if (new Date(startDate) < new Date(new Date().toISOString().split('T')[0])) {
      setAlert({
        isOpen: true,
        message: 'Start date cannot be in the past',
        type: 'error',
      });
      return;
    }

    if (new Date(deadline) <= new Date(startDate)) {
      setAlert({
        isOpen: true,
        message: 'End date must be after the start date',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await createOrder({
        projectId: selectedProject._id,
        startDate,
        deadline,
      });

      if (response.success) {
        setAlert({
          isOpen: true,
          message: 'Order created successfully!',
          type: 'success',
        });
        setShowOrderModal(false);
        setOrderDates({ startDate: '', deadline: '' });
        setTimeout(() => setAlert({ isOpen: false, message: '', type: '' }), 500);
      }
    } catch (error) {
      setAlert({
        isOpen: true,
        message: 'Failed to create the order. Please try again.',
        type: 'error',
      });
      console.error("Error creating order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const OrderModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Order</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={orderDates.startDate}
              onChange={(e) => setOrderDates((prev) => ({
                ...prev,
                startDate: e.target.value,
              }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={orderDates.deadline}
              onChange={(e) => setOrderDates((prev) => ({
                ...prev,
                deadline: e.target.value,
              }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowOrderModal(false)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitOrder}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 ${isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
                } rounded-md transition-colors`}
            >
              {isLoading ? 'Loading...' : 'Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4">
      {isLoading && <Loading />}
      {alert.isOpen && <Alert {...alert} onClose={closeAlert} />}
      {showOrderModal && <OrderModal />}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Available Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white/20 backdrop-blur-lg rounded-xl shadow-xl p-8 text-white space-y-6"
            >
              <h2 className="text-2xl font-semibold mb-4">{project.title}</h2>
              <p className="text-sm leading-relaxed">{project.description}</p>
              <div className="space-y-4">
                <p><span className="font-medium">Budget:</span> ₹{project.budget}</p>
                <p><span className="font-medium">Deadline:</span> {new Date(project.deadline).toLocaleDateString()}</p>
                <p><span className="font-medium">Skills Required:</span> {project.skillsRequired.join(", ")}</p>
                <p><span className="font-medium">Status:</span> {project.status}</p>
                <p><span className="font-medium">Posted By:</span> {project.clientId.name || "Anonymous"}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                {user?.role === "freelancer" && (
                  <>
                    <button
                      onClick={() => handleBidClick(project)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Bid
                    </button>
                    <button
                      onClick={() => handleOrderClick(project)}
                      className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Order
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleViewDetails(project._id)}
                  className="bg-black/30 hover:bg-black/40 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;