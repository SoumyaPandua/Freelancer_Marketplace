import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects } from '../../services/projectService';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';
import debounce from 'lodash.debounce';
import { createOrder } from '../../services/orderService';

function FreelancerProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [budget, setBudget] = useState('');
  const [skill, setSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, message: '', type: '' });
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [orderDates, setOrderDates] = useState({
    startDate: '',
    deadline: ''
  });

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const fetchedProjects = await getAllProjects();
        setProjects(fetchedProjects);
        setFilteredProjects(fetchedProjects);
      } catch (error) {
        setAlert({ isOpen: true, message: 'Failed to load projects', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const applyFilters = useCallback(
    debounce(() => {
      let updatedProjects = [...projects];

      if (search) {
        updatedProjects = updatedProjects.filter((project) =>
          project.title.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (budget) {
        if (budget === '5000+') {
          updatedProjects = updatedProjects.filter((project) => project.budget >= 5000);
        } else {
          const [min, max] = budget.split('-').map(Number);
          updatedProjects = updatedProjects.filter(
            (project) => project.budget >= min && (!max || project.budget <= max)
          );
        }
      }

      if (skill) {
        updatedProjects = updatedProjects.filter((project) =>
          project.skillsRequired.some((s) => s.toLowerCase() === skill.toLowerCase())
        );
      }

      setFilteredProjects(updatedProjects);
    }, 300),
    [search, budget, skill, projects]
  );

  useEffect(() => {
    applyFilters();
  }, [search, budget, skill, projects, applyFilters]);

  const closeAlert = () => setAlert({ isOpen: false, message: '', type: '' });

  const handleBidClick = (project) => {
    navigate('/freelancer/createbid', { state: { project } });
  };

  const handleViewProjects = (id) => {
    navigate(`/projects/${id}`);
  };

  // Handle opening the order modal
  const handleOrderClick = (project) => {
    setSelectedProject(project);
    setShowOrderModal(true);
  };

  // Handle order submission
  const handleSubmitOrder = async () => {
    const { startDate, deadline } = orderDates;
  
    // Check if both dates are set
    if (!startDate || !deadline) {
      setAlert({
        isOpen: true,
        message: 'Please select both start and end dates',
        type: 'error',
      });
      console.error('Start date or end date is missing:', { startDate, deadline });
      return;
    }
  
    // Check if start date is in the past
    if (new Date(startDate) < new Date(new Date().toISOString().split('T')[0])) {
      setAlert({
        isOpen: true,
        message: 'Start date cannot be in the past',
        type: 'error',
      });
      return;
    }
  
    // Check if end date is after the start date
    if (new Date(deadline) <= new Date(startDate)) {
      setAlert({
        isOpen: true,
        message: 'End date must be after the start date',
        type: 'error',
      });
      return;
    }
  
    // Log the dates to ensure they are correct
    console.log('Submitting order with:', { startDate, deadline });
  
    setIsLoading(true);
    try {
      const response = await createOrder({
        projectId: selectedProject._id, // Ensure this is the correct project ID
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
        message:
          error.response?.status === 409
            ? 'You have already created an order for this project'
            : 'Failed to create the order. Please try again.',
        type: 'error',
      });
      console.error('Error creating order:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  // Modal component
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
              onChange={(e) => setOrderDates(prev => ({
                ...prev,
                startDate: e.target.value
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
              onChange={(e) => setOrderDates(prev => ({
                ...prev,
                deadline: e.target.value
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
              disabled={isLoading} // Disable the button while loading
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
    <div className="bg-gradient-to-r from-indigo-50 to-purple-100 min-h-screen p-8">
      {isLoading && <Loading />}
      {alert.isOpen && <Alert {...alert} onClose={closeAlert} />}
      {showOrderModal && <OrderModal />}

      <h1 className="text-4xl font-bold mb-8 text-purple-700 text-center">Find Projects</h1>

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            type="text"
            placeholder="Search for projects by title..."
            className="p-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="p-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-md"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option value="">Select Budget Range</option>
            <option value="0-1000">₹0 - ₹1,000</option>
            <option value="1000-5000">₹1,000 - ₹5,000</option>
            <option value="5000+">₹5,000+</option>
          </select>

          <select
            className="p-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-md"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          >
            <option value="">Select Skill</option>
            <option value="react">React</option>
            <option value="node.js">Node.js</option>
            <option value="javascript">JavaScript</option>
            <option value="react native">React Native</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white bg-opacity-60 p-6 rounded-lg shadow-lg border border-gray-200 hover:bg-opacity-80 hover:shadow-xl transition-all duration-200"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-700">{project.title}</h2>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <p className="font-medium text-indigo-600 mb-2">Budget: ₹{project.budget}</p>
              <p className="font-medium text-indigo-600 mb-2">
                Deadline: {new Date(project.deadline).toLocaleDateString()}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {project.skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-purple-200 to-indigo-200 text-indigo-800 font-medium px-3 py-1 rounded-full shadow-sm text-sm hover:from-purple-300 hover:to-indigo-300 hover:text-indigo-900 transition-all duration-150"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleViewProjects(project._id)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-600"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleOrderClick(project)}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-md hover:from-green-600 hover:to-teal-600"
                >
                  Order
                </button>
                <button
                  onClick={() => handleBidClick(project)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-pink-600"
                >
                  Bid
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-lg text-center">No projects found. Try adjusting your filters.</p>
        )}
      </div>
    </div>
  );
}

export default FreelancerProjects;