import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Edit, Trash2, Search, Filter } from 'lucide-react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const { showToast } = useToast();
  
  const fetchPolicies = async () => {
    console.log()
    try {
      setLoading(true);
      const response = await axios.get('/api/policies');
      setPolicies(response.data);
    } catch (error) {
      console.error('Error fetching policies:', error);
      showToast('Failed to load policies', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPolicies();
  }, []);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleViewPolicy = (policy) => {
    setSelectedPolicy(policy);
    setIsViewModalOpen(true);
  };
  
  const handleDeletePolicy = (policy) => {
    setSelectedPolicy(policy);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDeletePolicy = async () => {
    try {
      await axios.delete(`/api/policies/${selectedPolicy._id}`);
      setPolicies(policies.filter(p => p._id !== selectedPolicy._id));
      showToast('Policy deleted successfully', 'success');
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting policy:', error);
      showToast('Failed to delete policy', 'error');
    }
  };
  
  const filteredPolicies = policies.filter(policy => {
    // Filter by tab
    if (activeTab === 'active' && policy.status !== 'Active') return false;
    if (activeTab === 'expiring' && policy.status !== 'Expiring Soon') return false;
    if (activeTab === 'expired' && policy.status !== 'Expired') return false;
    
    // Filter by search term
    const searchFields = [
      policy.policyId,
      policy.customerName,
      policy.vehicleNumber
    ];
    
    return searchTerm === '' || searchFields.some(field => 
      field && field.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  return (
    <Layout 
      title="Manage Policies" 
      subtitle="View and manage all your RSA policies"
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-white shadow-sm font-medium' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('all')}
          >
            All Policies
          </button>
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'active' ? 'bg-white shadow-sm font-medium' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'expiring' ? 'bg-white shadow-sm font-medium' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('expiring')}
          >
            Expiring Soon
          </button>
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'expired' ? 'bg-white shadow-sm font-medium' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('expired')}
          >
            Expired
          </button>
        </div>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search policies..."
            className="pl-10 input-field"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left data-table">
            <thead className="bg-gray-50 text-gray-600 uppercase">
              <tr>
                <th className="px-6 py-3">Policy ID</th>
                <th className="px-6 py-3">Customer Name</th>
                <th className="px-6 py-3">Vehicle Number</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Start Date</th>
                <th className="px-6 py-3">Expiry Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8\" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredPolicies.length > 0 ? (
                filteredPolicies.map((policy) => (
                  <tr key={policy._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{policy.policyId}</td>
                    <td className="px-6 py-4">{policy.customerName}</td>
                    <td className="px-6 py-4">{policy.vehicleNumber}</td>
                    <td className="px-6 py-4">{policy.duration}</td>
                    <td className="px-6 py-4">{new Date(policy.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{new Date(policy.expiryDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`status-badge ${
                        policy.status === 'Active' ? 'status-active' : 
                        policy.status === 'Expired' ? 'status-expired' : 'status-expiring'
                      }`}>
                        {policy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewPolicy(policy)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-800"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePolicy(policy)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No policies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* View Policy Modal */}
      {selectedPolicy && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Policy Details"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Policy ID</p>
              <p className="font-medium">{selectedPolicy.policyId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`status-badge ${
                selectedPolicy.status === 'Active' ? 'status-active' : 
                selectedPolicy.status === 'Expired' ? 'status-expired' : 'status-expiring'
              }`}>
                {selectedPolicy.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer Name</p>
              <p className="font-medium">{selectedPolicy.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <p className="font-medium">{selectedPolicy.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{selectedPolicy.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vehicle Number</p>
              <p className="font-medium">{selectedPolicy.vehicleNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium">{new Date(selectedPolicy.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expiry Date</p>
              <p className="font-medium">{new Date(selectedPolicy.expiryDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">{selectedPolicy.duration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount Paid</p>
              <p className="font-medium">₹{selectedPolicy.amount}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Address</p>
            <p className="font-medium">{selectedPolicy.address}, {selectedPolicy.city}</p>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="btn btn-secondary"
            >
              Close
            </button>
            <button className="btn btn-primary">
              Edit Policy
            </button>
          </div>
        </Modal>
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        width="max-w-md"
      >
        <div className="mb-6">
          <p className="text-gray-700">
            Are you sure you want to delete policy <span className="font-semibold">{selectedPolicy?.policyId}</span>?
          </p>
          <p className="text-gray-500 text-sm mt-2">
            This action cannot be undone.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeletePolicy}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      </Modal>
    </Layout>
  );
};

export default Policies;