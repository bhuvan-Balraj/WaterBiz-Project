import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import Sidebar from './Sidebar';

const CustomerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/customer-products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching customer products:', err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const markAsServiced = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/customer-products/mark-serviced/${id}`, {
        method: 'POST'
      });
      if (res.ok) {
        toast.success('Marked as serviced');
        fetchProducts();
      } else {
        toast.error('Failed to mark as serviced');
      }
    } catch (err) {
      toast.error('Failed to mark as serviced');
      console.error(err);
    }
  };

  const exportToExcel = () => {
    const filtered = products.filter(p =>
      p.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.serial_number?.toLowerCase().includes(search.toLowerCase())
    );
    const worksheet = XLSX.utils.json_to_sheet(filtered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CustomerProducts');
    XLSX.writeFile(workbook, 'customer_products.xlsx');
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter(p =>
    p.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.product_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.serial_number?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />
      <main className="flex-1 p-6">
        <Toaster position="top-center" />
        <h1 className="text-3xl font-bold mb-6 text-indigo-800">Customer Owned Products</h1>

        <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by customer, product, serial"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full md:w-1/2"
          />
          <button onClick={exportToExcel} className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700">
            Export to Excel
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-600">No customer-owned products found.</p>
        ) : (
          <div className="overflow-x-auto border rounded-2xl shadow-md">
            <table className="min-w-full border border-gray-200 bg-white">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="th">Customer</th>
                  <th className="th">Product</th>
                  <th className="th">Serial No.</th>
                  <th className="th">Installed</th>
                  <th className="th">Last Serviced</th>
                  <th className="th">Next Service</th>
                  <th className="th">Remarks</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr key={p.ownership_id} className="hover:bg-indigo-50">
                    <td className="td">{p.customer_name}</td>
                    <td className="td">{p.product_name}</td>
                    <td className="td">{p.serial_number}</td>
                    <td className="td">{p.installation_date}</td>
                    <td className="td">{p.last_service_date}</td>
                    <td className="td">{p.next_service_date}</td>
                    <td className="td">{p.remarks}</td>
                    <td className="td">
                      <button
                        onClick={() => markAsServiced(p.ownership_id)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Mark Serviced
                      </button>
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

export default CustomerProducts;
