import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function FreelancerLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default FreelancerLayout;