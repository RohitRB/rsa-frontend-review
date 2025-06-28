import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Pencil, Trash2, Eye, Search } from 'lucide-react';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import axios from 'axios';

const AdminCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDeleteId, setCustomerToDeleteId] = useState(null);
  const [editCustomerModalOpen, setEditCustomerModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const itemsPerPage = 5;

  const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/customers`);
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const refreshCustomers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error refreshing customers:", error);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const customerName = customer.customerName?.toLowerCase() || '';
    const email = customer.email?.toLowerCase() || '';
    const phoneNumber = customer.phoneNumber?.toLowerCase() || '';
    const vehicleNumber = customer.vehicleNumber?.toLowerCase() || '';

    return (
      customerName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      phoneNumber.includes(searchTerm.toLowerCase()) ||
      vehicleNumber.includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteClick = (customerId) => {
    setCustomerToDeleteId(customerId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteCustomer = async () => {
    if (customerToDeleteId) {
      try {
        setDeleteLoading(true);
        await axios.delete(`${backendUrl}/api/customers/${customerToDeleteId}`);
        await refreshCustomers();
        alert('Customer deleted successfully!');
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert('Failed to delete customer. Please try again.');
      } finally {
        setDeleteLoading(false);
        setDeleteModalOpen(false);
        setCustomerToDeleteId(null);
      }
    }
  };

  const handleEditClick = (customer) => {
    setCustomerToEdit({ ...customer });
    setEditCustomerModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCustomerToEdit(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateCustomer = async () => {
    if (customerToEdit && customerToEdit.id) {
      try {
        setUpdateLoading(true);
        const { id, ...updatedFields } = customerToEdit;
        await axios.put(`${backendUrl}/api/customers/${id}`, updatedFields);
        await refreshCustomers();
        alert('Customer updated successfully!');
        setEditCustomerModalOpen(false);
        setCustomerToEdit(null);
      } catch (error) {
        console.error("Error updating customer:", error);
        alert('Failed to update customer. Please try again.');
      } finally {
        setUpdateLoading(false);
      }
    }
  };

  const handleViewClick = (customer) => {
    setSelectedCustomer(customer);
    setViewModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB'); // dd/mm/yyyy format
    } catch (error) {
      return 'N/A';
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Customers</h1>
            <p className="text-gray-600">View and manage all your RSA customers</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Loading customers...
                    </td>
                  </tr>
                ) : paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((customer, index) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + startIndex + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.phoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.vehicleNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewClick(customer)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Customer"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditClick(customer)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit Customer"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(customer.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Customer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length > itemsPerPage && (
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredCustomers.length)}</span> of <span className="font-medium">{filteredCustomers.length}</span> results
                </p>
              </div>
              <div className="flex-1 flex justify-end">
                <nav className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>

                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === page
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>

        {viewModalOpen && selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
              <div className="space-y-3">
                <p><strong>Name:</strong> {selectedCustomer.customerName}</p>
                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                <p><strong>Phone:</strong> {selectedCustomer.phoneNumber}</p>
                <p><strong>Address:</strong> {selectedCustomer.address}, {selectedCustomer.city}</p>
                <p><strong>Vehicle:</strong> {selectedCustomer.vehicleNumber}</p>
                <p><strong>Member Since:</strong> {formatDate(selectedCustomer.createdAt)}</p>
              </div>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                onClick={() => setViewModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {editCustomerModalOpen && customerToEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">Edit Customer</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={customerToEdit.customerName || ''}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={customerToEdit.email || ''}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={customerToEdit.phoneNumber || ''}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={customerToEdit.address || ''}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={customerToEdit.city || ''}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={customerToEdit.vehicleNumber || ''}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleUpdateCustomer}
                  disabled={updateLoading}
                >
                  {updateLoading ? 'Updating...' : 'Update'}
                </button>
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  onClick={() => setEditCustomerModalOpen(false)}
                  disabled={updateLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteModalOpen && (
          <DeleteConfirmationModal
            message="Are you sure you want to delete this customer?"
            onConfirm={confirmDeleteCustomer}
            onCancel={() => setDeleteModalOpen(false)}
            loading={deleteLoading}
          />
        )}
      </main>
    </div>
  );
};

export default AdminCustomer;
