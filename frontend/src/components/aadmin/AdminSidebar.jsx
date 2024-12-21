import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  StarIcon,
  XMarkIcon,
  PowerIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', icon: HomeIcon, path: '/admin/dashboard' },
  { name: 'Profile', icon: UserIcon, path: '/admin/profile' },
  { name: 'Freelancers', icon: BriefcaseIcon, path: '/admin/freelancers' },
  { name: 'Clients', icon: StarIcon, path: '/admin/clients' },
  { name: 'Projects', icon: BriefcaseIcon, path: '/admin/projects' },
  { name: 'Bids', icon: ChartBarIcon, path: '/admin/bids' },
  { name: 'Orders', icon: ShoppingCartIcon, path: '/admin/orders' },
  { name: 'Payments', icon: CurrencyDollarIcon, path: '/admin/payments' },
  { name: 'Reviews', icon: StarIcon, path: '/admin/reviews' },
  { name: 'Settings', icon: ChartBarIcon, path: '/admin/settings' },
  { name: 'Logout', icon: PowerIcon, path: '/login' },
];

function AdminSidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Overlay for mobile view */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Sidebar Heading */}
        <div className="flex items-center justify-between px-4 h-16 bg-indigo-600 text-white">
          <h2 className="text-lg font-bold">Admin Dashboard</h2>
          <button
            className="lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Items */}
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
              <button
                key={item.name}
                onClick={handleLogout}
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 w-full text-left"
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default AdminSidebar;