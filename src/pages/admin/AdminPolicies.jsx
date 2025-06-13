// import React, { useState } from 'react';
// import Header from '../../components/Header';
// import { usePolicy } from '../../context/PolicyContext';
// import { Pencil, Trash2, Eye, Search } from 'lucide-react';

// const AdminPolicies = () => {
//   const { policies, deletePolicy } = usePolicy();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [viewMode, setViewMode] = useState('all'); // 'all', 'active', 'expiring', 'expired'
//   const [currentPage, setCurrentPage] = useState(1);
  
//   const itemsPerPage = 5;
  
//   // Filter and search policies
//   const filteredPolicies = policies.filter(policy => {
//     const matchesSearch = 
//       policy.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       policy.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       policy.id.toLowerCase().includes(searchTerm.toLowerCase());
      
//     if (viewMode === 'all') return matchesSearch;
//     return matchesSearch && policy.status.toLowerCase() === viewMode.toLowerCase();
//   });
  
//   // Pagination
//   const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedPolicies = filteredPolicies.slice(startIndex, startIndex + itemsPerPage);
  
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };
  
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1); // Reset to first page on search
//   };
  
//   const handleFilterChange = (mode) => {
//     setViewMode(mode);
//     setCurrentPage(1); // Reset to first page on filter change
//   };
  
//   const handleDeletePolicy = (id) => {
//     if (confirm('Are you sure you want to delete this policy?')) {
//       deletePolicy(id);
//     }
//   };
  
//   // Generate page numbers for pagination
//   const pageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }
  
//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <Header />
      
//       <main className="flex-1 container mx-auto px-4 py-8">
//         <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Manage Policies</h1>
//             <p className="text-gray-600">View and manage all your RSA policies</p>
//           </div>
          
//           <div className="flex items-center space-x-2">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search policies..."
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>
//         </div>
        
//         {/* Filter tabs */}
//         <div className="mb-6">
//           <div className="border-b border-gray-200">
//             <nav className="-mb-px flex space-x-6">
//               <button
//                 onClick={() => handleFilterChange('all')}
//                 className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                   viewMode === 'all'
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 All Policies
//               </button>
//               <button
//                 onClick={() => handleFilterChange('active')}
//                 className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                   viewMode === 'active'
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Active
//               </button>
//               <button
//                 onClick={() => handleFilterChange('expiring soon')}
//                 className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                   viewMode === 'expiring soon'
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Expiring Soon
//               </button>
//               <button
//                 onClick={() => handleFilterChange('expired')}
//                 className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                   viewMode === 'expired'
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Expired
//               </button>
//             </nav>
//           </div>
//         </div>
        
//         {/* Policies Table */}
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Policy ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Customer Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Vehicle Number
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Duration
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Start Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Expiry Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {paginatedPolicies.length > 0 ? (
//                   paginatedPolicies.map((policy) => (
//                     <tr key={policy.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {policy.id}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {policy.customerName}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {policy.vehicleNumber}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {policy.duration}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {policy.startDate}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {policy.expiryDate}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                           ${policy.status === 'Active' ? 'bg-green-100 text-green-800' : 
//                             policy.status === 'Expiring Soon' ? 'bg-yellow-100 text-yellow-800' : 
//                             'bg-red-100 text-red-800'}`}>
//                           {policy.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <div className="flex space-x-2">
//                           <button
//                             className="text-blue-600 hover:text-blue-900"
//                             title="View Policy"
//                           >
//                             <Eye size={18} />
//                           </button>
//                           <button
//                             className="text-indigo-600 hover:text-indigo-900"
//                             title="Edit Policy"
//                           >
//                             <Pencil size={18} />
//                           </button>
//                           <button
//                             onClick={() => handleDeletePolicy(policy.id)}
//                             className="text-red-600 hover:text-red-900"
//                             title="Delete Policy"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
//                       No policies found matching your criteria.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
          
//           {/* Pagination */}
//           {filteredPolicies.length > itemsPerPage && (
//             <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
//               <div>
//                 <p className="text-sm text-gray-700">
//                   Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
//                   <span className="font-medium">
//                     {Math.min(startIndex + itemsPerPage, filteredPolicies.length)}
//                   </span>{' '}
//                   of <span className="font-medium">{filteredPolicies.length}</span> results
//                 </p>
//               </div>
//               <div>
//                 <nav className="flex items-center space-x-1">
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className={`px-3 py-1 rounded-md ${
//                       currentPage === 1
//                         ? 'text-gray-400 cursor-not-allowed'
//                         : 'text-gray-700 hover:bg-gray-50'
//                     }`}
//                   >
//                     Previous
//                   </button>
                  
//                   {pageNumbers.map((page) => (
//                     <button
//                       key={page}
//                       onClick={() => handlePageChange(page)}
//                       className={`px-3 py-1 rounded-md ${
//                         currentPage === page
//                           ? 'bg-blue-50 text-blue-600 font-semibold'
//                           : 'text-gray-700 hover:bg-gray-50'
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   ))}
                  
