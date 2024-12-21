import { useState } from "react";
import { Outlet } from "react-router-dom"; // Add this import
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div
        className={`flex-grow bg-gray-100 min-h-screen transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0 lg:ml-64"
        }`}
      >
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 md:p-8">
          <Outlet /> {/* This renders the child routes */}
        </main>
      </div>
    </div>
  );
}

export default Layout;