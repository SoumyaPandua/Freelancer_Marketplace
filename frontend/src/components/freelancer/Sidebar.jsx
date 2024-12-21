import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, UserIcon, BriefcaseIcon, DocumentTextIcon, 
  ShoppingBagIcon, CreditCardIcon, StarIcon, 
  ArrowRightOnRectangleIcon, 
  Bars3Icon, XMarkIcon 
} from '@heroicons/react/24/outline';

const menuItems = [
  { path: '/freelancer/dashboard', name: 'Dashboard', icon: HomeIcon },
  { path: '/freelancer/profile', name: 'Profile', icon: UserIcon },
  { path: '/freelancer/projects', name: 'Projects', icon: BriefcaseIcon },
  { path: '/freelancer/bids', name: 'Bids', icon: DocumentTextIcon },
  { path: '/freelancer/orders', name: 'Orders', icon: ShoppingBagIcon },
  { path: '/freelancer/payments', name: 'Payments', icon: CreditCardIcon },
  { path: '/freelancer/reviews', name: 'Reviews', icon: StarIcon },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Navbar */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 shadow-lg"
        >
          {isOpen ? <XMarkIcon className="w-6 h-6 text-white" /> : <Bars3Icon className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed z-40 bg-gray-800 text-white w-64 min-h-screen p-4 transition-transform transform md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:block`}
      >
        <div className="text-2xl font-bold mb-8 text-center">FreelanceHub</div>
        <nav>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              <item.icon className="w-6 h-6" />
              <span>{item.name}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg w-full text-gray-300 hover:bg-gray-700 mt-8"
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={toggleSidebar}></div>}
    </>
  );
}

export default Sidebar;