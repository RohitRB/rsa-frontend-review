import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Pencil, Trash2, Eye, Search, Download } from 'lucide-react';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import PolicyModal from "../../components/PolicyModal";
import { format, isBefore, subDays, parseISO, addDays, isAfter } from 'date-fns';
import axios from 'axios'; // Import axios
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { generatePolicyPDF } from '../../utils/pdfUtils';

const AdminPolicies = () => {
  // Replace context with local state and direct API calls
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [expiryFilterDays, setExpiryFilterDays] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const itemsPerPage = 5;
  const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:5000';

  // Fetch policies from backend
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/policies`);
        
        // Ensure date fields are Date objects
        const toDate = (val) => {
          if (!val) return new Date();
          if (typeof val === 'string') return parseISO(val);
          if (typeof val === 'object' && val._seconds) return new Date(val._seconds * 1000);
          return new Date(val);
        };
        const formattedPolicies = response.data.map(p => ({
          ...p,
          createdAt: toDate(p.createdAt),
          startDate: toDate(p.startDate),
          expiryDate: toDate(p.expiryDate),
        }));
        console.log('Policies:', formattedPolicies);
        setPolicies(formattedPolicies);
      } catch (error) {
        console.error("Error fetching policies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  const refreshPolicies = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/policies`);
      
      const toDate = (val) => {
        if (!val) return new Date();
        if (typeof val === 'string') return parseISO(val);
        if (typeof val === 'object' && val._seconds) return new Date(val._seconds * 1000);
        return new Date(val);
      };
      const formattedPolicies = response.data.map(p => ({
        ...p,
        createdAt: toDate(p.createdAt),
        startDate: toDate(p.startDate),
        expiryDate: toDate(p.expiryDate),
      }));
      setPolicies(formattedPolicies);
    } catch (error) {
      console.error("Error refreshing policies:", error);
    }
  };

  // Filter and search policies
  const filteredPolicies = policies.filter(policy => {
    // Search filter
    const searchMatch = !searchTerm || 
      policy.policyNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    // View mode filter
    let viewMatch = true;
    if (viewMode === 'active') {
      viewMatch = policy.status === 'Active';
    } else if (viewMode === 'expired') {
      viewMatch = policy.status === 'Expired';
    } else if (viewMode === 'expiring soon') {
      viewMatch = policy.status === 'Expiring Soon';
    }

    // Expiry filter
    let expiryMatch = true;
    if (expiryFilterDays) {
      const days = parseInt(expiryFilterDays);
      const today = new Date();
      const expiryDate = policy.expiryDate instanceof Date ? policy.expiryDate : new Date(policy.expiryDate);
      const diffInDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      expiryMatch = diffInDays <= days && diffInDays >= 0;
    }

    return searchMatch && viewMatch && expiryMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPolicies = filteredPolicies.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleFilterChange = (mode) => {
    setViewMode(mode);
    setExpiryFilterDays(''); // Clear expiry filter when changing main view mode
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleExpiryFilterChange = (e) => {
    const days = e.target.value;
    setExpiryFilterDays(days);
    setViewMode('all'); // Reset main view to 'all' when applying this filter
    setCurrentPage(1);
  };

  const handleDeletePolicy = (policyId) => {
    console.log('Policy to delete:', policyId);
    setSelectedPolicyId(policyId);
    setDeleteModalOpen(true);
  };

  const confirmDeletePolicy = async () => {
    if (selectedPolicyId) {
      try {
        setDeleteLoading(true);
        console.log('Deleting policy with ID:', selectedPolicyId);
        
        // Use the new backend API endpoint
        const response = await axios.delete(`${backendUrl}/api/policies/${selectedPolicyId}`);
        
        if (response.status === 200) {
          console.log('Policy deleted successfully:', response.data);
          await refreshPolicies();
          alert('Policy deleted successfully!');
        }
      } catch (error) {
        console.error("Error deleting policy:", error);
        if (error.response?.status === 404) {
          alert('Policy not found. It may have already been deleted.');
        } else {
          alert('Failed to delete policy. Please try again.');
        }
      } finally {
        setDeleteLoading(false);
        setDeleteModalOpen(false);
        setSelectedPolicyId(null);
      }
    }
  };

  // Generate page numbers for pagination
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
            <h1 className="text-2xl font-bold text-gray-800">Manage Policies</h1>
            <p className="text-gray-600">View and manage all your RSA policies</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search policies..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6">
              <button
                onClick={() => handleFilterChange('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  viewMode === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Policies
              </button>
              <button
                onClick={() => handleFilterChange('active')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  viewMode === 'active'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => handleFilterChange('expiring soon')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  viewMode === 'expiring soon'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Expiring Soon
              </button>
              <select
                value={expiryFilterDays}
                onChange={handleExpiryFilterChange}
                className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white"
              >
                <option value="">Expiry Filter</option>
                <option value="15">Expiring in 15 days</option>
                <option value="30">Expiring in 30 days</option>
                <option value="180">Expiring in 6 months</option>
                <option value="365">Expiring in 1 year</option>
              </select>
              <button
                onClick={() => handleFilterChange('expired')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  viewMode === 'expired'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Expired
              </button>
            </nav>
          </div>
        </div>

        {/* Policies Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Policy ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Ensure policies are loaded before mapping */}
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      Loading policies...
                    </td>
                  </tr>
                ) : paginatedPolicies.length > 0 ? (
                  paginatedPolicies.map((policy) => (
                    <tr key={policy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {policy.policyNumber || policy.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {policy.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {policy.vehicleNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {policy.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* Format startDate which is now a Date object */}
                        {policy.startDate ? format(policy.startDate, 'dd/MM/yyyy') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* Format expiryDate which is now a Date object */}
                        {policy.expiryDate ? format(policy.expiryDate, 'dd/MM/yyyy') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${policy.status === 'Active' ? 'bg-green-100 text-green-800' :
                            policy.status === 'Expiring Soon' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'}`}>
                          {policy.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedPolicy(policy);
                              setModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Policy"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => generatePolicyPDF(policy)}
                            className="text-green-600 hover:text-green-900"
                            title="Download Policy"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={() => {
                              console.log('Policy object:', policy);
                              // Use the unique policyNumber for deletion since id is the same for all policies
                              const policyId = policy.policyNumber || policy._id || policy.id;
                              console.log('Using ID for delete:', policyId);
                              handleDeletePolicy(policyId);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Policy"
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
                      No policies found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredPolicies.length > itemsPerPage && (
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredPolicies.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredPolicies.length}</span> results
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
      </main>
      <div>
        {modalOpen && selectedPolicy && (
          <PolicyModal
            policy={selectedPolicy}
            onClose={() => {
              setModalOpen(false);
              setSelectedPolicy(null);
            }}
          />
        )}
      </div>
      <div>
        {deleteModalOpen && (
          <DeleteConfirmationModal
            message="Are you sure you want to delete this policy? This action cannot be undone."
            onCancel={() => setDeleteModalOpen(false)}
            onConfirm={confirmDeletePolicy}
            loading={deleteLoading}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPolicies;
