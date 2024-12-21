import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../services/authService";
import useAuth from "../hooks/useAuth";
import Alert from "../components/Alert";

function Login() {
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", role: "" });
  const [alert, setAlert] = useState({ isOpen: false, type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ isOpen: false }); // Reset alert

    if (!formData.email || !formData.password || !formData.role) {
      setAlert({
        isOpen: true,
        type: "error",
        message: "All fields are required.",
      });
      return;
    }

    try {
      const response = await login(formData.email, formData.password, formData.role);
      contextLogin(response.user); // Update context
      setAlert({
        isOpen: true,
        type: "success",
        message: "Login successful! Redirecting...",
      });
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setAlert({
        isOpen: true,
        type: "error",
        message: err.message || "Login failed. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />
      <div className="max-w-md w-full bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Sign in to your account</h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-white">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-white bg-opacity-20 text-white focus:ring focus:ring-primary"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-white">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-white bg-opacity-20 text-white focus:ring focus:ring-primary"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="role" className="block text-white">Role</label>
            <select
              id="role"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-white bg-opacity-20 text-black focus:ring focus:ring-primary"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="client">Client</option>
              <option value="freelancer">Freelancer</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-yellow-400 text-black rounded-md py-2 hover:bg-yellow-500 transition-all">
            Sign in
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-white hover:underline">Forgot password?</Link>
        </div>
        <div className="mt-4 text-center">
          <p className="text-white">
            Don't have an account?{" "}
            <Link to="/register" className="text-yellow-400 hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;