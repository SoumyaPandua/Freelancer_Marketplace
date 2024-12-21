import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';

function Navbar({ onMenuClick }) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="px-4 h-16 flex items-center justify-between">
        <button
          className="lg:hidden text-gray-600 hover:text-gray-900"
          onClick={onMenuClick}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-900">
            <BellIcon className="h-6 w-6" />
          </button>
          <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
            <span className="text-sm font-medium">JD</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;