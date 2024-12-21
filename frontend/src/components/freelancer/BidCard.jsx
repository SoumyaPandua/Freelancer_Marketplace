import React, { useEffect, useState } from "react";
import { getProjectById } from "../../services/projectService";
import { fetchProfile } from "../../services/authService";

function BidCard({ projectId, freelancerId, bidAmount, proposal, status, createdAt }) {
  const [projectName, setProjectName] = useState("Loading...");
  const [freelancerName, setFreelancerName] = useState("Loading...");
  const formattedDate = new Date(createdAt).toLocaleDateString("en-CA");
  

  const statusColors = {
    pending: "bg-yellow-500 text-yellow-100",
    accepted: "bg-green-500 text-green-100",
    rejected: "bg-red-500 text-red-100",
  };

  useEffect(() => {
    const fetchProjectName = async () => {
      try {
        const project = await getProjectById(projectId._id);
        setProjectName(project?.title || "Unknown Project");
      } catch (error) {
        console.error("Error fetching project name:", error);
        setProjectName("Unknown Project");
      }
    };

    const fetchFreelancerName = async () => {
      try {
        const profile = await fetchProfile(freelancerId);
        setFreelancerName(profile?.name || "Unknown Freelancer");
      } catch (error) {
        console.error("Error fetching freelancer name:", error);
        setFreelancerName("Unknown Freelancer");
      }
    };

    fetchProjectName();
    fetchFreelancerName();
  }, [projectId, freelancerId]);

  return (
    <div className="relative p-6 bg-opacity-30 backdrop-filter backdrop-blur-lg bg-white shadow-lg rounded-xl border border-opacity-20 border-white hover:shadow-2xl transition-shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-3">
        Project: <span className="text-gray-600">{projectName}</span>
      </h3>

      <p className="text-gray-700 mb-4">
        <strong>Proposal:</strong> {proposal}
      </p>

      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-indigo-600">
          <strong>Budget :</strong> ₹{bidAmount}
        </span>
        <span
          className={`px-4 py-1 rounded-full font-medium ${statusColors[status]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Freelancer Name */}
      <p className="text-sm text-gray-500 mb-2">
        <strong>Freelancer:</strong> {freelancerName}
      </p>

      {/* Submitted Date */}
      <p className="text-sm text-gray-500">
        <strong>Submitted on:</strong> {formattedDate}
      </p>

      {/* Decorative Design */}
      <div className="absolute -top-3 -right-3 w-12 h-12 bg-indigo-300 rounded-full opacity-20 blur-md"></div>
      <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-purple-300 rounded-full opacity-20 blur-md"></div>
    </div>
  );
}

export default BidCard;