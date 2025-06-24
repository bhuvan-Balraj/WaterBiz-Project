// src/components/Customers.jsx
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import Sidebar from './Sidebar';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    primary_mobile: '',
    secondary_mobile: '',
    address: '',
    map_location: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name || !form.primary_mobile || !form.address) {
      toast.error('Name, Primary Mobile, and Address are required.');
      return false;
    }
    if (!/^\d{10}$/.test(form.primary_mobile)) {
      toast.error('Primary Mobile must be exactly 10 digits.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const url = isEditing
      ? `http://localhost:5000/api/customers/${editingId}`
      : 'http://localhost:5000/api/customers';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        resetForm();
        fetchCustomers();
        toast.success(`Customer ${isEditing ? 'updated' : 'added'} successfully.`);
      } else {
        const error = await response.json();
        toast.error('Error: ' + (error?.error || 'Operation failed'));
      }
    } catch (err) {
      console.error('Submit failed:', err);
      toast.error('Operation failed. Check console.');
    }
  };

  const handleEdit = (customer) => {
    setForm({
      name: customer.name,
      primary_mobile: customer.primary_mobile,
      secondary_mobile: customer.secondary_mobile || '',
      address: customer.address || '',
      map_location: customer.map_location || '',
    });
    setIsEditing(true);
    setEditingId(customer.customer_id);
  };

  const handleCancelEdit = () => resetForm();

  const resetForm = () => {
    setForm({
      name: '',
      primary_mobile: '',
      secondary_mobile: '',
      address: '',
      map_location: '',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/customers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCustomers();
        toast.success('Customer deleted successfully.');
      } else toast.error('Delete failed');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Delete failed. Check console.');
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.primary_mobile.includes(search) ||
    (c.address && c.address.toLowerCase().includes(search.toLowerCase()))
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredCustomers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    XLSX.writeFile(workbook, 'filtered_customers.xlsx');
  };

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginated = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />

      <main className="flex-1 px-4 py-6">
        <Toaster position="top-center" />
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Customer Management</h1>

        <form onSubmit={handleSubmit} className="card mb-8 border border-blue-100">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">
            {isEditing ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="input" required />
            <input type="text" name="primary_mobile" placeholder="Primary Mobile" value={form.primary_mobile} onChange={handleChange} className="input" required />
            <input type="text" name="secondary_mobile" placeholder="Secondary Mobile" value={form.secondary_mobile} onChange={handleChange} className="input" />
            <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} className="input" required />
            <input type="text" name="map_location" placeholder="Map Location" value={form.map_location} onChange={handleChange} className="input" />
          </div>
          <div className="mt-6 flex gap-4">
            <button type="submit" className="btn-primary">
              {isEditing ? 'Update Customer' : 'Add Customer'}
            </button>
            {isEditing && (
              <button type="button" onClick={handleCancelEdit} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name, mobile, address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full md:w-1/2"
          />
          <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700">
            Export Filtered to Excel
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : filteredCustomers.length === 0 ? (
          <p className="text-center text-gray-600">No matching customers found.</p>
        ) : (
          <div className="overflow-x-auto border rounded-2xl shadow-md">
            <table className="min-w-full border border-gray-200 bg-white">
              <thead className="bg-blue-100">
                <tr>
                  <th className="th">Name</th>
                  <th className="th">Primary Mobile</th>
                  <th className="th">Secondary Mobile</th>
                  <th className="th">Address</th>
                  <th className="th">Map</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((c) => (
                  <tr key={c.customer_id} className="hover:bg-blue-50">
                    <td className="td">{c.name}</td>
                    <td className="td">{c.primary_mobile}</td>
                    <td className="td">{c.secondary_mobile}</td>
                    <td className="td">{c.address}</td>
                    <td className="td">
                      <a href={c.map_location} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Map</a>
                    </td>
                    <td className="td flex gap-2">
                      <button onClick={() => handleEdit(c)} className="text-yellow-600 hover:text-yellow-800 font-semibold">Edit</button>
                      <button onClick={() => handleDelete(c.customer_id)} className="text-red-600 hover:text-red-800 font-semibold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4 px-2">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="pagination-btn">
                Previous
              </button>
              <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="pagination-btn">
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Customers;
