import React, { useEffect, useState } from 'react';
import { Card, Title, Text } from '@tremor/react';
import { fetchAllProjectsForAdmin } from '../../services/projectService';
import Loading from '../../components/Loading';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProjects = async () => {
      try {
        setLoading(true); // Start loading
        const data = await fetchAllProjectsForAdmin();
        setProjects(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch projects');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    getProjects();
  }, []);

  if (loading) {
    return <Loading />; // Display Loading component when data is being fetched
  }

  if (error) {
    return <div className="text-center text-xl text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="p-12 space-y-12">
      <Title className="text-3xl font-bold text-gray-800 text-center mb-4">Projects Management</Title>

      {/* Grid Layout */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project._id} // Assuming _id is the MongoDB ID
            className="transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl rounded-lg border border-gray-200 bg-white"
            style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)' }}
          >
            <div className="p-4">
              {/* Project Title */}
              <Title className="text-2xl font-bold text-blue-600 mb-2">{project.title}</Title>

              {/* Project Details */}
              <div className="space-y-2 text-gray-700">
                <Text>
                  <span className="font-semibold">Client:</span> {project.client || 'Unknown'}
                </Text>
                <Text>
                  <span className="font-semibold">Budget:</span> ₹{project.budget}
                </Text>
                <Text>
                  <span className="font-semibold">Deadline:</span> {project.deadline}
                </Text>

                {/* Status with Dynamic Color */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm capitalize ${
                      project.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : project.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : project.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;