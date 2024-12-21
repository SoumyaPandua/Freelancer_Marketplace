import React, { useEffect, useState } from "react";
import {
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { CurrencyRupeeIcon } from "@heroicons/react/24/outline"; // Import rupee icon
import StatCard from "../../components/client/StatCard";
import { getClientProjects } from "../../services/projectService";
import Loading from "../../components/Loading";

function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projects = await getClientProjects();

        const totalProjects = projects.length;
        const completedProjects = projects.filter(
          (project) => project.status === "completed"
        ).length;
        const ongoingProjects = projects.filter(
          (project) => project.status === "in-progress"
        ).length;

        const totalSpends = projects.reduce(
          (sum, project) => sum + (project.budget || 0),
          0
        );

        setStats([
          {
            title: "Total Projects",
            value: totalProjects.toString(),
            icon: BriefcaseIcon,
            color: "bg-blue-500",
          },
          {
            title: "Completed Projects",
            value: completedProjects.toString(),
            icon: CheckCircleIcon,
            color: "bg-green-500",
          },
          {
            title: "Ongoing Projects",
            value: ongoingProjects.toString(),
            icon: ClockIcon,
            color: "bg-yellow-500",
          },
          {
            title: "Total Spends",
            value: `₹${totalSpends.toLocaleString()}`,
            icon: CurrencyRupeeIcon,
            color: "bg-purple-500",
          },
        ]);

        // Fetch recent projects (latest 5)
        setRecentProjects(projects.slice(0, 5));
      } catch (err) {
        setError("Failed to load statistics. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

      {loading && !error && <Loading />} {/* Use Loading component here */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {!loading && !error
          ? stats.map((stat) => <StatCard key={stat.title} {...stat} />)
          : [1, 2, 3, 4].map((i) => <StatCard key={i} loading />)}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Projects
          </h2>
          <div className="space-y-4">
            {!loading &&
              recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div>
                    <p className="font-medium">{project.title}</p>
                    {/* <p className="text-sm text-gray-600">
                      Client: {project.clientName}
                    </p> */}
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      project.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : project.status === "in-progress"
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
                  <p className="font-medium">New bid received</p>
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

export default Dashboard;