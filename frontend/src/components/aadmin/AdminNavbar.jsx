import { Bars3Icon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

function AdminNavbar({ onMenuClick, isSidebarOpen }) {
  return (
    <nav
      className={`bg-white border-b border-gray-200 fixed z-30 top-0 h-16 transition-all duration-300 ${
        isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
      } w-full`}
    >
      <div className="px-4 flex items-center justify-between h-full">
        {/* Menu Button for Mobile */}
        <button
          className="lg:hidden text-gray-600 hover:text-gray-900"
          onClick={onMenuClick}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <BellIcon className="h-6 w-6 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Avatar */}
          <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
            <span className="text-sm font-medium">AU</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;