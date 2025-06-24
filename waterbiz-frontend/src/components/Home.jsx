import React from 'react';
import Sidebar from './Sidebar';

const Home = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />
      <main className="flex-1 px-6 py-10">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Bizz Buddy </h1>
        <p className="text-lg text-gray-700">
          Use the sidebar to navigate between the <strong>Customer</strong> and <strong>Inventory</strong> modules.
        </p>
        <div className="mt-10">
          <ul className="list-disc pl-5 text-gray-700">
            <li>💧 Add and manage customers with precise location details.</li>
            <li>📦 Track and update product inventory with pricing.</li>
            <li>📤 Export filtered data to Excel in one click.</li>
            <li>📱 Fully responsive and mobile-friendly layout.</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Home;
