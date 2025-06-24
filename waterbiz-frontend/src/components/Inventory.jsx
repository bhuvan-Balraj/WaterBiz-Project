// src/components/Inventory.jsx
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import Sidebar from './Sidebar';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    product_name: '',
    description: '',
    quantity: '',
    purchase_price: '',
    sale_price: '',
    product_type: '',
    product_make: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 25;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { product_name, quantity, purchase_price, sale_price, product_type, product_make } = form;
    if (!product_name || !quantity || !purchase_price || !sale_price || !product_type || !product_make) {
      toast.error('All fields including Type and Make are required.');
      return false;
    }
    if (isNaN(quantity) || isNaN(purchase_price) || isNaN(sale_price)) {
      toast.error('Quantity and Prices must be numbers.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const url = isEditing
      ? `http://localhost:5000/api/inventory/${editingId}`
      : 'http://localhost:5000/api/inventory';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        resetForm();
        fetchProducts();
        toast.success(`Product ${isEditing ? 'updated' : 'added'} successfully.`);
      } else {
        const error = await response.json();
        toast.error('Error: ' + (error?.error || 'Operation failed'));
      }
    } catch (err) {
      console.error('Submit failed:', err);
      toast.error('Operation failed. Check console.');
    }
  };

  const handleEdit = (product) => {
    setForm({
      product_name: product.product_name,
      description: product.description || '',
      quantity: product.quantity,
      purchase_price: product.purchase_price,
      sale_price: product.sale_price,
      product_type: product.product_type || '',
      product_make: product.product_make || '',
    });
    setIsEditing(true);
    setEditingId(product.product_id);
  };

  const handleCancelEdit = () => resetForm();

  const resetForm = () => {
    setForm({
      product_name: '',
      description: '',
      quantity: '',
      purchase_price: '',
      sale_price: '',
      product_type: '',
      product_make: '',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/inventory/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts();
        toast.success('Product deleted successfully.');
      } else toast.error('Delete failed');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Delete failed. Check console.');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/inventory');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filteredProducts = products.filter(p =>
    p.product_name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredProducts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
    XLSX.writeFile(workbook, 'filtered_inventory.xlsx');
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginated = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />
      <main className="flex-1 px-4 py-6">
        <Toaster position="top-center" />
        <h1 className="text-3xl font-bold mb-6 text-green-800">Inventory Management</h1>

        <form onSubmit={handleSubmit} className="card mb-8 border border-green-100">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="product_name" placeholder="Product Name" value={form.product_name} onChange={handleChange} className="input" required />
            <select name="product_type" value={form.product_type} onChange={handleChange} className="input" required>
              <option value="">Select Product Type</option>
              <option value="Machine">Machine</option>
              <option value="Spare">Spare</option>
              <option value="Others">Others</option>
            </select>
            <select name="product_make" value={form.product_make} onChange={handleChange} className="input" required>
              <option value="">Select Product Make</option>
              <option value="Kent">Kent</option>
              <option value="Aqua Squard">Aqua Squard</option>
              <option value="Aquafina">Aquafina</option>
            </select>
            <input type="text" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} className="input" required />
            <input type="text" name="purchase_price" placeholder="Purchase Price" value={form.purchase_price} onChange={handleChange} className="input" required />
            <input type="text" name="sale_price" placeholder="Sale Price" value={form.sale_price} onChange={handleChange} className="input" required />
            <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} className="input" />
          </div>
          <div className="mt-6 flex gap-4">
            <button type="submit" className="btn-primary">
              {isEditing ? 'Update Product' : 'Add Product'}
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
            placeholder="Search by name or description"
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
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-600">No matching products found.</p>
        ) : (
          <div className="overflow-x-auto border rounded-2xl shadow-md">
            <table className="min-w-full border border-gray-200 bg-white">
              <thead className="bg-green-100">
                <tr>
                  <th className="th">Name</th>
                  <th className="th">Type</th>
                  <th className="th">Make</th>
                  <th className="th">Quantity</th>
                  <th className="th">Purchase Price</th>
                  <th className="th">Sale Price</th>
                  <th className="th">Description</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((product) => (
                  <tr key={product.product_id} className="hover:bg-green-50">
                    <td className="td">{product.product_name}</td>
                    <td className="td">{product.product_type}</td>
                    <td className="td">{product.product_make}</td>
                    <td className="td">{product.quantity}</td>
                    <td className="td">{product.purchase_price}</td>
                    <td className="td">{product.sale_price}</td>
                    <td className="td">{product.description}</td>
                    <td className="td flex gap-2">
                      <button onClick={() => handleEdit(product)} className="text-yellow-600 hover:text-yellow-800 font-semibold">Edit</button>
                      <button onClick={() => handleDelete(product.product_id)} className="text-red-600 hover:text-red-800 font-semibold">Delete</button>
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

export default Inventory;
