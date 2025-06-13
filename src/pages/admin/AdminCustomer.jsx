// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const AdminCustomer = () => {
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [editCustomer, setEditCustomer] = useState(null);

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     try {
//       const response = await axios.get('https://rsa-backend.onrender.com/api/customers'); // update this if needed
//       setCustomers(response.data);
//       console.log("this is my response",response)
//     } catch (error) {
//       console.error('Error fetching customers:', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`https://rsa-backend.onrender.com/api/customers/${id}`);
//       fetchCustomers();
//     } catch (error) {
//       console.error('Error deleting customer:', error);
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       await axios.put(`https://rsa-backend.onrender.com/api/customers/${editCustomer._id}`, editCustomer);
//       setEditCustomer(null);
//       fetchCustomers();
//     } catch (error) {
//       console.error('Error updating customer:', error);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-xl font-bold mb-4">Manage Customers</h1>
//       <div className="overflow-x-auto bg-white shadow rounded">
//         <table className="min-w-full table-auto">
//           <thead>
//             <tr className="bg-gray-200 text-left">
//               <th className="p-3">ID</th>
//               <th className="p-3">Name</th>
//               <th className="p-3">Email</th>
//               <th className="p-3">Phone</th>
//               <th className="p-3">Vehicle Number</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {customers.map((customer, index) => (
//               <tr key={customer._id} className="border-t">
//                 <td className="p-3">{index + 1}</td>
//                 <td className="p-3">{customer.customerName}</td>
//                 <td className="p-3">{customer.email}</td>
//                 <td className="p-3">{customer.phoneNumber}</td>
//                 <td className="p-3">{customer.vehicleNumber}</td>
//                 <td className="p-3 space-x-2">
//                   <button className="text-blue-600" onClick={() => setSelectedCustomer(customer)}>View</button>
//                   <button className="text-green-600" onClick={() => setEditCustomer(customer)}>Edit</button>
//                   <button className="text-red-600" onClick={() => handleDelete(customer._id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* View Modal */}
//       {selectedCustomer && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
//             <p><strong>Name:</strong> {selectedCustomer.customerName}</p>
//             <p><strong>Email:</strong> {selectedCustomer.email}</p>
//             <p><strong>Phone:</strong> {selectedCustomer.phoneNumber}</p>
//             <p><strong>Vehicle:</strong> {selectedCustomer.vehicleNumber}</p>
//             <button
//               className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//               onClick={() => setSelectedCustomer(null)}
//             >Close</button>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editCustomer && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">Edit Customer</h2>
//             <input
//               type="text"
//               className="w-full mb-2 p-2 border"
//               value={editCustomer.customerName}
//               onChange={(e) => setEditCustomer({ ...editCustomer, customerName: e.target.value })}
//             />
//             <input
//               type="email"
//               className="w-full mb-2 p-2 border"
//               value={editCustomer.email}
//               onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
//             />
//             <input
//               type="text"
//               className="w-full mb-2 p-2 border"
//               value={editCustomer.phoneNumber}
//               onChange={(e) => setEditCustomer({ ...editCustomer, phoneNumber: e.target.value })}
//             />
//             <input
//               type="text"
//               className="w-full mb-2 p-2 border"
//               value={editCustomer.vehicleNumber}
//               onChange={(e) => setEditCustomer({ ...editCustomer, vehicleNumber: e.target.value })}
//             />
//             <div className="flex space-x-2 mt-4">
//               <button
//                 className="bg-green-500 text-white px-4 py-2 rounded"
//                 onClick={handleUpdate}
//               >Update</button>
//               <button
//                 className="bg-gray-500 text-white px-4 py-2 rounded"
//                 onClick={() => setEditCustomer(null)}
//               >Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminCustomer;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Customers = () => {
//   

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-xl font-bold mb-4">Manage Customers</h1>
//       <div className="overflow-x-auto bg-white shadow rounded">
//         <table className="min-w-full table-auto">
//           <thead>
//             <tr className="bg-gray-200 text-left">
//               <th className="p-3">ID</th>
//               <th className="p-3">Name</th>
//               <th className="p-3">Email</th>
//               <th className="p-3">Phone</th>
//               <th className="p-3">Vehicle Number</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {customers.map((customer, index) => (
//               <tr key={customer._id} className="border-t">
//                 <td className="p-3">{index + 1}</td>
//                 <td className="p-3">{customer.customerName}</td>
//                 <td className="p-3"></td>
//                 <td className="p-3"></td>
//                 <td className="p-3"></td>
//                 <td className="p-3 space-x-2">
//                   <button className="text-blue-600" onClick={() => setSelectedCustomer(customer)}>View</button>
//                   <button className="text-green-600" onClick={() => setEditCustomer(customer)}>Edit</button>
//                   <button className="text-red-600" onClick={() => handleDelete(customer._id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* View Modal */}
//       {selectedCustomer && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
//             <p><strong>Name:</strong> {selectedCustomer.customerName}</p>
//             <p><strong>Email:</strong> {selectedCustomer.email}</p>
//             <p><strong>Phone:</strong> {selectedCustomer.phoneNumber}</p>
//             <p><strong>Vehicle:</strong> {selectedCustomer.vehicleNumber}</p>
//             <button
//               className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//               onClick={() => setSelectedCustomer(null)}
//             >Close</button>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editCustomer && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">Edit Customer</h2>
//             <input
//               type="text"
//               className="w-full mb-2 p-2 border"
//               value={editCustomer.customerName}
//               onChange={(e) => setEditCustomer({ ...editCustomer, customerName: e.target.value })}
//             />
//             <input
//               type="email"
//               className="w-full mb-2 p-2 border"
//               value={editCustomer.email}
//               onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
//             />
//             <input
//               type="text"
//               className="w-full mb-2 p-2 border"
//               value={editCustomer.phoneNumber}
//               onChange={(e) => setEditCustomer({ ...editCustomer, phoneNumber: e.target.value })}
//             />
//             <input
//               type="text"
//               className="w-full mb-2 p-2 border"
//               value={editCustomer.vehicleNumber}
//               onChange={(e) => setEditCustomer({ ...editCustomer, vehicleNumber: e.target.value })}
//             />
//             <div className="flex space-x-2 mt-4">
//               <button
//                 className="bg-green-500 text-white px-4 py-2 rounded"
//                 onClick={handleUpdate}
//               >Update</button>
//               <button
//                 className="bg-gray-500 text-white px-4 py-2 rounded"
//                 onClick={() => setEditCustomer(null)}
//               >Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Customers = () => {
//   

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-xl font-bold mb-4">Manage Customers</h1>
//       <div className="overflow-x-auto bg-white shadow rounded">
//         <table className="min-w-full table-auto">
//           <thead>
//             <tr className="bg-gray-200 text-left">
//               <th className="p-3">ID</th>
//               <th className="p-3">Name</th>
//               <th className="p-3">Email</th>
//               <th className="p-3">Phone</th>
//               <th className="p-3">Vehicle Number</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {customers.map((customer, index) => (
//               <tr key={customer._id} className="border-t">
//                 <td className="p-3">{index + 1}</td>
//                 <td className="p-3">{customer.customerName}</td>
//                 <td className="p-3"></td>
//                 <td className="p-3"></td>
//                 <td className="p-3"></td>
//                 <td className="p-3 space-x-2">
//                   <button className="text-blue-600" onClick={() => setSelectedCustomer(customer)}>View</button>
//                   <button className="text-green-600" onClick={() => setEditCustomer(customer)}>Edit</button>
//                   <button className="text-red-600" onClick={() => handleDelete(customer._id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* View Modal */}
//       {selectedCustomer && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
//             <p><strong>Name:</strong> {selectedCustomer.customerName}</p>
//             <p><strong>Email:</strong> {selectedCustomer.email}</p>
//             <p><strong>Phone:</strong> {selectedCustomer.phoneNumber}</p>
//             <p><strong>Vehicle:</strong> {selectedCustomer.vehicleNumber}</p>
//             <button
//               className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//               onClick={() => setSelectedCustomer(null)}
//             >Close</button>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editCustomer && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">Edit Customer</h2>
//             <input
//               type="text"
//               className="w-full mb-2 p-2 border"
//               value={editCustomer.customerName}
//               onChange={(e) => setEditCustomer({ ...editCustomer, customerName: e.target.value })}
//             />
//             <input
//               type="email"
//               className="w-full mb-2 p-2 border"
//               value={editCustomer.email}
//               onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
//             />
//             <input
//               type="text"
//               className="w-full mb-2 p-2 border"
//               value={editCustomer.phoneNumber}
//               onChange={(e) => setEditCustomer({ ...editCustomer, phoneNumber: e.target.value })}
//             />
//             <input
//               type="text"
//               className="w-full mb-2 p-2 border"
//               value={editCustomer.vehicleNumber}
//               onChange={(e) => setEditCustomer({ ...editCustomer, vehicleNumber: e.target.value })}
//             />
//             <div className="flex space-x-2 mt-4">
//               <button
//                 className="bg-green-500 text-white px-4 py-2 rounded"
//                 onClick={handleUpdate}
//               >Update</button>
//               <button
//                 className="bg-gray-500 text-white px-4 py-2 rounded"
//                 onClick={() => setEditCustomer(null)}
//               >Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


// import React, { useState, useEffect } from 'react';
// import Header from '../../components/Header';
// import { usePolicy } from '../../context/PolicyContext';
// import { Pencil, Trash2, Eye, Search } from 'lucide-react';
// import DeleteConfirmationModal from '../../components/DeleteConfirmationModal'
// import PolicyModal from "../../components/PolicyModal"
// import axios from 'axios';

// const Customers = () => {
//   const { policies, deletePolicy } = usePolicy();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [viewMode, setViewMode] = useState('all'); // 'all', 'active', 'expiring', 'expired'
//   const [currentPage, setCurrentPage] = useState(1);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedPolicy, setSelectedPolicy] = useState(null);

//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedPolicyId, setSelectedPolicyId] = useState(null);

  
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
//   setSelectedPolicyId(id);
//   setDeleteModalOpen(true);
// };

// const confirmDeletePolicy = (id) => {
//   deletePolicy(id); // from context
//   setDeleteModalOpen(false);
// };
  
//   // Generate page numbers for pagination
//   const pageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }


//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [editCustomer, setEditCustomer] = useState(null);

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     try {
//       const response = await axios.get('https://rsa-backend.onrender.com/api/customers'); // update this if needed
//       setCustomers(response.data);
//       console.log("this is my response",response)
//     } catch (error) {
//       console.error('Error fetching customers:', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`https://rsa-backend.onrender.com/api/customers/${id}`);
//       fetchCustomers();
//     } catch (error) {
//       console.error('Error deleting customer:', error);
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       await axios.put(`https://rsa-backend.onrender.com/api/customers/${editCustomer._id}`, editCustomer);
//       setEditCustomer(null);
//       fetchCustomers();
//     } catch (error) {
//       console.error('Error updating customer:', error);
//     }
//   };
  
//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <Header />
      
//       <main className="flex-1 container mx-auto px-4 py-8">
//         <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Manage Customers</h1>
//           </div>
          
//           <div className="flex items-center space-x-2">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search Customers..."
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>
//         </div>
                
//         {/* Customers Table */}
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Phone
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Vehicle Number
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {paginatedPolicies.length > 0 ? (
//                   customers.map((customer, index) => (
//                     <tr key={customer._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {index + 1}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {customer.customerName}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {customer.email}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {customer.phoneNumber}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {customer.vehicleNumber}
//                       </td>
                    
                      
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => {
//                               setSelectedCustomer(customer)
//                               setModalOpen(true);
//                             }}
//                             className="text-blue-600 hover:text-blue-900"
//                             title="View Customer"
//                           >
//                             <Eye size={18} />
//                           </button>
//                           <button
//                             className="text-indigo-600 hover:text-indigo-900"
//                             title="Edit Customer"
//                           >
//                             <Pencil size={18} />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(customer._id)}
//                             className="text-red-600 hover:text-red-900"
//                             title="Delete Customer"
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
//       <div>
//       {modalOpen && selectedPolicy && (
//         <PolicyModal
//         policy={selectedPolicy}
//         onClose={() => {
//         setModalOpen(false);
//         setSelectedPolicy(null);
//       }}
//       />
//     )}      
//     </div>
//     <div>
//       {deleteModalOpen && (
//   <DeleteConfirmationModal
//     policyId={selectedPolicyId}
//     onCancel={() => setDeleteModalOpen(false)}
//     onConfirm={confirmDeletePolicy}
//   />
// )}
//     </div>
//     </div>
//   );
// };

// export default Customers;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Customers = () => {
//   

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-xl font-bold mb-4">Manage Customers</h1>
//       <div className="overflow-x-auto bg-white shadow rounded">
//         <table className="min-w-full table-auto">
//           <thead>
//             <tr className="bg-gray-200 text-left">
//               <th className="p-3">ID</th>
//               <th className="p-3">Name</th>
//               <th className="p-3">Email</th>
//               <th className="p-3">Phone</th>
//               <th className="p-3">Vehicle Number</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {customers.map((customer, index) => (
//               <tr key={customer._id} className="border-t">
//                 <td className="p-3">{index + 1}</td>
//                 <td className="p-3">{customer.customerName}</td>
//                 <td className="p-3"></td>
//                 <td className="p-3"></td>
//                 <td className="p-3"></td>
//                 <td className="p-3 space-x-2">
//                   <button className="text-blue-600" onClick={() => setSelectedCustomer(customer)}>View</button>
//                   <button className="text-green-600" onClick={() => setEditCustomer(customer)}>Edit</button>
//                   <button className="text-red-600" onClick={() => handleDelete(customer._id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* View Modal */}
//       {selectedCustomer && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
//             <p><strong>Name:</strong> {selectedCustomer.customerName}</p>
//             <p><strong>Email:</strong> {selectedCustomer.email}</p>
//             <p><strong>Phone:</strong> {selectedCustomer.phoneNumber}</p>
//             <p><strong>Vehicle:</strong> {selectedCustomer.vehicleNumber}</p>
//             <button
//               className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//               onClick={() => setSelectedCustomer(null)}
//             >Close</button>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editCustomer && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">Edit Customer</h2>
//             <input
//               type="text"
//               className="w-full mb-2 p-2 border"
//               value={editCustomer.customerName}
//               onChange={(e) => setEditCustomer({ ...editCustomer, customerName: e.target.value })}
//             />
//             <input
//               type="email"
//               className="w-full mb-2 p-2 border"
//               value={editCustomer.email}
//               onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
//             />
//             <input
//               type="text"
//               className="w-full mb-2 p-2 border"
//               value={editCustomer.phoneNumber}
//               onChange={(e) => setEditCustomer({ ...editCustomer, phoneNumber: e.target.value })}
//             />
//             <input
//               type="text"
//               className="w-full mb-2 p-2 border"
//               value={editCustomer.vehicleNumber}
//               onChange={(e) => setEditCustomer({ ...editCustomer, vehicleNumber: e.target.value })}
//             />
//             <div className="flex space-x-2 mt-4">
//               <button
//                 className="bg-green-500 text-white px-4 py-2 rounded"
//                 onClick={handleUpdate}
//               >Update</button>
//               <button
//                 className="bg-gray-500 text-white px-4 py-2 rounded"
//                 onClick={() => setEditCustomer(null)}
//               >Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Pencil, Trash2, Eye, Search } from 'lucide-react';
import axios from 'axios';

const Admincustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('https://rsa-backend.onrender.com/api/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const confirmDelete = (customer) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!customerToDelete) return;
    try {
      await axios.delete(`https://rsa-backend.onrender.com/api/customers/${customerToDelete._id}`);
      fetchCustomers();
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://rsa-backend.onrender.com/api/customers/${editCustomer._id}`, editCustomer);
      setEditCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Manage Customers</h1>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Customers..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((customer, index) => (
                    <tr key={customer._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{customer.customerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{customer.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{customer.phoneNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{customer.vehicleNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setViewModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                          onClick={() => setEditCustomer(customer)}
                          className="text-indigo-600 hover:text-indigo-900" title="Edit">
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => confirmDelete(customer)}
                            className="text-red-600 hover:text-red-900"
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
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredCustomers.length)}
                </span>{' '}
                of <span className="font-medium">{filteredCustomers.length}</span> results
              </p>
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
          )}
        </div>

        {/* View Customer Modal */}
        {viewModalOpen && selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-[400px]">
              <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
              <p><strong>Name:</strong> {selectedCustomer.customerName}</p>
              <p><strong>Email:</strong> {selectedCustomer.email}</p>
              <p><strong>Phone:</strong> {selectedCustomer.phoneNumber}</p>
              <p><strong>Vehicle:</strong> {selectedCustomer.vehicleNumber}</p>
              <div className="mt-4 text-right">
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
 {editCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Customer</h2>
            <input
              type="text"
              className="w-full mb-2 p-2 border"
              value={editCustomer.customerName}
              onChange={(e) => setEditCustomer({ ...editCustomer, customerName: e.target.value })}
            />
            <input
              type="email"
              className="w-full mb-2 p-2 border"
              value={editCustomer.email}
              onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
            />
            <input
              type="text"
              className="w-full mb-2 p-2 border"
              value={editCustomer.phoneNumber}
              onChange={(e) => setEditCustomer({ ...editCustomer, phoneNumber: e.target.value })}
            />
            <input
              type="text"
              className="w-full mb-2 p-2 border"
              value={editCustomer.vehicleNumber}
              onChange={(e) => setEditCustomer({ ...editCustomer, vehicleNumber: e.target.value })}
            />
            <div className="flex space-x-2 mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleUpdate}
              >Update</button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setEditCustomer(null)}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && customerToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-[400px]">
              <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
              <p>Are you sure you want to delete <strong>{customerToDelete.customerName}</strong>?</p>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setCustomerToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirmed}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>





        )}
      </main>
    </div>
  );
};

export default Admincustomer;
