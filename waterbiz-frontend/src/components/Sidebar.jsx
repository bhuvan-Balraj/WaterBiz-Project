import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`bg-blue-900 text-white transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-16'} min-h-screen`}>
      <button
        className="p-4 focus:outline-none"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg
          className="w-6 h-6 mx-auto text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <nav className="mt-4 space-y-2 flex-1">
        <Link to="/" className="block px-4 py-2 hover:bg-blue-700 rounded">
          🏠 {sidebarOpen && 'Home'}
        </Link>
        <Link to="/customers" className="block px-4 py-2 hover:bg-blue-700 rounded">
          👤 {sidebarOpen && 'Customers'}
        </Link>
        <Link to="/inventory" className="block px-4 py-2 hover:bg-blue-700 rounded">
          📦 {sidebarOpen && 'Inventory'}
        </Link>
        <Link to="/employees" className="block px-4 py-2 hover:bg-blue-700 rounded">
          🧑‍💼 {sidebarOpen && 'Employees'}
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
