import React, { useState } from "react";
import {
  UserGroupIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  UserIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import StatCard from "../../components/client/StatCard"; // Assuming StatCard component exists

function AdminDashboard() {
  const [stats] = useState([
    {
      title: "Active Projects",
      value: "15", // Sample value
      icon: ChartBarIcon,
      color: "bg-blue-500",
    },
    {
      title: "Completed Projects",
      value: "30", // Sample value
      icon: CheckCircleIcon,
      color: "bg-green-500",
    },
    {
      title: "Pending Orders",
      value: "5", // Sample value
      icon: ShoppingBagIcon,
      color: "bg-yellow-500",
    },
    {
      title: "Total Clients",
      value: "120", // Sample value
      icon: UserGroupIcon,
      color: "bg-purple-500",
    },
    {
      title: "Freelancers",
      value: "80", // Sample value
      icon: UserIcon,
      color: "bg-indigo-500",
    },
    {
      title: "Total Revenue (₹)",
      value: "₹500,000", // Sample value
      icon: ClipboardDocumentListIcon,
      color: "bg-teal-500",
    },
  ]);

  const [recentData] = useState([
    { id: 1, title: "Project A", status: "active" },
    { id: 2, title: "Project B", status: "completed" },
    { id: 3, title: "Project C", status: "pending" },
    { id: 4, title: "Project D", status: "active" },
    { id: 5, title: "Project E", status: "completed" },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Recent Data Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Projects
          </h2>
          <div className="space-y-4">
            {recentData.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <p className="font-medium">{project.title}</p>
                </div>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    project.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : project.status === "active"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3 border-b pb-4">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm">A{i}</span>
                </div>
                <div>
                  <p className="font-medium">Activity detail goes here</p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;