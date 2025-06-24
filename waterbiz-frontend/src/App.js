import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import Customers from './components/Customers';
import Inventory from './components/Inventory';
import Employee from './components/Employee';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/employees" element={<Employee />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
