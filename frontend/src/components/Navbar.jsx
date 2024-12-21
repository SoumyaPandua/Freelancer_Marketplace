import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Removed logout here since we handle it locally
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [isSticky, setIsSticky] = useState(false); // Sticky navbar state
  const [userRole, setUserRole] = useState(null); // Role of the logged-in user

  // Sync `isLoggedIn` state with sessionStorage
  useEffect(() => {
    const checkLoginStatus = () => {
      const user = JSON.parse(sessionStorage.getItem("user"));
      setIsLoggedIn(!!user);
      setUserRole(user?.user?.role || null);
    };

    // Check login status on mount
    checkLoginStatus();

    // Add event listener for sessionStorage changes
    window.addEventListener("storage", checkLoginStatus);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // Update `isLoggedIn` immediately after login
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      setIsLoggedIn(true);
      setUserRole(user?.user?.role || null);
    }
  }, [navigate]);

  // Sticky Navbar Logic
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout function
  const handleLogout = () => {
    sessionStorage.clear(); // Clear all session data
    setIsLoggedIn(false); // Update state
    setUserRole(null); // Reset user role
    setIsOpen(false); // Close mobile menu (if open)
    navigate("/login");
  };
  

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="px-4 py-2 rounded-lg text-white hover:bg-white/30 transition-all duration-300 backdrop-blur-sm bg-white/10"
    >
      {children}
    </Link>
  );

  const MobileNavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2 text-center rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-blue-500 hover:to-green-400 transition-all duration-300 shadow-md"
    >
      {children}
    </Link>
  );

  return (
    <nav
      className={`sticky top-0 w-full z-50 shadow-lg transition-all duration-300 ${isSticky
        ? "bg-gradient-to-r from-green-500 via-teal-600 to-blue-600"
        : "bg-gradient-to-r from-green-400 via-teal-500 to-blue-500"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-white">
              Freelance Marketplace
            </Link>
          </div>

          {/* Centered Navigation */}
          <div className="hidden md:flex items-center space-x-4 mx-auto">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            {!isLoggedIn && <NavLink to="/login">Login</NavLink>}
          </div>

          {/* Profile Dropdown */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center space-x-4">
              <span
                className="text-sm font-semibold animate-pulse"
                style={{
                  animation: "pulseColor 3s ease-in-out infinite", // Apply the extended pulse color animation
                }}
              >
                Welcome, {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}!
              </span>

              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 text-white hover:opacity-80">
                  <FaUserCircle className="w-8 h-8" />
                </Menu.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 ring-1 ring-black ring-opacity-5">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to={`/${user.role}/dashboard`}
                          className={`${active
                            ? "bg-gradient-to-r from-green-400 to-blue-500 text-white"
                            : "text-gray-700"
                            } block w-full text-left px-4 py-2 rounded-lg transition-all duration-300`}
                        >
                          Dashboard
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${active
                            ? "bg-gradient-to-r from-green-400 to-blue-500 text-white"
                            : "text-gray-700"
                            } block w-full text-left px-4 py-2 rounded-lg transition-all duration-300`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:opacity-80"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white py-2">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink to="/" onClick={() => setIsOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/projects" onClick={() => setIsOpen(false)}>
              Projects
            </MobileNavLink>
            {!isLoggedIn ? (
              <MobileNavLink to="/login" onClick={() => setIsOpen(false)}>
                Login
              </MobileNavLink>
            ) : (
              <>
                <MobileNavLink
                  to={`/${user.role}/dashboard`}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </MobileNavLink>
                <MobileNavLink
                  to="/login"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </MobileNavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;