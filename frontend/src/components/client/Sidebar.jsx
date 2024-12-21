import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  StarIcon,
  XMarkIcon,
  PowerIcon, // Import the logout icon (if available)
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', icon: HomeIcon, path: '/client/dashboard' },
  { name: 'Profile', icon: UserIcon, path: '/client/profile' },
  { name: 'Projects', icon: BriefcaseIcon, path: '/client/projects' },
  { name: 'Bids', icon: CurrencyDollarIcon, path: '/client/bids' },
  { name: 'Orders', icon: ShoppingCartIcon, path: '/client/orders' },
  { name: 'Payments', icon: CurrencyDollarIcon, path: '/client/payments' },
  { name: 'Reviews', icon: StarIcon, path: '/client/reviews' },
  { name: 'Logout', icon: PowerIcon, path: '/login' },
];

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    sessionStorage.clear();
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-indigo-600 text-white">
          <h1 className="text-xl font-bold">Client Dashboard</h1>
          <button
            className="lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return item.name !== 'Logout' ? (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 ${
                  isActive ? 'bg-indigo-50 text-indigo-600' : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ) : (
              // Render Logout option with a button click handler
              <button
                key={item.name}
                onClick={handleLogout}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;