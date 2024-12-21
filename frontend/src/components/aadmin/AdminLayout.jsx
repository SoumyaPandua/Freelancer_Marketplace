import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div
        className={`flex-grow bg-gray-50 min-h-screen transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0 lg:ml-64"
        }`}
      >
        {/* Navbar */}
        <AdminNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />

        {/* Main Content Area */}
        <main className="p-4 md:p-8">
          <Outlet /> {/* Renders child routes */}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;