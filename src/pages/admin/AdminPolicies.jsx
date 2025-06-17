import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { usePolicy } from '../../context/PolicyContext';
import { Pencil, Trash2, Eye, Search } from 'lucide-react';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal'; // Assuming this component exists
import PolicyModal from "../../components/PolicyModal"; // Assuming this component exists
import { format, isBefore, subDays } from 'date-fns'; // Import date-fns for date comparisons and formatting

const AdminPolicies = () => {
  // policies, deletePolicy, isAuthReady are now from PolicyContext (which fetches from Firestore)
  const { policies, deletePolicy, isAuthReady } = usePolicy();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all', 'active', 'expiring', 'expired'
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPolicyFirestoreId, setSelectedPolicyFirestoreId] = useState(null); // Use Firestore ID for deletion
  const [expiryFilterDays, setExpiryFilterDays] = useState(''); // Number of days for expiry filter

  const itemsPerPage = 5;

  // Filter and search policies
  const filteredPolicies = policies.filter(policy => {
    // Ensure policy.customerName, policy.vehicleNumber, policy.policyNumber are strings
    const customerName = policy.customerName?.toLowerCase() || '';
    const vehicleNumber = policy.vehicleNumber?.toLowerCase() || '';
    const policyNumber = policy.policyNumber?.toLowerCase() || '';
    const id = policy.id?.toLowerCase() || '';


    const matchesSearch =
      customerName.includes(searchTerm.toLowerCase()) ||
      vehicleNumber.includes(searchTerm.toLowerCase()) ||
      policyNumber.includes(searchTerm.toLowerCase()) ||
      id.includes(searchTerm.toLowerCase());

    const today = new Date();
    const policyExpiryDate = policy.expiryDate instanceof Date ? policy.expiryDate : new Date(policy.expiryDate);

    let matchesFilter = true;
    if (viewMode === 'active') {
      matchesFilter = policy.status === 'Active' && isBefore(today, policyExpiryDate);
    } else if (viewMode === 'expiring soon') {
      // Policies expiring in the next 30 days
      const thirtyDaysFromNow = addDays(today, 30);
      matchesFilter = isBefore(policyExpiryDate, thirtyDaysFromNow) && isBefore(today, policyExpiryDate);
    } else if (viewMode === 'expired') {
      matchesFilter = isBefore(policyExpiryDate, today);
    }

    // Apply numerical expiry filter if set
    if (expiryFilterDays) {
      const filterDate = addDays(today, parseInt(expiryFilterDays));
      matchesFilter = matchesFilter && isBefore(policyExpiryDate, filterDate) && isBefore(today, policyExpiryDate);
    }


    return matchesSearch && matchesFilter;
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

  const handleDeletePolicy = (firestoreId) => {
    setSelectedPolicyFirestoreId(firestoreId);
    setDeleteModalOpen(true);
  };

  const confirmDeletePolicy = () => {
    // deletePolicy from PolicyContext takes the Firestore ID
    if (selectedPolicyFirestoreId) {
      deletePolicy(selectedPolicyFirestoreId);
    }
    setDeleteModalOpen(false);
    setSelectedPolicyFirestoreId(null);
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
                {isAuthReady && paginatedPolicies.length > 0 ? (
                  paginatedPolicies.map((policy) => (
                    <tr key={policy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {policy.policyNumber || policy.id} {/* Use policyNumber if available */}
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
                          {/* Edit button functionality will be added later */}
                          {/* <button
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit Policy"
                          >
                            <Pencil size={18} />
                          </button> */}
                          <button
                            onClick={() => handleDeletePolicy(policy.firestorePolicyId || policy.id)} // Use firestorePolicyId for deletion
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
                      {isAuthReady ? "No policies found matching your criteria." : "Loading policies..."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {isAuthReady && filteredPolicies.length > itemsPerPage && (
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
              <div>
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
     // Pass the firestore ID for deletion
     policyId={selectedPolicyFirestoreId}
     onCancel={() => setDeleteModalOpen(false)}
     onConfirm={confirmDeletePolicy} // This calls the PolicyContext delete
   />
       )}
     </div>
    </div>
  );
};

export default AdminPolicies;