//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className={`px-3 py-1 rounded-md ${
//                       currentPage === totalPages
//                         ? 'text-gray-400 cursor-not-allowed'
//                         : 'text-gray-700 hover:bg-gray-50'
//                     }`}
//                   >
//                     Next
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminPolicies;

import React, { useState } from 'react';
import Header from '../../components/Header';
import { usePolicy } from '../../context/PolicyContext';
import { Pencil, Trash2, Eye, Search } from 'lucide-react';
import { AlertTriangle, X } from "lucide-react";

const AdminPolicies = () => {
  const { policies, deletePolicy } = usePolicy();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all', 'active', 'expiring', 'expired'
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [expiryFilter, setExpiryFilter] = useState('');


  
  const itemsPerPage = 5;
  
  // Filter and search policies
  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = 
      policy.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (viewMode === 'all') return matchesSearch;
    return matchesSearch && policy.status.toLowerCase() === viewMode.toLowerCase();
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
    setCurrentPage(1); // Reset to first page on filter change
  };
  

  const handleDeletePolicy = (id) => {
  setSelectedPolicyId(id);
  setDeleteModalOpen(true);
};

const confirmDeletePolicy = (id) => {
  deletePolicy(id); // from context
  setDeleteModalOpen(false);
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
             <select
  value={expiryFilter}
  onChange={(e) => setExpiryFilter(e.target.value)}
  className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
>
  <option value="">Expiring Filter</option>
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
                {paginatedPolicies.length > 0 ? (
                  paginatedPolicies.map((policy) => (
                    <tr key={policy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {policy.id}
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
                        {policy.startDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {policy.expiryDate}
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
                          {/* <button
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit Policy"
                          >
                            <Pencil size={18} />
                          </button> */}
                          <button
                            onClick={() => handleDeletePolicy(policy.id)}
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
    policyId={selectedPolicyId}
    onCancel={() => setDeleteModalOpen(false)}
    onConfirm={confirmDeletePolicy}
  />
)}
    </div>
    </div>
  );
};

const PolicyModal = ({ customerId ,policy, onClose }) => {
  
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md max-h-[90vh] rounded-lg shadow-lg overflow-y-auto space-y-2">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Policy Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>

        <div className="px-6 py-4 space-y-4 text-sm">
          <div className="flex justify-between">
            <div><strong>Policy ID</strong><br />{policy.id}</div>
            <div><strong>Status</strong><br />
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Active</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><strong>Customer Name</strong><br />{policy.customerName}</div>
            {/* <div><strong>Phone Number</strong><br />{policy.phone}</div> */}
            <div><strong>Email</strong><br />{policy.email}</div>
            <div><strong>Vehicle Number</strong><br />{policy.vehicleNumber}</div>
            <div><strong>Start Date</strong><br />{policy.startDate}</div>
            <div><strong>Expiry Date</strong><br />{policy.expiryDate}</div>
            <div><strong>Duration</strong><br />{policy.duration}</div>
            {/* <div><strong>Amount Paid</strong><br />₹{policy.amountPaid}</div> */}
            <div className="col-span-2"><strong>Address</strong><br />{policy.address}</div>
          </div>

          <div className="pt-4">
            {/* <h3 className="font-semibold mb-2">Policy History</h3> */}
            {/* <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2 border">Date</th>
                  <th className="text-left p-2 border">Action</th>
                  <th className="text-left p-2 border">Details</th>
                </tr>
              </thead>
              <tbody>
                {policy.history.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border">{item.date}</td>
                    <td className="p-2 border">{item.action}</td>
                    <td className="p-2 border">{item.details}</td>
                  </tr>
                ))}
              </tbody>
            </table> */}
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded">Close</button>
          {/* <button className="px-4 py-2 bg-blue-600 text-white rounded">Edit Policy</button> */}
        </div>
      </div>
    </div>
  );
}


const DeleteConfirmationModal = ({ policyId, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow-xl relative">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
          onClick={onCancel}
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center text-red-600 mb-4">
          <AlertTriangle size={48} />
        </div>

        {/* Text */}
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
          Delete Policy?
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Are you sure you want to permanently delete policy{" "}
          <strong>{policyId}</strong>? This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(policyId)}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};


export default AdminPolicies;