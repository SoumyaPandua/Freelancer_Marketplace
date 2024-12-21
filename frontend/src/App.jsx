import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AuthProvider from "./context/authContext";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Layout from "./components/client/Layout";
import Dashboard from "./pages/client-dashboard/Dashboard";
import Profile from "./pages/client-dashboard/Profile";
import ClientProjects from "./pages/client-dashboard/ClientProjects";
import Bids from "./pages/client-dashboard/Bids";
import Orders from "./pages/client-dashboard/Orders";
import Payments from "./pages/client-dashboard/Payments";
import Reviews from "./pages/client-dashboard/Reviews";

// freelancer
import FreelancerLayout from "./components/freelancer/FreelancerLayout";
import FreelancerDashboard from "./pages/freelancer-dashboard/FreelancerDashboard";
import FreelancerProfile from "./pages/freelancer-dashboard/FreelancerProfile";
import FreelancerProjects from "./pages/freelancer-dashboard/FreelancerProjects";
import FreelancerBids from "./pages/freelancer-dashboard/FreelancerBids";
import FreelancerOrders from "./pages/freelancer-dashboard/FreelancerOrders";
import FreelancerReviews from "./pages/freelancer-dashboard/FreelancerReviews";
import FreelancerPayments from "./pages/freelancer-dashboard/FreelancerPayments";
import CreateBids from "./pages/freelancer-dashboard/CreateBids";

// admin
import AdminLayout from "./components/aadmin/AdminLayout";
import AdminDashboard from "./pages/admin-dashboard/AdminDashboard";
import AdminProfile from "./pages/admin-dashboard/AdminProfile";
import AdminProjects from "./pages/admin-dashboard/AdminProjects";
import AdminBids from "./pages/admin-dashboard/AdminBids";
import AdminOrders from "./pages/admin-dashboard/AdminOrders";
import AdminReviews from "./pages/admin-dashboard/AdminReviews";
import AdminPayments from "./pages/admin-dashboard/AdminPayments";
import AdminSettings from "./pages/admin-dashboard/AdminSettings";
import AdminClients from "./pages/admin-dashboard/AdminClients";
import AdminFreelancers from "./pages/admin-dashboard/AdminFreelancers";

const App = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

const AppRoutes = () => {
  const location = useLocation();
  const isClientRoute = location.pathname.startsWith("/client");
  const isFreelancerRoute = location.pathname.startsWith("/freelancer");
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {!isClientRoute && !isFreelancerRoute && !isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />

          {/* Client Routes */}
          <Route path="/client/*" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="projects" element={<ClientProjects />} />
            <Route path="payments" element={<Payments />} />
            <Route path="bids" element={<Bids />} /> 
            <Route path="reviews" element={<Reviews />} /> 
            <Route path="orders" element={<Orders />} /> 
          </Route>

          {/* freelancer Routes */}
          <Route path="/freelancer/*" element={<FreelancerLayout />}>
            <Route path="dashboard" element={<FreelancerDashboard />} />
            <Route path="profile" element={<FreelancerProfile />} />
            <Route path="projects" element={<FreelancerProjects />} />
            <Route path="payments" element={<FreelancerPayments />} />
            <Route path="bids" element={<FreelancerBids />} /> 
            <Route path="createbid" element={<CreateBids />} />  
            <Route path="reviews" element={<FreelancerReviews />} /> 
            <Route path="orders" element={<FreelancerOrders />} /> 
          </Route>

          {/* ddmin Routes */}
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="bids" element={<AdminBids />} />  
            <Route path="reviews" element={<AdminReviews />} /> 
            <Route path="orders" element={<AdminOrders />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="freelancers" element={<AdminFreelancers />} />
          </Route>
        </Routes>        
      </main>
      {!isClientRoute && !isFreelancerRoute && !isAdminRoute && <Footer />}
    </div>
  );
};

export default App;