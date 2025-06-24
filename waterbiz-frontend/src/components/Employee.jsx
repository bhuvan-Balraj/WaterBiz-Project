import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    address: '',
    id_proof_type: '',
    id_proof_number: '',
    branch_name: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const idProofOptions = ['Aadhaar', 'PAN', 'Driving License', 'Voter ID'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name || !form.mobile || !form.address || !form.id_proof_type || !form.id_proof_number) {
      toast.error('All fields except branch name are required.');
      return false;
    }
    if (!/^\d{10}$/.test(form.mobile)) {
      toast.error('Mobile number must be 10 digits.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const url = isEditing
      ? `http://localhost:5000/api/employees/${editingId}`
      : 'http://localhost:5000/api/employees';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        resetForm();
        fetchEmployees();
        toast.success(`Employee ${isEditing ? 'updated' : 'added'} successfully.`);
      } else {
        const error = await response.json();
        toast.error('Error: ' + (error?.error || 'Operation failed'));
      }
    } catch (err) {
      console.error('Submit failed:', err);
      toast.error('Operation failed. Check console.');
    }
  };

  const handleEdit = (employee) => {
    setForm({
      name: employee.name,
      mobile: employee.mobile,
      address: employee.address,
      id_proof_type: employee.id_proof_type,
      id_proof_number: employee.id_proof_number,
      branch_name: employee.branch_name,
    });
    setIsEditing(true);
    setEditingId(employee.employee_id);
  };

  const handleCancelEdit = () => resetForm();

  const resetForm = () => {
    setForm({
      name: '',
      mobile: '',
      address: '',
      id_proof_type: '',
      id_proof_number: '',
      branch_name: '',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEmployees();
        toast.success('Employee deleted successfully.');
      } else toast.error('Delete failed');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Delete failed. Check console.');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/employees');
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.mobile.includes(search) ||
    (e.address && e.address.toLowerCase().includes(search.toLowerCase())) ||
    (e.branch_name && e.branch_name.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginated = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Toaster position="top-center" />
        <h1 className="heading-xl">Employee Management</h1>

        <form onSubmit={handleSubmit} className="card mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">
            {isEditing ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="input" required />
            <input type="text" name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} className="input" required />
            <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} className="input" required />
            <select name="id_proof_type" value={form.id_proof_type} onChange={handleChange} className="input" required>
              <option value="">Select ID Proof</option>
              {idProofOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <input type="text" name="id_proof_number" placeholder="ID Proof Number" value={form.id_proof_number} onChange={handleChange} className="input" required />
            <input type="text" name="branch_name" placeholder="Branch Name" value={form.branch_name} onChange={handleChange} className="input" />
          </div>
          <div className="mt-6 flex gap-4">
            <button type="submit" className="btn-primary">
              {isEditing ? 'Update Employee' : 'Add Employee'}
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
            placeholder="Search by name, mobile, address, branch"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full md:w-1/2"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : filteredEmployees.length === 0 ? (
          <p className="text-center text-gray-600">No matching employees found.</p>
        ) : (
          <div className="overflow-x-auto border rounded-2xl shadow-md">
            <table className="min-w-full border border-gray-200 bg-white">
              <thead className="bg-purple-100">
                <tr>
                  <th className="th">Name</th>
                  <th className="th">Mobile</th>
                  <th className="th">Address</th>
                  <th className="th">ID Proof Type</th>
                  <th className="th">ID Proof Number</th>
                  <th className="th">Branch</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((e) => (
                  <tr key={e.employee_id} className="hover:bg-purple-50">
                    <td className="td">{e.name}</td>
                    <td className="td">{e.mobile}</td>
                    <td className="td">{e.address}</td>
                    <td className="td">{e.id_proof_type}</td>
                    <td className="td">{e.id_proof_number}</td>
                    <td className="td">{e.branch_name}</td>
                    <td className="td flex gap-2">
                      <button onClick={() => handleEdit(e)} className="text-yellow-600 hover:text-yellow-800 font-semibold">Edit</button>
                      <button onClick={() => handleDelete(e.employee_id)} className="text-red-600 hover:text-red-800 font-semibold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4 px-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employee;
