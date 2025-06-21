import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Search, Filter, Plus } from 'lucide-react';
import axios from 'axios';
import Layout from '../components/Layout';
import Modal from '../components/Modal';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.get(`${backendUrl}/api/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsViewModalOpen(true);
  };

  return (
    <Layout title="Manage Customers">
      <div className="mb-6 flex justify-between items-center">
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add New Customer
        </button>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">All Customers</h3>
          <button className="btn btn-secondary flex items-center gap-2">
            <Filter size={16} />
            Apply Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Policies</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4">{customer.id}</td>
                    <td className="px-6 py-4">{customer.customerName}</td>
                    <td className="px-6 py-4">{customer.email}</td>
                    <td className="px-6 py-4">{customer.phoneNumber}</td>
                    <td className="px-6 py-4">{customer.vehicleNumber}</td>
                    <td className="px-6 py-4">-</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleViewCustomer(customer)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye size={18} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <Edit size={18} />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-500">Showing 1-7 of 98 customers</span>
          <div className="flex gap-2">
            <button className="btn btn-secondary" disabled>Previous</button>
            <button className="btn btn-secondary">Next</button>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Customer Details"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Customer ID</p>
                <p className="font-medium">{selectedCustomer.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{selectedCustomer.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedCustomer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{selectedCustomer.phoneNumber}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">
                {selectedCustomer.address}, {selectedCustomer.city}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Vehicles</h3>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left border">Vehicle Number</th>
                    <th className="px-4 py-2 text-left border">Make & Model</th>
                    <th className="px-4 py-2 text-left border">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCustomer.vehicles.map((vehicle, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border">{vehicle.vehicleNumber}</td>
                      <td className="px-4 py-2 border">{vehicle.makeModel}</td>
                      <td className="px-4 py-2 border">{vehicle.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Policies</h3>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left border">Policy ID</th>
                    <th className="px-4 py-2 text-left border">Vehicle</th>
                    <th className="px-4 py-2 text-left border">Start Date</th>
                    <th className="px-4 py-2 text-left border">Expiry Date</th>
                    <th className="px-4 py-2 text-left border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCustomer.policyDetails.map((policy, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border">{policy.policyId}</td>
                      <td className="px-4 py-2 border">{policy.vehicle}</td>
                      <td className="px-4 py-2 border">{policy.startDate}</td>
                      <td className="px-4 py-2 border">{policy.expiryDate}</td>
                      <td className="px-4 py-2 border">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {policy.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button className="btn btn-primary">
                Edit Customer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Customers;