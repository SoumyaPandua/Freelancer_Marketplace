import React, { useState, useEffect } from "react";
import {
  BriefcaseIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import StatCard from "../../components/freelancer/StatCard";
import { Line } from "react-chartjs-2";
import Loading from "../../components/Loading";
import Alert from "../../components/Alert";
import {
  getAllProjects,
} from "../../services/projectService";
import {
  getFreelancerBids,
} from "../../services/bidService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function FreelancerDashboard() {
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ isOpen: false, type: "", message: "" });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsResponse, bidsResponse] = await Promise.all([
          getAllProjects(),
          getFreelancerBids(),
        ]);
  
        const projects = projectsResponse?.data || [];
        const bids = Array.isArray(bidsResponse?.data) ? bidsResponse.data : [];
  
        // Process stats
        const completedProjects = projects.filter(
          (project) => project.status === "completed"
        ).length;
        const inProgressProjects = projects.filter(
          (project) => project.status === "in_progress"
        ).length;
        const totalEarnings = bids.reduce((sum, bid) => sum + (bid.amount || 0), 0);
  
        setStats([
          {
            title: "Total Projects",
            value: projects.length,
            icon: BriefcaseIcon,
            color: "bg-blue-500",
          },
          {
            title: "Total Earnings",
            value: `₹${totalEarnings.toLocaleString()}`,
            icon: CurrencyRupeeIcon,
            color: "bg-green-500",
          },
          {
            title: "Completed Projects",
            value: completedProjects,
            icon: CheckCircleIcon,
            color: "bg-purple-500",
          },
          {
            title: "In Progress",
            value: inProgressProjects,
            icon: ClockIcon,
            color: "bg-yellow-500",
          },
        ]);
  
        // Process chart data
        const earningsData = projects.map((project) => project.monthlyEarnings || 0);
        setChartData({
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Earnings",
              data: earningsData,
              borderColor: "rgb(59, 130, 246)",
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        setAlert({
          isOpen: true,
          type: "error",
          message: error.message || "Failed to fetch dashboard data",
        });
      } finally {
        setLoading(false);
      }
    };
  
    // Call the fetch function
    fetchDashboardData();
  }, []);  

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Earnings",
      },
    },
  };

  return (
    <div>
      {loading && <Loading />}
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />

      <h1 className="text-3xl font-bold mb-8">Freelancer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {chartData && <Line data={chartData} options={chartOptions} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
          {/* Add recent projects list here */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Latest Notifications</h2>
          {/* Add notifications list here */}
        </div>
      </div>
    </div>
  );
}

export default FreelancerDashboard;