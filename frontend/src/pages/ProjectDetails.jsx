import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getProjectById } from "../services/projectService";
import useAuth from "../hooks/useAuth"; // Import to get user role

function ProjectDetails() {
  const { id } = useParams(); // Extract the project ID
  const [project, setProject] = useState(null);
  const { user } = useAuth(); // Get current user info
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const data = await getProjectById(id);
        setProject(data);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleBidClick = (project) => {
    navigate('/freelancer/createbid', { state: { project } });
  };

  if (!project) {
    return <p>Loading project details...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-6">{project.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="glass-effect rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-3">Project Details</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Project Title:</span> {project.title || "Anonymous"}</p>
                  <p><span className="font-medium">Created by:</span> {project.clientId.name || "Anonymous"}</p>
                  <p><span className="font-medium">Technology:</span> {project.skillsRequired.join(", ")}</p>
                  <p><span className="font-medium">Budget:</span> ${project.budget}</p>
                  <p><span className="font-medium">Deadline:</span> {new Date(project.deadline).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="glass-effect rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-3">Client Information</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Rating:</span></p>
                  {/* {project.creatorProfile.rating}/5 */}
                  <p><span className="font-medium">Projects Completed:</span></p>
                  {/* {project.creatorProfile.projectsCompleted} */}
                  <p><span className="font-medium">Member Since:</span></p>
                  {/* {project.creatorProfile.memberSince} */}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-effect rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-3">Project Description</h2>
                <p className="text-sm leading-relaxed">{project.description}</p>
              </div>

              <div className="glass-effect rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                <ul className="list-disc list-inside space-y-2">
                  {/* {project.requirements.map((req, index) => (
                    <li key={index} className="text-sm">{req}</li>
                  ))} */}
                </ul>
              </div>
            </div>
          </div>

          {user?.role === "freelancer" ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
               onClick={() => handleBidClick(project)}
               className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                Place Bid
              </button>
              <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                Order Now
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;